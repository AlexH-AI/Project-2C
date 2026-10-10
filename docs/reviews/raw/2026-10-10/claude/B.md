# Deep review Phase 5 — gói B (`packages/db`: `ai_analyses`, migration, nhập backup, seed) — Claude

- **SHA:** `0df3606fb783cc89b1b9c413c02810340e273a4f` (kiểm `git rev-parse HEAD` trong `C:\workspace\Project-2C-review` đầu phiên: khớp).
- **Phiên:** Claude Opus 5.5, phiên sạch, 10/10/2026, không subagent. Không mở / đọc / liệt kê `deep-review-5\codex\`. Đã đọc `common\` (plan, baseline, known) và báo cáo Claude gói A (`claude\A.md`) để không báo trùng.
- **Không gọi AI thật:** mọi probe chạy trên mã nguồn bằng Node 24 (hook resolve như `tools/eval-ai.mjs` + loader `?raw` cho migration), DB sql.js trong bộ nhớ, đầu ra AI tự dựng. Không chạy `pnpm eval:ai`, không đụng key.
- **Worktree:** probe ở `C:\workspace\deep-review-5\claude\B\`; 25 đột biến (+ chạy lại B7, B8 sau khi sửa mẫu chuỗi) ghi đè file rồi khôi phục từng byte trong `finally`; `drizzle-kit generate` chạy trên bản sao thư mục `migrations` trong `B\drift\`. `git status --short` cuối phiên: **sạch**.

## 1. Phạm vi đã đọc

| File (0df3606) | Dòng | Cách đọc |
|---|---|---|
| `packages/db/src/ai-analyses.ts` | 1–277 (hết) | đọc từng dòng + probe + đột biến B1–B14 |
| `packages/db/src/schema.ts` | 1–20 (import), 270–404 (`kycVersions`, khối AI) | đọc; so CHECK với spec §7.1 |
| `packages/db/migrations/0005`–`0008` + `meta/_journal.json`; `0003` (mẫu trigger) | hết | đọc; `drizzle-kit generate` trên bản sao: "No schema changes" (không lệch `schema.ts`) |
| `packages/db/src/migrations.ts`, `database.ts` (`migrate`, `transaction`) | hết / 80–260 | đọc + probe DB Phase 4 có dữ liệu |
| `packages/db/src/backup-validation.ts` | 1–446 (hết) | đọc từng dòng (luật 1–10 để biết khuôn, kỹ luật 11–14 `aiRule` / `readsBack`) + probe file sửa tay + đột biến B15–B22 |
| `packages/db/src/backup.ts` | 1–201 (hết) | đọc (`load`, `valueOf`, thứ tự load → migrate → kiểm) |
| `packages/db/src/seed.ts` | phần Phase 5 (diff `3e84ce8..0df3606`, 96–170, 291–294, 419–560); `seed-data.ts` 304–345 | đọc + probe so với `buildAnalysisInput` + đột biến B23 |
| `packages/db/src/kyc.ts` | diff Phase 5 (`KycFactRecord`, `getKycProfile` có `seq`, wrapper `normalizeKycValue`) | đọc + đột biến B24–B25 |
| `packages/db/src/common.ts` (`isLabel`), `errors.ts`, `index.ts`, `settings.ts` | phần Phase 5 | đọc |
| Test: `ai-analyses.test.ts` (hết), `backup-invariants.test.ts` 240–300, 740–860, `seed.test.ts` (ca AI), `database.test.ts` (diff), `settings.test.ts` | | đọc để biết phủ gì |
| Chỗ nối (kiểm hợp đồng, không review sâu): `packages/ai/src/schema.ts` (hết), `run.ts:214–335`, `web.ts:90–121`, `input.ts` (hết), `prompts/retry.ts`; `packages/domain/src/kyc.ts:40–163`, `kyc-gate.ts:1–60`; `apps/desktop/src/data/ai-analysis.ts:180–210`, `app-data.ts:360–380`; `routes/customers/ai-panel-view.ts:140–200, 340–440`; `CustomerProfile.tsx:30–55`; `appointments/AppointmentAi.tsx`, `AppointmentsScreen.tsx:600–650` | | |
| Spec: `docs/design/phase-5-ai.md` §1, §2, §3, §3.1, §6, §7, §8, §9.1, §11–§13 | | |

Chạy: 8 file test `db` có phần AI (`ai-analyses`, `backup-invariants`, `seed`, `kyc`, `database`, `backup`, `settings`, `seed-invariants`) → **289 test xanh** (41 s). `tsc -p packages/db --noEmit --noUnusedLocals --noUnusedParameters`: **0 lỗi**.

## 2. Phát hiện

### CL-B1 — `recordAiAnalysis` không kiểm luật 13 phần output; một dòng nó nhận làm mọi backup sau đó không nhập lại được và làm panel ném lỗi

```
ID: CL-B1
Mức: Low
Trục: D
Vị trí: packages/db/src/ai-analyses.ts:141–143 (toRow), so với backup-validation.ts:401–409 (readsBack);
        apps/desktop/src/routes/customers/ai-panel-view.ts:352–355, 386, 399
Tình trạng: CONFIRMED
```

- **Mô tả:** spec §7.3 luật 3 và quy tắc Owner R2-02 ("áp luật ở mọi nơi: lệnh + kiểm khi nhập backup") — nhập backup đòi `ACCEPTED` → `output_json` qua zod schema của `mode` **và** mọi `evidence` có trong `input_json`; lệnh chỉ đòi `output` khác `null`. Lệnh kiểm đầu vào bằng `analysisInputSchema` (T-176) nhưng không kiểm đầu ra. Doc comment của `analysisContent` ("Its input and output passed their schemas when saved") dựa vào một bảo đảm mà `db` không giữ: panel gọi `analysisOutputSchema.parse` / `discoveryOutputSchema.parse`, ném `ZodError` → màn Hồ sơ KH lỗi.
- **Tái hiện** (`node probe-command-vs-import.mjs`, KH ở `PROFILE_DISCOVERY`, đầu vào do `buildAnalysisInput` dựng):

| `output` của dòng ACCEPTED | Lệnh | Xuất → nhập lại | `analysisContent` |
|---|---|---|---|
| `{ summary: 'Tóm tắt' }` (dạng test `ai-analyses.test.ts:83, 153` vẫn dùng) | ghi seq 1 | **BACKUP_INVALID luật 13** | ném `ZodError` |
| đầu ra đúng schema nhưng trích `F99` (không có trong đầu vào) | ghi | **BACKUP_INVALID luật 13** | hiện (bỏ mã lạ) |
| `text` 301 ký tự | ghi | **BACKUP_INVALID luật 13** | ném `ZodError` |
| `{ needs: [] }` | ghi | **BACKUP_INVALID luật 13** | ném `ZodError` |
| đầu ra đúng (đối chứng) | ghi | nhập được | hiện |

- **Ảnh hưởng:** hôm nay không có đường nào của app ghi dòng như vậy: `analysisOutcome` (`run.ts:306`) luôn `AI_OUTPUT_SCHEMAS[mode].parse` và V2 đã kiểm `evidence`; seed sinh đầu ra đúng (test nhập seed 2 / 11 / 42). Nhưng chỉ cần một lỗi ở lớp gọi (đường ghi mới, sửa `analysisOutcome`), DB của người dùng vẫn chạy bình thường còn **mọi file backup về sau bị từ chối khi nhập** (một dòng hỏng chặn cả file) — chỉ phát hiện lúc cần khôi phục.
- **Đề xuất:** đưa phần "ACCEPTED: schema của mode + evidence ⊆ mã đầu vào" thành một hàm dùng chung của `db` (vd. `acceptedOutputFits(mode, input, output)` trong `ai-analyses.ts`), gọi ở `toRow` và `readsBack`; sửa fixture `{ summary }` của `ai-analyses.test.ts` thành đầu ra thật. Cỡ: ~20 dòng SP + ~30 dòng test.

### CL-B2 — Xác nhận lại cùng giá trị (hoặc sửa ngày sinh cùng năm) thay dữ kiện được trích mà không tạo phiên bản: phân tích vẫn CURRENT với bằng chứng trỏ dữ kiện đã bị thay

```
ID: CL-B2
Mức: Low
Trục: C
Vị trí: packages/db/src/ai-analyses.ts:196–207 (CURRENT theo phiên bản); domain/src/kyc.ts:68–76 (confirmFact thay dữ kiện cũ),
        :134–163 (hash không có id / seq / ngày → không phiên bản mới); spec §6.1 (mã F{seq} "của phiên bản hiện tại"), §7.2, P1
Tình trạng: CONFIRMED
```

- **Mô tả:** P1 / §7.2 nối STALE với **phiên bản KYC mới**; phiên bản chỉ mới khi hash (trường, giá trị, trạng thái của dữ kiện còn hiệu lực) đổi. Xác nhận lại cùng giá trị từ một ghi chú mới tạo dữ kiện mới (seq mới, ngày mới), đẩy dữ kiện cũ sang `superseded`, nhưng không tạo phiên bản. Phân tích cũ vẫn CURRENT, `evidence` của nó trỏ mã F đã bị thay, mức bằng chứng vẫn tính theo ngày xác nhận cũ trong `input_json`; đầu vào app sẽ gửi nếu bấm lại cùng "phiên bản" thì đã khác. Hành vi "sửa ngày sinh cùng năm tạo dữ kiện thay thế, không tạo phiên bản" đã ACCEPTED ở Phase 3 (`known.md`); hệ quả lên CURRENT của Phase 5 là điều mới.
- **Tái hiện** (`node probe-reconfirm.mjs`): dữ kiện xác nhận 01/06/2025; phân tích discovery trích `F2` (Nghề nghiệp) → CURRENT, mức `LOW`, mới nhất 01/06/2025. RE gặp KH 26/09/2026, xác nhận lại "Kỹ sư":

```
reconfirm: version recorded? false · versions 5 → 5
facts now: F2 superseded 2025-06-01 | F6 active 2026-09-26
after: state CURRENT · cites ["F2"] · evidence shown {"level":"LOW","factCount":1,"latestConfirmedDate":2025-06-01}
input the app would send now differs from stored? true · codes now F1,F4,F5,F6,F3 · stored F1,F4,F5,F2,F3
birth date same year → versions 5 · state CURRENT · birthYear facts F1 superseded | F7 active
```

  Mức bằng chứng (`node probe-reconfirm-level.mjs`): phần tử trích `F2`, `F3` (đều 01/06/2025) là `LOW` (trung bình, hạ vì không dữ kiện nào mới); RE xác nhận lại cả hai hôm nay → vẫn **CURRENT, `LOW`, mới nhất 01/06/2025**, trong khi một lần phân tích mới trên cùng dữ kiện sẽ ra trung bình.
- **Ảnh hưởng:** RE thường xác nhận lại thông tin ở mỗi buổi gặp. Panel ghi CURRENT nhưng: bằng chứng `F2` trỏ dữ kiện đã thay (bấm từ bằng chứng tới dữ kiện, spec §6.1 — gói D kiểm hành vi link); mức bằng chứng bị hạ vì "không dữ kiện nào mới" dù RE vừa xác nhận lại hôm nay, và không có lời nhắc phân tích lại. Không sai dữ liệu, chỉ hiện lệch.
- **Đề xuất:** spec chưa nói ca này → **Owner quyết** (G1/G2): (a) giữ theo phiên bản, ghi vào spec §7.2 rằng mã F của phân tích CURRENT có thể đã bị thay bằng dữ kiện cùng giá trị, và panel ánh xạ mã cũ → dữ kiện hiện hành cùng trường / giá trị; hoặc (b) coi phân tích là STALE khi tập mã F còn hiệu lực khác tập mã trong `input_json` (đổi định nghĩa P1). (a) ~15 dòng UI; (b) ~15 dòng `listAiAnalyses` + test, đổi spec.

### CL-B3 — `raw_output` có ký tự NUL trong file backup vượt trần 20 000 và bị cắt khi đọc lại

```
ID: CL-B3
Mức: Nit
Trục: D
Vị trí: packages/db/src/backup-validation.ts:396–402 (readsBack không kiểm raw_output); schema.ts:398–401 (CHECK length());
        so với ai-analyses.ts:185–187 (lệnh thay NUL, DR-49)
Tình trạng: CONFIRMED
```

- **Mô tả:** `length()` của SQLite dừng ở NUL đầu tiên, nên CHECK `ai_analyses_outcome` (1–20 000 ký tự) không giữ được trần với chuỗi có NUL; sql.js đọc text cũng dừng ở NUL. Lệnh thay NUL bằng `U+FFFD` (DR-49), nhập backup thì không kiểm.
- **Tái hiện** (`node probe-import-edges.mjs`): `raw_output = 'a\0' + 30 000 × 'b'` → **nhập được**, `listAiAnalyses` đọc lại **1 ký tự**; file DB giữ cả 30 002 ký tự (xuất lại ra `"a"`: dữ liệu đổi qua một vòng xuất / nhập). `raw_output` 25 000 ký tự không NUL → `BACKUP_INVALID` như mong đợi.
- **Ảnh hưởng:** chỉ với file sửa tay; `raw_output` là chữ thô chỉ để tra lỗi.
- **Đề xuất:** luật 13 thêm "REJECTED → `raw_output` không chứa `\0`" (như lệnh lưu). 1–2 dòng + 1 ca test.

### CL-B4 — Lệnh và nhập backup không ràng các cột của một lần phân tích với nhau

```
ID: CL-B4
Mức: Nit
Trục: C
Vị trí: packages/db/src/ai-analyses.ts:125–143 (toRow); backup-validation.ts:375–389 (luật 12)
Tình trạng: CONFIRMED (cả lệnh lẫn nhập đều nhận; app không bao giờ ghi các dạng này)
```

- **Mô tả / bằng chứng** (`node probe-import-edges.mjs`, mỗi dòng sửa tay một cột của một phân tích hợp lệ; tất cả **nhập được**, panel hiện bình thường):
  - `REJECTED` với `attempts` = 1 (spec §3: REJECTED chỉ sau lần thử thứ hai không đạt; `run.ts` / `web.ts` không bao giờ ghi vậy);
  - `ACCEPTED` mà báo cáo validator của lần cuối có lỗi (V3); `attempts` = 2 nhưng `validator_json` chỉ một báo cáo;
  - dòng `discovery` có `prompt_version` = `analysis@1`; `OPENCODE_GO` có `discovery@1+web@1`; `CHATGPT_WEB` có `x+web@1` (luật 12 chỉ kiểm đuôi);
  - `OPENCODE_GO` với `model` = `gpt-6` hoặc chuỗi 5 000 ký tự (chip hiện nguyên chuỗi qua `modelLabel`);
  - `date` = 2020-01-01, trước ngày tạo KH, trước phiên bản KYC được phân tích và trước chính `created_at`.
- **Ảnh hưởng:** chỉ với file sửa tay; spec §7.3 không đòi các ràng buộc này nên không trái spec, nhưng lịch sử phân tích có thể hiện điều app không làm được (vd. "bị loại" sau 1 lần thử).
- **Đề xuất:** nếu muốn chặt hơn (Owner chọn): REJECTED ⇒ `attempts` = 2; số báo cáo validator = `attempts`; ACCEPTED ⇒ báo cáo cuối rỗng; `prompt_version` bắt đầu bằng `<mode>@`. Áp ở `toRow` và luật 12–13 cùng lúc. ~15 dòng SP.

### CL-B5 — Nhãn tiếng Việt của đầu vào AI có 3 bản chép, đầu vào seed chép lại `buildAnalysisInput`; không test nào nối với i18n

```
ID: CL-B5
Mức: Low
Trục: B
Vị trí: apps/desktop/src/i18n/vi.ts:92–120 (kycCategory.* / kycField.*); packages/ai/src/input.ts:20–55, 80–104;
        packages/db/src/seed-data.ts:308–345; packages/db/src/seed.ts:428–560 (analysisInput, mockAnalysis, mockDiscovery, `${mode}@1`)
Tình trạng: CONFIRMED (đếm bản chép; hôm nay các bản trùng khớp)
```

- **Mô tả:** 8 nhãn hạng mục + 21 nhãn trường có ở `vi.ts`, `@p2c/ai` (`input.ts`) và `db` (`seed-data.ts`) vì `ai` không đọc được `apps` và `db` chỉ import được `@p2c/ai/schema`. `seed.ts` còn chép nguyên `buildAnalysisInput` (lọc `superseded`, sắp theo catalog rồi seq, tuổi = năm − năm sinh, "Có" / "Không"), các câu của Mock và `prompt_version` `@1`. Test chỉ so mỗi bản với chính nó: `seed.test.ts` so nhãn của seed với `seed-data.ts`, `input.test.ts` ghi cứng vài chuỗi; không test nào so `@p2c/ai` hay `seed-data` với `vi.ts`.
- **Bằng chứng** (`node probe-labels-seed.mjs`): 0 nhãn lệch giữa 3 bản; 25 / 25 phân tích CURRENT của seed 42 có `input_json` trùng từng byte với `buildAnalysisInput` trên hồ sơ hiện tại.
- **Ảnh hưởng:** *Shotgun Surgery*: đổi một nhãn ở `vi.ts` (hoặc G5 lên `analysis@2`, hoặc đổi cách gửi tuổi) thì nhãn gửi AI, cảnh báo mâu thuẫn hiện ở panel (đọc từ `input_json`) và seed lệch nhau mà `pnpm verify` vẫn xanh. Không phải lỗi hôm nay.
- **Đề xuất:** đưa nhãn + phần analysis của `buildAnalysisInput` (chỉ phụ thuộc `domain`) vào `@p2c/ai/schema` (module `db` được import) để seed dùng lại; tối thiểu thêm một test ở `apps` so `KYC_*_LABELS` của `@p2c/ai` với `vi.ts`. Cỡ: ~60 dòng chuyển chỗ, xóa ~90 dòng lặp ở seed. Liên quan KNOWN #455 (*Shotgun Surgery* `AI_ANALYSIS_NO_MODEL`, hằng 20 000) — cùng gốc ranh giới `db` ↔ `ai`.

### CL-B6 — Test không đỏ với 2 / 25 đột biến (lời nhắc material, mã lỗi NUL của giá trị KYC)

```
ID: CL-B6
Mức: Low
Trục: T
Vị trí: packages/db/src/ai-analyses.ts:216; packages/db/src/kyc.ts:381 (wrapper normalizeKycValue)
Tình trạng: CONFIRMED (đột biến tạm, đã khôi phục; git status sạch)
```

- **Bằng chứng** (`node mutate.mjs`; kết quả `mutate-out.txt`, `mutate-out-b7b8.txt`; 25 đột biến, **23 bị giết**):

| Đột biến sống sót | Nghĩa |
|---|---|
| B11 `ai-analyses.ts:216`: `material = after.some(v => v.material)` → `after.at(-1)!.material` | mọi ca test có phiên bản sau cùng là material (hoặc chỉ có một phiên bản sau), nên ca "thay đổi cốt lõi rồi sau đó một thay đổi nhỏ" chưa được ghim: với đột biến, lời nhắc thành "KYC có thay đổi nhỏ" dù đã có thay đổi cốt lõi — trái spec §7.2 |
| B25 `kyc.ts:381`: bỏ `cleanText(value)` của wrapper | giá trị dữ kiện có NUL vẫn bị từ chối (domain cũng chặn) nhưng mã đổi từ `INVALID_TEXT` sang `INVALID_KYC_VALUE` (probe `probe-nul.mjs`, `probe-nul-cmd.mjs`); test NUL ở `kyc.test.ts:626–643` chỉ thử chữ ghi chú, không thử giá trị dữ kiện mà doc comment wrapper hứa |

  Đột biến bị giết (đối chiếu): lệnh — phiên bản của KH khác, đuôi `+web@`, `mode` của đầu vào, `attempts` 1–3, ACCEPTED giữ `raw_output`, token âm, giữ NUL, cắt theo UTF-16, `output_json` = `"null"`; đọc — mọi ACCEPTED của phiên bản mới nhất thành CURRENT, `since` trên mọi phiên bản, `since` = phiên bản ghi trước, lời nhắc trên mọi STALE; nhập — tắt luật 11, không kiểm nhãn model / prompt, không kiểm đầu vào của REJECTED, không so `mode`, không kiểm `evidence`, luật 14 `>=`, không kiểm `validator_json`; seed không ghi phân tích; `seq` của dữ kiện lệch 1.
- **Đề xuất:** 2 ca test (~25 dòng): phiên bản material rồi phiên bản nhỏ sau phân tích → `reminder.material === true`, `since` = ngày của bản material; `confirmKycFact` / `recordKycNote` với giá trị có NUL → `INVALID_TEXT`.

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | 0 |
| High | | | | | | | | | | 0 |
| Medium | | | | | | | | | | 0 |
| Low | | | 1 (B2) | 1 (B1) | | | 1 (B5) | 1 (B6) | | 4 |
| Nit | | | 1 (B4) | 1 (B3) | | | | | | 2 |
| **Tổng** | 0 | 0 | 2 | 2 | 0 | 0 | 1 | 1 | 0 | **6** |

KNOWN không nêu lại (không có bằng chứng mới): *Shotgun Surgery* `AI_ANALYSIS_NO_MODEL` / hằng 20 000 lặp ở `ai` và `db` (#455); `isoDate` lặp `validDate` (#465); tên ca "13: evidence when the input has no facts list" (#465); `backup.ts` `valueOf` chỉ nhận cột `integer` / `text`, `prepare` không `free()` (#184, #386); S-1 / D-1 hash `kyc_versions` khi nhập. Liên quan gói A: CL-A8 (`validator_json` phình theo số mã `evidence` sai — `db` không đặt trần độ dài cho `validator_json` / `output_json` của REJECTED, cùng gốc, không báo thêm).

## 4. Đã xét, không thấy

- **E — Edge case:**
  - CURRENT / STALE / REJECTED theo `seq` (không theo ngày), nhiều dòng cùng thời điểm, phân tích lại cùng phiên bản, REJECTED sau CURRENT, lời nhắc material / nhỏ, `since` = ngày sớm nhất trong các phiên bản sau (kể cả ghi chú lùi ngày), cờ material đổi sau (`markKycVersionMaterial`) — đọc `ai-analyses.ts:196–223` + test `ai-analyses.test.ts:400–527` + đột biến B10–B14.
  - KH xóa mềm: `listAiAnalyses` / `recordAiAnalysis` từ chối `CUSTOMER_NOT_FOUND`, khôi phục thì lịch sử nguyên vẹn; nhập backup giữ phân tích của KH đã xóa (đúng §7.3). Chi tiết lịch hẹn chỉ dựng `AppointmentAi` khi `row.customer` có (`AppointmentsScreen.tsx:649`).
  - KYC đổi / KH xóa / DB thay khi AI đang chạy: lệnh gắn phiên bản đã chụp (STALE ngay, §3 điểm 2); phiên bản không còn (DB khác) → `KYC_VERSION_NOT_FOUND`, app xếp vào "discarded" (`ai-analysis.ts:206–210`); phần còn lại là việc của gói D / F.
  - `raw_output` cắt theo code point khớp `length()` của SQLite (đột biến B8 bị giết), NUL thay bằng U+FFFD; 25 000 ký tự khi nhập → CHECK từ chối. Chuỗi có surrogate lẻ: không xét sâu (câu trả lời model / dán không có).
  - Ngày: `date` = ngày app (`today(db)`), luật 14 so chuỗi `yyyy-mm-dd`; theo múi giờ của máy nhập như luật 10 Phase 3 (không mới).
- **G — Guardrail:** `db` không có đường ghi dữ liệu KYC từ AI: `ai_analyses` chỉ có `recordAiAnalysis` (INSERT) và trigger chặn UPDATE / DELETE (có lại sau khi 0007 dựng lại bảng — probe DB Phase 4: hai trigger có); `AI_ANALYSIS_NO_MODEL` + CHECK `ai_analyses_no_model` / `ai_analyses_model` chặn `CHATGPT_WEB` / Mock có model / token ở cả lệnh lẫn nhập (test `ai-analyses.test.ts:272`, `backup-invariants.test.ts:783–787`).
- **C — Hợp đồng:** lệnh kiểm đúng các mục spec §7.1 (KH chưa xóa, phiên bản của chính KH, `mode` ↔ `gate_state`, đầu vào qua `analysisInputSchema` cùng `mode`, ChatGPT web `+web@<n>`); luật nhập 1–4 của §7.3 có đủ (11–14), mỗi luật có ca file sai (`backup-invariants.test.ts:747–858`); `AnalysisRow` của `ai` khớp `NewAiAnalysis` (kiểu `ai-analysis.ts:203`). `drizzle-kit generate` trên bản sao: `schema.ts` không lệch migration.
- **D — Dữ liệu:**
  - Migration trên DB Phase 4 **có dữ liệu** (`node probe-migrate-phase4.mjs`, seed 7 = 1 200 KH, 9 689 phiên bản KYC, DB 8 780 KB dựng ở schema 5): mở + chạy 0005–0008 trong **42 ms**, một transaction, một lần `persist`; `foreign_keys` bật lại, `foreign_key_check` 0 dòng; cột của mọi bảng khác giữ nguyên; file backup Phase 4 (`schemaVersion` 5) nhập được (587 ms) lên schema 9.
  - Backup không chứa key: cột của `ai_analyses` không có key / header / URL (test `backup-invariants.test.ts:272`); bảng `settings` khóa `ai` chỉ ghi `{provider, opencodePlan, model, reasoning}` (`ai-analysis.ts:124`), `readAiSettings` bỏ khóa lạ.
  - Seed: phân tích Mock ghi bằng lệnh (cùng luật), luồng ngẫu nhiên riêng; 59 dòng ở seed 42, đầu vào trùng `buildAnalysisInput` (CL-B5), file seed 2 / 11 / 42 qua luật 11–14 (test).
- **S — An toàn:** `db` không gọi mạng, không giữ key; `raw_output` / `output_json` là dữ liệu không tin cậy, hiển thị là việc gói D (A đã ghi `<img onerror>` qua được V7). Chuỗi HTML trong nhãn đầu vào của file backup (`<b>x</b>`) nhập được và chỉ là chữ — React escape (gói D kiểm).
- **P — Hiệu năng** (`node probe-perf.mjs`, median 7 lần): `listAiAnalyses` 10 / 100 / 500 / 2 000 dòng lịch sử của một KH: **0,22 / 1,36 / 6,09 / 25,5 ms** (DB 168 KB → 4 452 KB). Nhập backup seed 42 (10 406 KB, 59 phân tích): **530 ms**, bỏ bảng `ai_analyses` ra: 504 ms → luật 11–14 + nạp bảng ≈ 26 ms. Không có vấn đề.
- **B — Thừa / lặp:** `tsc --noUnusedLocals --noUnusedParameters` 0 lỗi; ngoài CL-B5, các lặp `AI_ANALYSIS_NO_MODEL` / `MAX_AI_RAW_OUTPUT` / `isoDate`–`validDate` là KNOWN (#455, #465).
- **T — Test:** ngoài CL-B6, 23 / 25 đột biến bị giết; mỗi luật nhập 11–14 có ca file sai riêng. Test không phụ thuộc ngày thật (đồng hồ ghim ở `setup()`); ca "13: evidence when the input has no facts list" tên sai điều nó kiểm là KNOWN.
- **A — Trợ năng / i18n:** gói B không có UI. Thông điệp lỗi trigger (`ai_analyses is append-only`) và `AI_ANALYSIS_INVALID` là lỗi lập trình, không hiện cho RE; `BACKUP_INVALID` có `rule` 11–14 đi qua câu hộp 10b sẵn có (gói D kiểm chữ).
- Ghi chú cho gói D / F (không phải phát hiện của B): `analysisContent` tin `output` đã qua schema (CL-B1); link từ bằng chứng tới dữ kiện khi mã đã bị thay (CL-B2); chip hiện `model` dài nguyên văn (CL-B4).

## 5. Phụ lục — nguồn probe (trong `C:\workspace\deep-review-5\claude\B\`)

| File | Làm gì | Lệnh |
|---|---|---|
| `hooks.mjs` | hook resolve như `tools/eval-ai.mjs` + loader `?raw` (đọc file `.sql` thành chuỗi); `REPO` trỏ worktree | (được import) |
| `common.mjs` | dựng DB + team + RE + KH (năm sinh 1980), `confirm`, `toDiscovery` (đủ cổng `PROFILE_DISCOVERY`), `appInput` (= `buildAnalysisInput`), `row`, `discoveryOutput` | (được import) |
| `smoke.mjs`, `probe-gate.mjs` | kiểm môi trường, xem cổng / đầu vào | `node smoke.mjs` |
| `probe-command-vs-import.mjs` | CL-B1: lệnh nhận / nhập từ chối / panel ném | `node probe-command-vs-import.mjs` |
| `probe-reconfirm.mjs`, `probe-reconfirm-level.mjs` | CL-B2: xác nhận lại cùng giá trị, sửa ngày sinh cùng năm; mức bằng chứng sau khi xác nhận lại | `node probe-reconfirm.mjs`, `node probe-reconfirm-level.mjs` |
| `probe-import-edges.mjs` | CL-B3, CL-B4: 17 file backup sửa tay một cột | `node probe-import-edges.mjs` |
| `probe-nul.mjs`, `probe-nul-cmd.mjs` | CL-B6: mã lỗi khi giá trị dữ kiện có NUL | `node probe-nul-cmd.mjs` |
| `probe-labels-seed.mjs` | CL-B5: so nhãn 3 bản; so `input_json` của seed với `buildAnalysisInput` | `node probe-labels-seed.mjs` |
| `probe-migrate-phase4.mjs` | DB schema 5 có dữ liệu seed → mở / migrate; nhập file backup Phase 4 | `node probe-migrate-phase4.mjs` |
| `probe-perf.mjs` | thời gian `listAiAnalyses` theo cỡ lịch sử; thời gian nhập backup seed | `node probe-perf.mjs` |
| `mutate.mjs` (+ `mutate-out.txt`) | 25 đột biến một chỗ trên `ai-analyses.ts`, `backup-validation.ts`, `seed.ts`, `kyc.ts`; chạy test `db` liên quan; khôi phục từng byte | `node mutate.mjs [Bx]` |
| `drift\drizzle.config.ts` | `drizzle-kit generate` với `schema.ts` của worktree, `out` = bản sao `migrations` | `node <repo>\packages\db\node_modules\drizzle-kit\bin.cjs generate --config drizzle.config.ts` (trong `drift\`) |
