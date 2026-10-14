XONG — muse gói C, 23:37 14/10/2026

# Báo cáo gói C — Trí tuệ nhân tạo

## 1. Thông tin phiên

- Bên: muse
- Gói: C (Trí tuệ nhân tạo)
- SHA đầu phiên: 885534549808f42aec7f9af5743bbf86642ee4bd
- Trạng thái kho đầu phiên (`git status --short`):
  - `?? .agents/`
  - `?? .codex/`
  - `?? AGENTS.md`
  - Ba mục trên là tập tin bên xem xét mã nguồn tự sinh, nằm ngoài phạm vi đọc của phiên này.
- Giờ bắt đầu: 23:24 14/10/2026
- Máy đo: máy chạy lượt này (số tham chiếu cùng máy ở `common\perf\perf-ref.json`).

## 2. Phạm vi đã đọc

Phạm vi gói: `packages/ai/**` và tập tin trí tuệ nhân tạo của chương trình. Đã đọc hết 37 tập tin `packages/ai` và 15 tập tin sản phẩm phía chương trình (liệt kê lệnh ở phiên làm việc, khớp 60 tập tin ở `baseline.md`).

| Tập tin | Dòng đã đọc | Ghi chú |
|---|---|---|
| `packages/ai/src/adapter.ts` | hết | mặt tiếp hợp điều phối |
| `packages/ai/src/blocklists.ts` | hết | đối chiếu từng mục với G5 §8 |
| `packages/ai/src/code-points.ts` | hết | đếm theo điểm mã |
| `packages/ai/src/errors.ts` | hết | mã lỗi, cắt 200 ký tự |
| `packages/ai/src/extract-json.ts` | hết | lấy khối JSON, trả lời cắt |
| `packages/ai/src/index.ts` | hết | xuất lại toàn bộ |
| `packages/ai/src/input.ts` | hết | đầu vào trích xuất |
| `packages/ai/src/mock-adapter.ts` | hết | trả lời mẫu theo đầu vào |
| `packages/ai/src/models.ts` | hết | danh sách mẫu |
| `packages/ai/src/run.ts` | hết | điều phối, thử lại, khóa một yêu cầu |
| `packages/ai/src/schema.ts` | hết | lược đồ, đầu vào, câu mẫu |
| `packages/ai/src/settings.ts` | hết | đọc cấu hình đã lưu |
| `packages/ai/src/test-support.ts` | hết | hồ sơ mẫu cho kiểm thử |
| `packages/ai/src/text-match.ts` | hết | so khớp G5 §7 |
| `packages/ai/src/validator.ts` | hết | V1–V7 |
| `packages/ai/src/web.ts` | hết | phiên ChatGPT web |
| `packages/ai/src/prompts/analysis.ts` | đầu + đối chiếu kiểm thử | `analysis@2`, 24 000 |
| `packages/ai/src/prompts/discovery.ts` | đầu + đối chiếu kiểm thử | `discovery@2`, 24 000 |
| `packages/ai/src/prompts/extraction.ts` | đầu + đối chiếu kiểm thử | `extraction@1`, 12 000 |
| `packages/ai/src/prompts/connection.ts` | hết | kiểm tra nối, 1 024 |
| `packages/ai/src/prompts/retry.ts` | hết | tin thử lại, 2 lần thử |
| `apps/desktop/src/data/ai-analysis.ts` | hết | gọi AI phía chương trình, bỏ khi thay dữ liệu |
| `apps/desktop/src/data/ai-jobs.ts` | hết | giữ việc đang chạy |
| `apps/desktop/src/data/ai-tauri.ts` | hết | lệnh gọi qua Rust |
| `apps/desktop/src/routes/ai-error-view.ts` | hết | câu báo lỗi dùng chung |
| `apps/desktop/src/routes/settings-ai-view.ts` | hết | kiểm khóa, chữ kiểm tra nối |
| `apps/desktop/src/routes/SettingsAi.tsx` | hết | màn Cài đặt → Trí tuệ nhân tạo |
| `apps/desktop/src/routes/appointments/appointment-ai-view.ts` | hết | khung AI ở lịch hẹn |
| `apps/desktop/src/routes/appointments/AppointmentAi.tsx` | hết | hiện khung AI ở lịch hẹn |
| `apps/desktop/src/routes/customers/ai-panel-view.ts` | hết | khung nhìn panel |
| `apps/desktop/src/routes/customers/extraction-view.ts` | hết | khung nhìn trích xuất |
| `apps/desktop/src/routes/customers/KycExtraction.tsx` | hết | ghi chú kèm trích xuất |
| `apps/desktop/src/routes/customers/KycHistory.tsx` | hết | lịch sử, báo cáo loại |
| `apps/desktop/src/routes/customers/KycIntelligence.tsx` | hết | panel trí tuệ |
| `apps/desktop/src/routes/customers/KycWebSession.tsx` | hết | phiên chờ dán |
| `apps/desktop/src/routes/customers/use-ai-job.ts` | hết | móc giữ việc |
| Mã nối vào: `packages/db/src/ai-analyses.ts` (ghi, đọc, CURRENT/STALE) | 80–300 | chỉ chỗ gói nối vào |
| Mã nối vào: `apps/desktop/src/data/app-data.ts` (thế hệ, khóa ghi, hàng đợi) | 330–436 | chỉ chỗ gói nối vào |
| Mã nối vào: `apps/desktop/src-tauri/src/ai.rs` (giới hạn, mã lỗi) | tìm theo mẫu | chỉ chỗ gói nối vào |
| Tài liệu: `phase-5-ai.md`, `phase-5-prompts.md`, `ai-eval.md`, ADR-0009 D-1/G5/W-1, `phase-6-hoan-thien.md` §4.1, `phase-6.md` | các mục gói C | nguồn đúng để đối chiếu |

Kiểm thử đã chạy (máy lượt này, 23:31–23:32 14/10/2026, không chạy gì khác):

- `pnpm vitest run packages/ai`: 15 tập tin, 598 kiểm thử, xanh.
- `pnpm vitest run` 8 tập tin kiểm thử AI phía chương trình: 185 kiểm thử, xanh.

## 3. Phát hiện

```
ID: MU-C1
Mức: Low
Trục: D
Vị trí: packages/ai/src/schema.ts:106 (8855345); cùng packages/db/src/ai-analyses.ts:142-148
Tình trạng: CONFIRMED
Mô tả: Chữ do mẫu viết chứa ký tự NUL qua được V1, lưu vào `output_json`, đọc lại vỡ JSON.
Tái hiện / bằng chứng: `node muse/C/probe-nul.mjs` → `V1-V6 với NUL trong text: []`; `extractJson` đọc thoát
  `\u0000` thành NUL thật; `node muse/C/probe-nul-sql.mjs` → ghi 16 ký tự, đọc lại còn `{"text":"ab`,
  `JSON.parse: VỠ`. Mã lệnh ghi chỉ làm sạch `raw_output` (`storedRawOutput`), giữ nguyên `input_json`,
  `output_json`, `validator_json`.
Ảnh hưởng: Người dùng gặp đúng khi câu trả lời của mẫu (hay câu dán ChatGPT) chứa NUL: lệnh đọc
  vỡ khi tách JSON nên hồ sơ đó không đọc được, bản xuất chứa chữ vỡ nên bản nhập sau hỏng theo.
  Điều kiện hiếm (đầu ra suy biến).
Đề xuất: V1 từ chối NUL trong `text` của lược đồ AI; hoặc lệnh ghi thay NUL như `raw_output`. Cỡ nhỏ.
```

```
ID: MU-C2
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/SettingsAi.tsx:309 (8855345)
Tình trạng: CONFIRMED
Mô tả: Chú thích còn ghi yêu cầu kiểm tra nối tối đa 64 token, trong khi mức thật là 1 024.
Tái hiện / bằng chứng: `Select-String` dòng 309 `the request is 64 tokens at most`; `connection.ts:13`
  `maxTokens: 1_024` (đổi 64 → 1 024 ở DR5-23, kiểm thử `prompts.test.ts` khóa mức 1 024, đã chạy xanh).
Ảnh hưởng: Người đọc mã hiểu sai chi phí lần kiểm tra nối.
Đề xuất: Sửa chú thích thành 1 024 token. Cỡ một dòng.
```

## 4. Phình code

| Đã chạy / đọc gì | Dữ liệu | Số | Mã phát hiện |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` gói AI | mã gói | 0 chỗ thừa | không |
| `tsc` như trên ở chương trình, lọc tập tin AI | mã gói | 0 chỗ thừa | không |
| `pnpm lint:deps` | toàn kho | 0 vi phạm (309 mô đun, 1 244 phụ thuộc) | không |
| Tìm nơi dùng từng export mẫu (`lastAnswer`, `EMPTY_RAW_OUTPUT`, `CHATGPT_URL`, `modelList`, `takesReasoning`, `panelDone`, `webChip`, `historyRows`, `analysisSource`, `checkShown`) | toàn kho | mỗi export đều có nơi dùng | không |
| Đọc hết export công khai của `@p2c/ai` và khung nhìn | mã gói | không export chết mới (mục KNOWN về phạm vi export giữ nguyên) | không |
| Lặp mã từ 3 nơi | mã gói | không thấy mới (các mục lặp KNOWN giữ nguyên) | không |
| Phụ thuộc của `@p2c/ai` | `package.json` | chỉ `@p2c/domain` + `zod` | không |
| Gói web (`baseline.md`, lượt chuẩn bị đo, không đo lại) | bản dựng web | `index.js` 891 942 thô / 262 010 nén; không có khối AI riêng | không |

Không có phát hiện B. Bản đồ export ở `CLAUDE.md` khớp mã (cổng `verify` ở `baseline.md` xanh).

## 5. Hiệu năng

Máy đo: máy chạy lượt này, lúc đo không chạy gì khác ngoài phiên này. Ngưỡng: thao tác màn < 200 ms
(`docs/metrics/phase-6.md`); số tham chiếu cùng máy ở `common\perf\perf-ref.json`.

| Đã chạy / đo gì | Dữ liệu | Số | Mã phát hiện |
|---|---|---|---|
| `vitest run packages/ai` | 598 kiểm thử | xanh, 801 ms cả bộ | không |
| `vitest run` 8 tập tin AI phía chương trình | 185 kiểm thử | xanh, 1,74 s cả bộ | không |
| `extractJson` chữ 100 k | thăm dò `probe-perf.mjs`, 20 vòng | trung vị 0,01 ms | không |
| `validateOutput` V1–V6 | như trên, 200 vòng | trung vị 0,31 ms (lần lạnh xem dưới) | không |
| `checkWebAnswer` câu dán 20 k | như trên, 50 vòng | trung vị 0,24 ms | không |
| `runAnalysis` mẫu | như trên, 20 vòng | trung vị 0,66 ms | không |
| `runExtraction` mẫu | như trên, 20 vòng | trung vị 0,05 ms | không |
| `validateOutput` lần đầu mỗi tiến trình | `probe-cold.mjs`, 2 tiến trình mới | 211 ms rồi 0,5 ms các lần sau | không |
| Tham chiếu: `customer.open-ai` / `customer.ai-history` (`perf-ref.json`, lượt chuẩn bị đo) | dữ liệu tải, exe | 20 ms / 12 ms, dưới ngưỡng | không |

Không có phát hiện P. Lần kiểm lạnh ~210 ms là chi phí một lần mỗi phiên (dựng lược đồ lần đầu);
trong chương trình nó rơi vào lúc sinh dữ liệu mẫu hay nhập bản sao (đã đo các thao tác màn ở
`perf-ref.json` đều ấm và dưới ngưỡng), không rơi vào thao tác màn.

## 6. Bảng đếm mức nhân trục

| Mức | E | C | D | G | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Cộng | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |

Tỉ lệ PLAUSIBLE: 0% (cả hai phát hiện đều CONFIRMED).

## 7. Đã xét mà không thấy

- E (ca biên): đã đọc `run.ts` (thử lại, trần 200 000, Hủy, khóa một yêu cầu), `web.ts` (dán rỗng /
  tin app / quá dài), `extract-json.ts` (khối lồng, trả lời cắt, đọc lại), `schema.ts` (câu mẫu với
  đầu vào rỗng), `mock-adapter.ts` (mẫu trích xuất), `ai-jobs.ts` + `use-ai-job.ts` (ghi đè việc),
  `ai-analysis.ts` (bỏ khi thay dữ liệu), hộp thay dữ liệu khóa màn (`Settings.tsx`, `SettingsBackup.tsx`).
  Chạy `probe-perf.mjs` (dán 20 k, trích xuất mẫu). Không thấy mới ngoài các mục KNOWN.
- G (giữ AI): đối chiếu từng mục `blocklists.ts` và `text-match.ts` với G5 §7–§8; chạy 598 kiểm thử
  gói AI (gồm bảng ca C1–C51 và khóa chữ G5 nguyên văn). Không thấy lệch.
- S (ranh giới): đã đọc đường khóa (`checkKey`, lệnh Rust qua `ai-tauri.ts`, `save` lọc 4 trường),
  dữ liệu gửi tối thiểu (`buildAnalysisInput`), không `dangerouslySetInnerHTML` trong 6 màn AI,
  mở trang bằng địa chỉ cố định, `sessionId` ngẫu nhiên không mang dữ liệu khách. Không thấy lộ.
- P (hiệu năng): xem bảng mục 5. Không thấy vượt ngưỡng.
- B (phình): xem bảng mục 4. Không thấy mới.
- T (chất lượng kiểm thử): đã chạy xanh 783 kiểm thử phạm vi gói; đọc `prompts.test.ts`,
  `web.test.ts` (khóa chữ G5 gồm bọc `web@1`), bảng ca G5 §8.5, các ca C52–C54 dưới tên khác;
  đột biến lệch một trên bản chép `code-points.ts` bị bắt 5/8 ca. Không thấy kiểm thử yếu mới.
- A (trợ năng / i18n): đã đọc 6 màn AI (`role=status/alert`, giữ focus, bảng lịch sử), huy hiệu mã
  thô khớp mockup `ai.html`, các khóa động (`aiError.*`, `reasoning.*`, `group.*`, `levelName.*`)
  đều có trong `vi.ts`. Không thấy thiếu.

Trục C và D có phát hiện (MU-C2, MU-C1); các hợp đồng còn lại (thử lại 2 lần, STALE, phiên web
8 mục, trích xuất không lưu, một yêu cầu, mã lỗi) đã đối chiếu với đặc tả và khớp.

## 8. Phụ lục

### 8.1. Nguồn thăm dò / kiểm thử tạm / đột biến

Thăm dò NUL qua validator (`muse\C\probe-nul.mjs`):

```js
/* global process */
// Thăm dò: ký tự NUL trong chữ do mẫu viết có qua được V1 không.
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (!specifier.startsWith('.') || /\.\w+$/.test(specifier)) throw error;
      for (const suffix of ['.ts', '/index.ts']) {
        try {
          return nextResolve(specifier + suffix, context);
        } catch {
          // Thử tiếp.
        }
      }
      throw error;
    }
  },
});

const AI = 'file:///C:/workspace/Project-2C-review-2/packages/ai/src';
const { validateOutput } = await import(`${AI}/validator.ts`);
const { mockAnalysisOutput } = await import(`${AI}/schema.ts`);
const { extractJson } = await import(`${AI}/extract-json.ts`);

const codes = ['F1', 'F2', 'F3'];
const output = mockAnalysisOutput(codes, []);
// Chèn NUL vào một chuỗi chữ, như khi nội dung chứa thoát "\u0000".
output.needs[0] = { text: 'Kế hoạch tài chính\0 cho mục tiêu', evidence: ['F1'] };
const issues = validateOutput('analysis', output, { factCodes: codes, missingCategories: [] });
console.log('V1-V6 với NUL trong text:', JSON.stringify(issues));

// Khối JSON chứa "\u0000" có đọc được không.
const found = extractJson('{"a": "x\\u0000y"}');
console.log('extractJson với thoát NUL:', found.found ? JSON.stringify(found.value) : 'không thấy');

// Vòng JSON giữ NUL nguyên.
const kept = JSON.parse(JSON.stringify({ t: 'a\0b' })).t.length;
console.log('JSON giữ NUL, dài:', kept);
```

Kết quả: `V1-V6 với NUL trong text: []`; `extractJson với thoát NUL: {"a":"x\u0000y"}`;
`JSON giữ NUL, dài: 3`.

Thăm dò NUL qua sql.js (`muse\C\probe-nul-sql.mjs`):

```js
/* global process */
// Thăm dò: sql.js đọc lại chữ có NUL ra sao (chuỗi JSON có NUL sẽ vỡ khi đọc).
import initSqlJs from 'file:///C:/workspace/Project-2C-review-2/packages/db/node_modules/sql.js/dist/sql-wasm.js';

const SQL = await initSqlJs({
  locateFile: () =>
    'C:/workspace/Project-2C-review-2/packages/db/node_modules/sql.js/dist/sql-wasm.wasm',
});
const db = new SQL.Database();
db.run('CREATE TABLE t (v TEXT)');
const before = '{"text":"ab\0cd"}';
db.run('INSERT INTO t VALUES (?)', [before]);
const after = db.exec('SELECT v FROM t')[0].values[0];
console.log('ghi dài:', before.length, 'đọc dài:', after.length);
console.log('đọc lại:', JSON.stringify(after));
try {
  JSON.parse(after);
  console.log('JSON.parse: được');
} catch {
  console.log('JSON.parse: VỠ');
}
db.close();
```

Kết quả: ghi 16 ký tự, đọc lại còn `{"text":"ab`, `JSON.parse: VỠ`.

Thăm dò hiệu năng (`muse\C\probe-perf.mjs`, `muse\C\probe-cold.mjs`): đo các thao tác thuần như bảng
mục 5 (trung vị 0,01–0,66 ms; lần lạnh ~210 ms rồi ~0,5 ms). Nguồn đầy đủ giữ ở thư mục `muse\C\`.

Đột biến trên bản chép: chép `code-points.ts` ra `muse\C\mut-code-points.ts` (gốc) và
`muse\C\mut-code-points-bad.ts` (đổi `count < max` thành `count <= max` trong `cutAt`);
`muse\C\mut-driver.mjs` chạy lại 8 kiểm chính của `code-points.test.ts`: bản gốc qua hết, bản đột
biến rớt 5/8 → bị bắt.

### 8.2. Trạng thái kho cuối phiên

`git -C C:\workspace\Project-2C-review-2 status --short`:

- `?? .agents/`
- `?? .codex/`
- `?? AGENTS.md`

Giống đầu phiên (ba mục bên xem xét mã nguồn tự sinh, để nguyên).

### 8.3. Giờ xong

23:37 14/10/2026.
