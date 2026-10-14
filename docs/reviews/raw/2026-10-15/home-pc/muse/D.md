XONG — muse gói D, 23:59 14/10/2026

# Gói D. Màn nhập liệu — muse

## 1. Thông tin phiên

- Bên: muse
- Gói: D (Màn nhập liệu)
- SHA đầu phiên: 885534549808f42aec7f9af5743bbf86642ee4bd (đúng SHA ghim)
- Trạng thái kho đầu phiên (`git status --short`):
  - `?? .agents/`
  - `?? .codex/`
  - `?? AGENTS.md`
  - (Ba mục này là tập tin không theo dõi sẵn có, không phải do phiên này tạo; sẽ đối chiếu cuối phiên.)
- Giờ bắt đầu: 23:40 14/10/2026
- Máy: Home PC (máy chạy lượt này; đối chiếu với `common\perf\perf-ref.json`, không so với số nền Office Laptop trong `phase-6.md`)

## 2. Phạm vi đã đọc

Đọc sâu từng tập tin trong gói ở SHA ghim:

- `packages/ui`: `src/index.ts`, `src/token-guard.ts`, `src/tokens.css`, `src/theme.css`, `src/components/` gồm `Button`, `Chart`, `Choices`, `DataTable`, `Dialog`, `NavIcon`, `PeriodPicker` + `PeriodPicker.label`, `PolicyBadge`, `Segmented`, `SelectField`, `StageBadge`, `TextField`, `chart-theme`, `compare-cells`, `show-more`; test `token-guard`, `chart-theme`, `compare-cells`, `PeriodPicker.label`, `show-more` (không đọc `scripts/`, `fonts/` — ngoài gói).
- Vỏ app `apps/desktop/src/shell/`: `AppShell`, `Sidebar`, `routes`, `useRoute`, `scope`, `ScopePicker`, `ScopeContext`, `RePicker`, `ErrorBoundary`, `screen-error`, `SaveWarning`, `CloseGuard` + `close-guard`, `block-reload`, `StartupError` + `startup-error`; test của `routes`, `scope`, `close-guard`, `block-reload`, `screen-error`, `startup-error` (không có test cho `useRoute`, `AppShell`, `Sidebar`, `ScopePicker`, `RePicker`, `ErrorBoundary`, `SaveWarning`, `CloseGuard`, `StartupError`).
- Chữ hiển thị `apps/desktop/src/i18n/`: `index.ts`, `vi.ts` (toàn bộ), `index.test.ts`.
- Khách hàng `apps/desktop/src/routes/customers/` (trừ tập tin AI và Hợp đồng): `customers-view` + test, `CustomersScreen` + test, `CustomerProfile`, `CustomerDialogs`, `CustomerKyc`, `CustomerAppointments`, `kyc-view` + test, `KycDialogs`.
- Team `apps/desktop/src/routes/team/`: `team-view` + test, `TeamScreen`, `TeamDialogs`, `PersonDialogs`.
- Gốc: `routes/Screen.tsx`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/ui-choices.test.tsx`, `apps/desktop/index.html`.
- Chỗ nối sang gói khác đã đọc thêm: `db/counts.ts` (`countCustomerRecords`), `db/customers.ts` (`listStageTransitions`), `db/appointments.ts` (`listAppointments`), `db/kyc.ts` (`normalizeKycValue`), `domain/kyc-fact.ts`, `domain/kyc-catalog.ts` (trường tiền), `domain/src/golden/kyc.fixture.ts` (dữ kiện tiền), `db/seed-data.ts` (dữ kiện tiền), `data/AppDataContext.tsx`, `routes/appointments/appointment-form.ts` (`withTime`, `dayText`, `isPastOrToday`), `routes/appointments/appointments-view.ts` (`statusLabel`, `outcomeText`, `outcomeResolver`, `STATUS_TONE`, `LINK`).
- Tài liệu đối chiếu: `CLAUDE.md` (gốc, `packages/ui`, `apps/desktop`), `CONTEXT.md`, `docs/design/phase-3-du-lieu.md`, `docs/design/phase-6-hoan-thien.md` (§4–§6), `docs/design/mockups/` (`customers`, `customer`, `customer-forms`, `kyc-forms`, `team`, `trash` 11f–11g, `phase-3-feedback` B1–B2), `docs/metrics/phase-6.md` (ngưỡng), `docs/testing/nghiem-thu-v1.md` (dòng NT-KH, NT-HS, NT-TM, NT-CH, NT-TR-05, mục lệch đã biết), `common/plan.md`, `common/known.md`, `common/baseline.md`.

Probe kiểm chứng đã chạy xong (xem phụ lục).

## 3. Phát hiện

```
ID: MU-D1
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/KycDialogs.tsx:92-148,309-325 (8855345)
Tình trạng: CONFIRMED
Mô tả: Hộp ghi chú KYC không đọc lại số tiền ở trường tiền, trái NT-HS-05 và
  mockup 7b; nhưng golden và seed lại chốt các trường này là chữ tự do — hai
  nguồn đúng mâu thuẫn nhau, cần Owner chốt hướng.
Tái hiện / bằng chứng: NT-HS-05 đòi "Thu nhập năm `6 tỷ` đọc
  "6.000.000.000 ₫ (6 tỷ)"" (docs/testing/nghiem-thu-v1.md:176) và mockup 7b vẽ
  dòng đọc lại (kyc-forms.html:214-215). Probe D/probe-kyc-money.mjs:
  `annualIncome ← "6 tỷ" ⇒ "6 tỷ" (kiểu text)` — không phân tích, lưu thô.
  Chiều ngược lại: golden kyc.fixture.ts:150 dùng `['annualIncome', 'Khoảng
  12 tỷ']`, seed-data.ts:255 dùng khoảng ('1–2 tỷ', 'Trên 10 tỷ') — chữ tự do,
  không thể ép thành một số. Mã ô nhập (FactValue, KycDialogs.tsx:120-133)
  không có hint đọc lại tiền cho bất cứ trường nào.
Ảnh hưởng: Dòng NT-HS-05 như đã viết sẽ trượt ở nghiệm thu; dữ kiện tiền lưu
  thô nên cùng một giá trị có nhiều dạng ("6 tỷ", "6000000000") nếu RE gõ khác
  nhau. Không mất dữ liệu (lưu đúng chữ đã gõ).
Đề xuất: Owner chốt một trong hai: (a) phân tích + đọc lại tiền khi gõ phân
  tích được (tái dùng parseVnd của domain), giữ chữ tự do cho khoảng/ước
  lượng; (b) giữ thiết kế chữ tự do. Cỡ (a): ≤ 400 dòng SP (kiểu trường,
  hint, test).
```

```
ID: MU-D2
Mức: Low
Trục: A
Vị trí: packages/ui/src/components/DataTable.tsx:189-202;
  apps/desktop/src/routes/customers/CustomersScreen.tsx:169-177 (8855345)
Tình trạng: PLAUSIBLE
Mô tả: Hai nút bấm tự gỡ khỏi màn sau khi bấm mà không chuyển focus đi, nên
  focus rơi về đầu trang: lần bấm "Hiện thêm" cuối cùng (chân bảng chuyển sang
  "Đã hiện hết", nút biến mất) và nút "+ n KH · xem dạng bảng" (đổi sang Bảng,
  nút biến mất).
Tái hiện / bằng chứng: Đã đọc DataTable.tsx:106-111,189-202 (setLimit rồi
  bỏ nút khi hết, không quản lý focus) và CustomersScreen.tsx:112,146-156,
  169-177 (setView gỡ nút). Chưa chạy trên DOM vì repo không có công cụ test
  component (KNOWN, G4).
Ảnh hưởng: Người dùng bàn phím và trình đọc màn hình mất vị trí sau hai thao
  tác thường dùng này, phải Tab lại từ đầu trang.
Đề xuất: Lần hiện cuối: focus tới dòng "Đã hiện hết" (tabIndex -1). Đổi sang
  Bảng: focus tới bảng hoặc tiêu đề màn. Cỡ nhỏ (vài chục dòng).
```

```
ID: MU-D3
Mức: Low
Trục: A
Vị trí: apps/desktop/src/shell/AppShell.tsx:30-60;
  apps/desktop/src/shell/useRoute.ts:34-45 (8855345)
Tình trạng: PLAUSIBLE
Mô tả: Đổi màn (sidebar, vào hồ sơ KH) không chuyển focus và không báo tên màn
  mới: phần tử đang focus bị gỡ theo màn cũ nên focus về body; h1 và main
  không có tabIndex, không có vùng aria-live nào báo màn mới.
Tái hiện / bằng chứng: Đã đọc AppShell.tsx (main/h1 thuần, ErrorBoundary
  key theo route nên gỡ màn cũ), useRoute.ts (đổi hash, không động tới
  focus), Screen.tsx, Sidebar.tsx. Tìm `tabIndex={-1}` trong shell/routes chỉ
  thấy ở tiêu đề KYC và mã dữ kiện (neo trong trang), không có ở cấp màn.
  Chưa chạy với trình đọc màn hình.
Ảnh hưởng: Trình đọc không báo đã sang màn nào; người dùng bàn phím phải Tab
  từ đầu sau mỗi lần đổi màn (may là sidebar nằm đầu nên vẫn đi tiếp được).
Đề xuất: Khi route đổi, focus tới h1 của màn (tabIndex -1) hoặc thêm aria-live
  báo tên màn. Cỡ nhỏ.
```

```
ID: MU-D4
Mức: Nit
Trục: B
Vị trí: packages/ui/src/components/chart-theme.ts:2 (TokenReader);
  packages/ui/src/components/show-more.ts:5 (ShowMoreFoot);
  packages/ui/src/token-guard.ts:6 (TokenViolation) (8855345)
Tình trạng: CONFIRMED
Mô tả: Ba kiểu có `export` nhưng không nơi nào ngoài tập tin định nghĩa nhắc
  tới; cả ba module cũng không qua `src/index.ts` nên không phải mặt công
  khai của gói.
Tái hiện / bằng chứng: Probe D/probe-unused.mjs quét 222 tập tin mã nguồn
  (apps/desktop/src, packages/ui/src, scripts, tools, e2e): ba tên trên có 0
  lượt dùng ngoài nơi định nghĩa; 88 tên còn lại trong danh sách kiểm
  (91 tên) đều có người dùng.
Ảnh hưởng: Nhiễu nhỏ khi đọc mặt ngoài module; không tốn hiệu năng.
Đề xuất: Bỏ `export`, giữ kiểu nội bộ — 3 dòng, không cần test mới
  (typecheck hiện tại giữ hành vi).
```

## 4. Bloat

| Đã chạy / đọc gì | Trên dữ liệu nào | Kết quả (số) | Phát hiện |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` ở `apps/desktop` và `packages/ui` | Mã ở SHA ghim | 0 lỗi trong phạm vi D | Không có |
| `pnpm lint:deps` | Mã ở SHA ghim | Sạch: 309 module, 1.244 quan hệ, 0 vi phạm (trùng baseline) | Không có |
| Probe `D/probe-unused.mjs`: đếm nơi dùng của 91 export trong gói | 222 tập tin (`apps/desktop/src`, `packages/ui/src`, `scripts`, `tools`, `e2e`) | 3 kiểu không ai import: `TokenReader`, `ShowMoreFoot`, `TokenViolation` | MU-D4 (Nit) |
| Probe `D/probe-unused.mjs`: 1.085 khóa chữ `vi.ts` có mặt nguyên văn ngoài `vi.ts` không | Cùng 222 tập tin | 0 khóa chết; các khóa "lạ" đều dựng động đúng chỗ (`stage.*`, `error.*` qua `errorMessage`, `tableMore.*`, `weekday*`, `kycField.*`…), đã đối chiếu từng nhóm, có test giữ (`index.test.ts`: phủ slot, F-12 đủ chữ cho mã lỗi) | Không có |
| Rà code lặp ≥ 3 nơi trong gói | Đọc tay toàn gói | Chỉ các mục KNOWN đã ghi (#141: 3 helper badge + lặp `CLOSED_STAGES.includes`; #144: lặp `role === 'RE' \|\| role === 'TL'`, lặp lọc `reId`) — không có bằng chứng mới | KNOWN, không ghi mới |
| Dependency của `@p2c/ui` | `packages/ui/package.json` | Đủ 3 dep đều có người dùng: `domain` (guard/compare/ngày), `@tanstack/react-table` (DataTable), `echarts` (Chart) | Không có |
| Ai import `Chart`/`encodeHtml` (echarts ≈ 513 KB thô theo baseline) | `apps/desktop/src` | Chỉ `routes/overview/` (gói E); không màn D nào import | Không có (chi phí thuộc E) |
| Chunk build | `common/baseline.md` (không build lại) | `index.js` 891.942, `chart.js` 513.302, `exceljs` 929.569, css 28.364 byte thô | Không có |

## 5. Hiệu năng

Máy đo: Home PC. Lúc đo không chạy gì nặng song song (lệnh probe chạy tuần tự).
Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` qua `importBackup`
(1.481 KH sống, 10.252 lịch sống, 51 nhân sự, 1.674 HĐ — trùng số sống trong
`phase-6.md`). Ngưỡng: Nhóm C (< 200 ms cho thao tác màn).

| Đã đo gì (probe `D/probe-perf.mjs`, Node, trung vị 5 lần) | Số | Ngưỡng / tham chiếu | Phát hiện |
|---|---|---|---|
| `importBackup` toàn bộ dữ liệu tải | 823 ms | `backup.read` nền 794 ms (exe, gồm đọc file) — cùng bậc | Không có |
| `customerBoard` góc nhìn Toàn bộ (1.481 KH) | 1,7 ms | < 200 ms | Không có |
| `customerBoard` một Team | 0,5 ms | < 200 ms | Không có |
| `reOptions` (51 nhân sự) | ≈ 0 ms | < 200 ms | Không có |
| `teamRes` một team | ≈ 0 ms | < 200 ms | Không có |
| `groupByTeam` | ≈ 0 ms | < 200 ms | Không có |
| `staffMetrics` (mọi RE) | 7,3 ms | < 200 ms | Không có |
| `personUsage` × 54 nhân sự | 12,5 ms | < 200 ms | Không có |
| `kycOverview` KH nhiều dữ kiện nhất (19 dữ kiện) | ≈ 0 ms | < 200 ms | Không có |
| `kycTimeline` KH nhiều dữ kiện nhất | ≈ 0 ms | < 200 ms | Không có |
| `previewKycNote` | 0,1 ms | < 200 ms | Không có |

Đối chiếu exe cùng máy (`perf-ref.json`): `customers.view-table` 18 ms,
`customers.sort-name` 22 ms, `customer.open-ai` 20 ms — đều < 200 ms. Không đo
lại trên exe vì hàm thuần đã nhanh hơn ngưỡng hai bậc và số exe nền đã đạt;
không có phát hiện P.

## 6. Bảng đếm và tỉ lệ

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|
| Low | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 3 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| Tổng | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 2 | 4 |

Tình trạng: CONFIRMED 2 (MU-D1, MU-D4), PLAUSIBLE 2 (MU-D2, MU-D3).
Tỉ lệ PLAUSIBLE 50% vì cả hai đều là hành vi tương tác trên DOM mà repo không
có công cụ test component để chạy (KNOWN, G4); đường code dẫn tới mỗi phát
hiện đều đơn định và đã đọc kỹ, không suy đoán.

## 7. Đã xét, không thấy (theo trục)

- **E (edge case):** đã đọc `parseBirthDate`/`parseRecordDate` + test (năm lẻ,
  29/02, năm 2 số, ngày tương lai, khoảng trắng), `useDateField`, mọi đường
  lưu hộp thoại (lỗi lệnh đều hiện qua `FailureAlert`/lỗi ô, không lặng lẽ);
  hộp mở trong lúc thay dữ liệu (S-2: hộp "Đang nhập…" chặn thao tác nên lệnh
  người dùng không chạm khóa ghi; dữ liệu cũ trong hộp chỉ dẫn tới câu lỗi
  rõ, không ghi sai); không xếp chồng hộp thoại (mỗi trạng thái một hộp);
  team rỗng, team 0 RE, KH 0 lịch, kanban cột rỗng/dài, Thùng rác trong số
  đếm (hàm đọc bỏ bản xóa). Không thấy gì mới.
- **C (hợp đồng):** đã đối chiếu từng màn/hộp với mockup và từng dòng NT
  (KH-01…15, HS-01…12, TM-01…14, CH-01…08, TR-05, mục lệch đã biết). Các lệch
  còn lại đều đã biết (NT mục 366-379, KNOWN #141/#144/#462/#543/R4/P8-T2)
  hoặc NT đã chốt theo app (thẻ Kanban, cột Bảng, B1/B2, 5b/5c/5d/5e/5f/7a–7e,
  9a–9c). Hợp đồng nối gói đã kiểm: `countCustomerRecords` (ánh xạ slot 5f
  đúng), `listStageTransitions`/`listAppointments` (bỏ bản xóa, thứ tự đúng
  cho `since`/đánh số "lần n"), `statusLabel`/`outcomeText`/`withTime`/
  `dayText`/`isPastOrToday` (truyền đúng tham số). Mới: MU-D1.
- **D (dữ liệu):** mọi ghi chép trong gói đi qua lệnh `db`, xem trước
  (`previewKycNote`, `previewCustomerProfile`) dùng chung code với lệnh, số
  hộp Xóa KH và hộp khôi phục dùng chung `countCustomerRecords`. Không thấy
  gì mới.
- **G (guardrail AI):** gói D không có logic AI; `ConfirmFactDialog` chỉ là
  biểu mẫu xác nhận qua lệnh thường. Không thuộc gói.
- **S (an toàn ranh giới):** không `innerHTML`/`dangerouslySetInnerHTML`,
  không mở URL ngoài trong gói (một `window.open` duy nhất thuộc gói C);
  hash mã hóa/giải mã an toàn (`encodeURIComponent`, `decode` có try/catch);
  chữ người dùng chỉ vào JSX (React thoát). CSP/capabilities thuộc gói B.
  Không thấy gì mới.
- **P (hiệu năng):** đã đo (mục 5). Không có phát hiện.
- **B (bloat):** đã quét (mục 4). Ngoài MU-D4 không còn gì.
- **T (chất lượng test):** 133/133 test trong gói xanh
  (`vitest run packages/ui shell i18n customers-view kyc-view
  CustomersScreen team-view ui-choices`, 17 tập tin, 9,3 s); đột biến 2/2 bị
  giết (M1 biên 100 dòng `show-more`, M4 khóa sắp xếp ngày sinh —
  `D/probe-mutant.mjs`); thiếu test tương tác component là KNOWN (G4).
  Không có phát hiện mới.
- **A (trợ năng/i18n):** nhãn/`aria-*`/Tab/bẫy focus (hộp native), `role`
  cho lỗi/trạng thái, `aria-sort`, roving tabindex, chữ qua `vi.ts`
  (1.085 khóa, 0 khóa chết), ngày/tiền qua domain, tương phản (KNOWN R4).
  Mới: MU-D2, MU-D3.

## 8. Phụ lục

### Probe (nguồn đầy đủ ở `muse\D\`)

`hooks.mjs` — nạp TypeScript của repo trong Node (theo mẫu
`tools/load-data.mjs`), thêm ánh xạ `@p2c/domain|db|ai` cho bản chép đột biến:

```js
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { URL } from 'node:url';

const ALIAS = {
  '@p2c/domain': 'packages/domain/src/index.ts',
  '@p2c/db': 'packages/db/src/index.ts',
  '@p2c/ai': 'packages/ai/src/index.ts',
};
const REPO_URL = 'file:///C:/workspace/Project-2C-review-2/';

registerHooks({
  resolve(specifier, context, nextResolve) {
    for (const [name, target] of Object.entries(ALIAS)) {
      if (specifier === name) return nextResolve(REPO_URL + target, context);
    }
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (!specifier.startsWith('.') || /\.\w+$/.test(specifier)) throw error;
      for (const suffix of ['.ts', '/index.ts']) {
        try {
          return nextResolve(specifier + suffix, context);
        } catch {
          // Thử hậu tố kế tiếp.
        }
      }
      throw error;
    }
  },
  load(url, context, nextLoad) {
    if (!url.endsWith('?raw')) return nextLoad(url, context);
    const text = readFileSync(new URL(url.slice(0, -'?raw'.length)), 'utf8');
    return {
      format: 'module',
      source: `export default ${JSON.stringify(text)};`,
      shortCircuit: true,
    };
  },
});
```

`probe-kyc-money.mjs` (MU-D1) — gọi `normalizeKycValue` của domain:

```js
import './hooks.mjs';
import { normalizeKycValue, kycFieldType } from 'file:///C:/workspace/Project-2C-review-2/packages/domain/src/kyc-fact.ts';

const cases = [
  ['annualIncome', '6 tỷ'],
  ['totalAssets', '25 tỷ'],
  ['annualIncome', 'Khoảng 12 tỷ'],
  ['annualIncome', '1–2 tỷ'],
  ['childrenCount', '2'],
];
for (const [field, value] of cases) {
  let out;
  try {
    out = normalizeKycValue(field, value);
  } catch (error) {
    out = `LỖI ${error.constructor.name}`;
  }
  console.log(`${field} ← ${JSON.stringify(value)} ⇒ ${JSON.stringify(out)} (kiểu ${kycFieldType(field)})`);
}
```

Kết quả (`node muse\D\probe-kyc-money.mjs`):

```text
annualIncome ← "6 tỷ" ⇒ "6 tỷ" (kiểu text)
totalAssets ← "25 tỷ" ⇒ "25 tỷ" (kiểu text)
annualIncome ← "Khoảng 12 tỷ" ⇒ "Khoảng 12 tỷ" (kiểu text)
annualIncome ← "1–2 tỷ" ⇒ "1–2 tỷ" (kiểu text)
childrenCount ← "2" ⇒ 2 (kiểu integer)
```

`probe-perf.mjs` (mục 5) — `importBackup` dữ liệu tải rồi bấm giờ từng hàm
thuần của màn D (trung vị 5 lần; xem nguồn đầy đủ ở `muse\D\probe-perf.mjs`,
kết quả ở mục 5).

`probe-unused.mjs` (MU-D4, mục 4) — đọc thô 222 tập tin mã nguồn, đếm nơi
dùng của 91 export và 1.085 khóa chữ (nguồn đầy đủ ở
`muse\D\probe-unused.mjs`).

### Đột biến (bản chép ở `muse\D\mut\`, chạy bằng `D/probe-mutant.mjs`)

- M1 `show-more.ts`: `total <= SHOW_MORE_STEP` → `total < SHOW_MORE_STEP` —
  **bị giết** (mong đợi "100 dòng không chân bảng" đỏ).
- M4 `customers-view.ts` (`birthSortKey`): nhánh năm lẻ `String(birth.year)`
  → `'9999'` — **bị giết** (thứ tự sắp xếp đỏ).
- Kết quả: `giết 2/2 đột biến`. Không có đột biến sống.

### Lệnh đã chạy trong repo (chỉ đọc)

- `git rev-parse HEAD`, `git status --short` (đầu + cuối phiên).
- `pnpm exec vitest run packages/ui …` (17 tập tin, 133 test, xanh).
- `tsc --noEmit --noUnusedLocals --noUnusedParameters` (2 gói, 0 lỗi D).
- `pnpm lint:deps` (sạch, trùng baseline).
- Không ghi gì vào repo; không `commit/checkout/reset/restore/stash/clean/
  push`, không `gh`, không `eval:ai`, không mở chatgpt.com.

### Cuối phiên

- SHA cuối phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (không đổi).
- `git status --short` cuối phiên:
  - `?? .agents/`
  - `?? .codex/`
  - `?? AGENTS.md`
  - (Giống đầu phiên: ba mục không theo dõi sẵn có, không phải do phiên này
    tạo.)
- Giờ xong: 23:57 14/10/2026.
