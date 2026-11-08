XONG — claude gói I lượt 6, 2026-11-07 22:47 (+07:00)

# Deep review Phase 1–6, lượt 6 — Claude, chủ đề I (Bất đồng bộ và thứ tự)

## 1. Phiên

- Bên: claude · chủ đề **I. Bất đồng bộ và thứ tự** (trên mọi gói; không làm bảng R, không kết luận SẴN SÀNG).
- SHA đầu phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c` (worktree `C:\workspace\Project-2C-review`, detached).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-11-07 22:07 (+07:00), Home PC.
- Công cụ: Claude Code (app desktop Claude, tab Code). Model: Claude Opus 5.5 (`claude-opus-5-5`). Mức suy luận: max (theo `get_session self`: `effort: max`).
- Bước 0: `I` là một chữ trong thứ tự A → … → I; `claude\I.md` chưa có (làm mới); `claude\A.md` … `H.md` có đủ, dòng đầu đều `XONG`.
- Ultracode / Workflow: không dùng.
- Subagent: không dùng (0 lần).

Probe / log: `C:\workspace\deep-review-1-6-r6\claude\I\`.

## 2. Bảng R

Không làm (chủ đề G–I, quy tắc riêng 8): mọi dòng R1 / R2 là KNOWN.

## 3. Phạm vi đã đi qua

Chủ đề I trên mọi gói: hàng đợi lưu và listener, thay dữ liệu S-2 (Nạp lại, Nhập backup, Dọn sạch), đóng app, `AppData`, việc AI theo `generation`, ngày của app qua nửa đêm, hộp xác nhận mở trong lúc một việc chạy. Đọc trước: `CLAUDE.md` (gốc, `apps/desktop`, `packages/{db,ai,domain}`), spec Phase 6 §4.1 (S2-1…S2-6, test chấp nhận), §4.2 (TR-9, TR-11, D10), §4.4; `common\plan.md` §L6.0–§L6.8; `common\known.md` phần 1–2 (ACCEPTED: review #334 `today.ts`, review #817 Sidebar "Đã lưu HH:MM", PR #628 `saveChatGptAnswer`), phần 4–5; báo cáo `claude\A.md` … `H.md` (danh sách phát hiện; B mục 2, 4, 8 về hàng đợi lưu: R1 DR6-162, R2 T-374 / T-381, chuỗi F1–F9, đột biến Q1–Q6 / F1 / F5 / S1 / S2), tổng hợp lượt 4 §6 dòng L4-C, tổng hợp lượt 5 dòng DR6-139 / CXR5-B1.

**Diff `37a80b6..5b1328a` của chủ đề** (`git diff --stat 37a80b6 5b1328a -- apps/desktop/src packages/*/src`, đọc từng hunk): `app-data.ts` (+3 / −3, T-364 bỏ nhánh `!storage`), `persist-queue.ts` (+10 / −2, `drain` dừng sau lượt cuối, `idle()` lặp; T-364, T-374), `RestoreDialog.tsx` (`teams`, `useToday` từ T-368), `KycWebSession.tsx` (`isBlankWebAnswer`), `KycIntelligence.tsx` (chỉ class). Không đổi `ai-jobs.ts`, `ai-analysis.ts`, `today.ts`, `close-guard.ts`, `CloseGuard.tsx`, `SaveWarning.tsx`, `listeners.ts`.

**Đọc hết:** `apps/desktop/src/data/{app-data.ts, persist-queue.ts, listeners.ts, ai-jobs.ts, ai-analysis.ts, today.ts, AppDataContext.tsx, tauri-storage.ts}`; `apps/desktop/src/shell/{close-guard.ts, CloseGuard.tsx, SaveWarning.tsx, block-reload.ts, useRoute.ts, routes.ts}`; `apps/desktop/src/main.tsx`; `apps/desktop/src/routes/{Settings.tsx, SettingsBackup.tsx, SettingsDataFile.tsx, ConfirmWordDialog.tsx, FilterBar.tsx, Overview.tsx}`, `routes/customers/use-ai-job.ts`, `routes/reports/ReportExport.tsx`; `packages/ai/src/run.ts` (runner, `converse`, `runAnalysis`, `runExtraction`, `checkConnection`); `packages/db/src/database.ts:60-220` (transaction → persist, `exportBytes` bật lại pragma); test `today.test.ts`, `close-guard.test.ts`, `CloseGuard.test.tsx`.

**Đọc theo chỗ:** `SettingsTrash.tsx:225-439` (11i, `TrashSection`), `KycIntelligence.tsx:380-580` (phiên web theo `generation`, `useAiJob`), `KycWebSession.tsx:40-120` (`update` theo phiên), `SettingsAi.tsx:150-260` (key: `actions` / `mounted`), `CustomerDialogs.tsx:60-120`, `:360-395` (`useDateField`, 5f đếm sống), `appointment-form.ts:15-173` (`prefill`, DR6-38), `CustomerProfile.tsx` (`key`, `notFound`), `Screen.tsx`, `packages/ui/src/components/Dialog.tsx:20-60` (`showModal`), `packages/db/src/purge.ts:139-182` (hai lần lưu: transaction rồi VACUUM), `packages/domain/src/kyc-gate.ts:1-80`, Rust `storage.rs:355-445` (export: claim + `.tmp`, dọn khi mở lại); tên ca của `ai-jobs.test.ts`, `ai-analysis.test.ts`, `app-data.test.ts` (+ `:1040-1190`), `SaveWarning.test.tsx`; e2e `save-state.spec.ts:225-310`, `dialog-keyboard.spec.ts:233-351`, `e2e/support.ts` (asExe, qua bản chép `I\browser.mjs`); `rg` "hôm nay" (25 chỗ), `useEffect(` (20 chỗ), `async |await ` trong `routes/` (30 chỗ), `.subscribe(` / `useSyncExternalStore` (21 chỗ).

**Không đọc kỹ (vì sao):** Rust `ai.rs` / `ai-tauri.ts` (hết giờ 120 s và Hủy trong Rust: gói B / C đã đọc; app chỉ thấy qua `runner.busy`); `SettingsAi.tsx` phần Kiểm tra kết nối (đã báo CLR6-C3 ở gói C); `KycExtraction.tsx` (focus sau khi chạy: gói C / D); `trash-view.ts` (chữ, gói A / E / G); `e2e/perf/**` (đo, gói F). Không chạy trên exe: mọi chuỗi đóng app chạy qua `asExe` (lệnh Tauri giả của e2e) và lớp dữ liệu; NT-DB-02 / 04 / 11 / 12 của nghiệm thu L2 đã chạy chúng trên exe.

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Lớp dữ liệu (`p-chains.mjs` C1): phân tích AI của KH K đang chạy (Mock giữ câu trả lời), xóa KH Z, **Dọn sạch** xong rồi mới thả câu trả lời | `saved` ACCEPTED, phân tích của K 0 → 1, file cuối có dòng đó, `generation` giữ 0, không `reportError` — đúng TR-11 | — |
| K2 | C2: như K1 nhưng thả câu trả lời **trong lúc** Dọn sạch chờ backup (`replacing` true) | `discarded`, không lưu, không `reportError` — đúng D10 / S2-3 | — |
| K3 | C3: xóa KH (5f) trong lúc phân tích của chính KH đó chạy | `discarded`, không `reportError` — đúng TR-9 | — |
| K4 | C4: xóa KH rồi khôi phục ở Thùng rác trước khi câu trả lời về | `saved`; KH sống, 1 phân tích, file cuối đủ. Đầu vào là phiên bản KYC lúc bấm, khôi phục trả nguyên KYC, nên lưu là nhất quán (không ghi phát hiện) | — |
| K5 | C5: xóa KH, Dọn sạch (KH bị xóa hẳn), rồi câu trả lời về | `discarded`, không lỗi khóa ngoại, không `reportError`; file cuối không còn dòng KH / phân tích | — |
| K6 | C6: Dọn sạch lưu hai lần (sau transaction, sau VACUUM): lần 1 lỗi; rồi riêng lần 2 lỗi | Lần 1 lỗi: lần 2 ghi lại, `failed` false, file đã dọn. Lần 2 lỗi: lệnh dọn vẫn resolve (thông báo 11j), `failed` true (dải cảnh báo), file = bản sau transaction (đã dọn, chưa thu gọn); Thử lại → ghi được, hết lỗi. Đúng §4.2 TR-11 ("thu gọn lỗi … chỉ chưa nhỏ lại") | — |
| K7 | C7: bấm X khi phân tích AI đang chạy, không có gì chờ lưu | `closeAfterSaving` đóng ngay (`close` khi mới 1 lần lưu); câu trả lời về sau đó vẫn lưu trong bộ nhớ và gọi `save` **sau** `close`. Trên exe cửa sổ đã hủy nên lượt AI mất; spec không đòi chờ AI khi đóng (S2-6 chỉ nói lần thay) — không ghi phát hiện | — |
| K8 | C8: bấm X trong lúc Dọn sạch chờ backup, câu trả lời AI về giữa chừng | Chưa đóng khi backup còn giữ; câu trả lời `discarded`; đóng sau khi dọn + lưu xong; file cuối đã dọn — đúng S2-6 | — |
| K9 | C9: AI trích xuất chạy qua một lần Dọn sạch | Đề xuất giữ (`generation` không đổi): "Đã kết hôn", 2 con — đúng TR-11 | — |
| K10 | Bản web ghim neo 15/09/2026 (`I\dist-base`, asExe): nhập file tải `load-2026-10-12-seed6.p2cbackup` | Hộp 10b "File hỏng hoặc không phải backup Project-2C": file có kết quả / HĐ tới 12/10/2026, sau "hôm nay" 15/09 của bản neo (luật nhập 10, DR-86). Đúng luật; bản không neo (`I\dist-real`) nhập được. Câu 10b chung cho mọi `BACKUP_INVALID` là theo mockup 10b — không ghi | — |
| K11 | Bản web không neo (`I\dist-real`, asExe, `u1-stacked.mjs`): chọn file tải để nhập (đọc 1,0 s), bấm "Nạp lại…" trong lúc "Đang đọc file…" | **2 hộp modal cùng mở** (10a chồng lên 10c). Nhập ở 10a xong, 10c vẫn ghi "(1.200 KH, 6.229 lịch hẹn, 988 HĐ)" khi dữ liệu là 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ; xác nhận 10c thay dữ liệu vừa nhập | CLR6-I1 |
| K12 | `u1b-typed.mjs`: 10c gõ "NẠP LẠI" trước, rồi 10a mở chồng, rồi Hủy 10a | Chữ đã gõ ở 10c giữ nguyên, nút vẫn bật (lần chạy K11 thấy ô trống là do Playwright gõ đúng lúc 10a mở — tạo tác của probe, không ghi) | — |
| K13 | e2e đóng app (7 ca `-g "clos"` của `save-state.spec.ts`, `dialog-keyboard.spec.ts`) trên bản ghim | 7 / 7 xanh (đối chứng) | — |
| K14 | Cùng 7 ca trên bốn bản đột biến `CloseGuard.tsx` (G1 bỏ `if (closing) return;`, G2 bỏ `preventDefault`, G3 không `destroy`, G4 không trả `closing = false`) | G2 đỏ 5, G3 đỏ 4, G4 đỏ 2; **G1 xanh 7 / 7** | CLR6-I2 |
| K15 | `u2-double-x.mjs`: lần lưu lỗi, bấm X hai lần khi hộp hỏi đang hiện, Escape, rồi sửa được file và bấm "Thử lại" ở dải cảnh báo | Bản ghim: cửa sổ ở lại (`destroyed` false). Bản G1: cửa sổ **tự đóng** (`save`, `destroy`) dù người dùng đã chọn ở lại | CLR6-I2 |
| K16 | Hồ sơ KH X có phiên ChatGPT web / lượt AI → mở hồ sơ KH Y | `Screen.tsx:19` dựng lại `CustomerProfile key={route.id}`, `KycIntelligence key={customer.id}`: không giữ phiên của X sang Y; lượt AI của X nằm ở `AiJobs` theo khóa `analysis:<id>` | — |
| K17 | Qua nửa đêm: mọi chỗ đọc "hôm nay" (`rg "useToday\(\)|\.today\(\)"`, 25 chỗ) | Màn đọc `useToday` (Tổng quan, Báo cáo, Team, Hồ sơ KH, Thùng rác, hộp khôi phục, 10c), hộp đọc `app.today()` mỗi lần vẽ và vẽ lại theo màn cha; giá trị điền sẵn có năm (`useDateField` `dd/mm/yyyy`, `prefill` giữ năm lúc mở, DR6-38). e2e đã chạy qua nửa đêm ở 6 file (`period-picker`, `demo-data`, `trash`, `customer-policies`, `appointment-outcome`, `fixtures`). Ngày chọn của Lịch hẹn không tự nhảy: KNOWN (ACCEPTED review #334) | — |

## 5. Phát hiện mới

### CLR6-I1 — Cài đặt → Dữ liệu: "Nạp lại…" bấm được trong lúc đọc file backup; đọc xong, 10a mở chồng lên 10c, và 10c giữ số của dữ liệu đã bị thay rồi thay luôn dữ liệu vừa nhập

```
ID: CLR6-I1
Mức: Low
Trục: E (phụ C: hộp xác nhận nêu sai thứ nó sắp thay)
Vị trí: apps/desktop/src/routes/SettingsBackup.tsx:72-91 (`readFile`: sau `await data.readBackup(…)` thì `setChosen` :83 mở 10a, không biết hộp nào khác đang mở), :135-143 (chỉ chính nút "Chọn file…" tắt bằng aria-disabled lúc đọc), :168-176 (`ImportDialog` hiện mỗi khi có `chosen`); apps/desktop/src/routes/Settings.tsx:120 (nút "Nạp lại…" luôn bật), :150-152 (`ReloadDialog`: `const [counts] = useState(() => data.counts())`, đếm một lần lúc mở), :176-183 (câu "Toàn bộ dữ liệu hiện tại ({customers} KH, …) được thay…"); packages/ui/src/components/Dialog.tsx:25 (`node.showModal()`: hộp mở sau nằm trên) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót (10c đếm một lần là có chủ ý, chú thích `Settings.tsx:145-149`: dữ liệu mới của chính lần nạp lại thay vào trước khi hộp đóng không phải thứ câu nêu; đường hộp khác thay dữ liệu dưới 10c chưa ai xét. Nút đọc file tự tắt từ review PR 924 / DR6-83, ca e2e `dialog-keyboard.spec.ts:233-288` chỉ thử chính nút đó)
Mô tả: Hai mục của Cài đặt → Dữ liệu chạy độc lập. Trong ≈ 1 s đọc file backup, nút "Nạp lại…" vẫn mở được 10c; đọc xong, 10a mở chồng lên 10c (hai hộp modal cùng lúc). Nhập ở 10a xong, 10c vẫn ghi số bản ghi của dữ liệu trước khi nhập, và gõ NẠP LẠI ở 10c thay luôn dữ liệu vừa nhập bằng dữ liệu giả lập.
Tái hiện / bằng chứng: bản web không neo `I\dist-real` (Vite build() của worktree ghim, ngoài repo), Edge chặn mạng ngoài 127.0.0.1, asExe như e2e (`I\browser.mjs`), `node u1-stacked.mjs` (U_PORT=4932), log `I\logs\u1-stacked.log`:
  "U1 Nạp lại… pressed while reading 3.3 s {"reading":true}" → "U1 10c open while reading … (1.200 KH, 6.229 lịch hẹn, 988 HĐ) …"
  "U1 read lasted (file chosen → 10a open) 1.0 s"; "U1 10a open 4.3 s dialogs open at once: 2 ["Thay toàn bộ dữ liệu?","Nạp lại dữ liệu giả lập?"]"
  Sau "Backup rồi thay dữ liệu": "U1 10c says Toàn bộ dữ liệu hiện tại (1.200 KH, 6.229 lịch hẹn, 988 HĐ) được thay … — data now: 4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ"
  Xác nhận 10c: "U1 notices ["Đã nạp lại dữ liệu giả lập, neo ở ngày 07/11/2026. Backup: …"]", thẻ "3 team · 36 nhân sự · 1.200 KH …"; exe events ["save","backup","save","backup","save"].
  `u1b-typed.mjs` (log `I\logs\u1b-typed.log`): chữ đã gõ ở 10c giữ nguyên khi 10a mở chồng rồi bị Hủy — hộp dưới không mất gì, chỉ số của nó lỗi thời.
Cùng mẫu: `rg -n "showModal|useState\(\(\) =>|data\.counts\(\)|setChosen|setPurging|setRestoring" apps/desktop/src packages/ui/src` (bỏ test). Chỗ một kết quả bất đồng bộ tự mở hộp: chỉ `SettingsBackup.tsx:82-87` (10a / 10b sau `readBackup`); mọi hộp khác mở bằng một cú bấm đồng bộ, và hộp đóng app (`CloseGuard.tsx:60-61`) chồng lên mọi hộp là có chủ ý. Số đếm một lần lúc mở: 10c (`Settings.tsx:152`), cột "Hiện tại" của 10a (`SettingsBackup.tsx:83`), kế hoạch 11i (`SettingsTrash.tsx:370`); chỉ 10c lỗi thời được, vì chỉ dưới nó mới có hộp khác thay được dữ liệu. Thứ tự ngược (10a trước rồi 10c) không làm được: 10a modal chặn. Các mục khác của Cài đặt (AI, Thùng rác) mở bằng state của `Settings`, rời Dữ liệu thì `BackupSection` gỡ và kết quả đọc bị bỏ.
Ảnh hưởng: người dùng bấm "Nạp lại…" trong lúc "Đang đọc file…" (≈ 1 s với file 16 MB, ít hơn với file nhỏ) rồi xử lý cả hai hộp; hiếm. 10c nêu sai số bản ghi sẽ bị thay; dữ liệu vừa nhập bị thay sau khi người dùng gõ NẠP LẠI. Exe có backup ngay trước lần nạp lại (lấy lại bằng chép tay như hướng dẫn 10c), bản web thì mất (dữ liệu bản web vốn chỉ trong trình duyệt).
Chặn phát hành: không — Low trục E theo K48: đường vào hiếm, người dùng tự gõ xác nhận, exe có backup; không đổi dữ liệu lặng lẽ.
Đề xuất: một trạng thái bận chung cho Cài đặt → Dữ liệu: khi đang đọc file thì "Nạp lại…" tắt kiểu aria-disabled như `ConfirmButton` (chiều ngược không cần: 10c modal đã chặn "Chọn file…"); hoặc `readFile` không mở 10a khi một hộp khác của màn đang mở. ≈ 5–10 dòng SP; một bước e2e trong ca `dialog-keyboard.spec.ts:233` (đang đọc file → "Nạp lại…" không mở hộp), ≈ 5 dòng.
```

### CLR6-I2 — `CloseGuard`: cờ `closing` (X lần hai khi lần đóng đầu đang chờ lưu / đang hỏi) không test nào giữ; gỡ nó thì cửa sổ tự đóng sau khi người dùng đã chọn ở lại

```
ID: CLR6-I2
Mức: Low
Trục: T
Vị trí: apps/desktop/src/shell/CloseGuard.tsx:37-48 (`event.preventDefault(); if (closing) return; closing = true; … finally { closing = false; }`, cờ ở :38); close-guard.ts:44-61 (`askWhileFailed`: mỗi lần gọi một subscription riêng); test: apps/desktop/src/shell/CloseGuard.test.tsx (chỉ `CloseDialog`), close-guard.test.ts (cổng giả, không qua handler), e2e/dialog-keyboard.spec.ts:290-351, e2e/save-state.spec.ts:225-310 (mỗi ca một lần X tại một thời điểm) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước (cờ từ T-057 / review PR 125), lượt 1–5 bỏ sót (lượt 5 Claude B đột biến `persist-queue` / `app-data`, không đột biến handler này)
Mô tả: Handler X của exe chặn lần X thứ hai bằng cờ `closing`. Đột biến G1 (bỏ `if (closing) return;`) sống cả unit lẫn 7 ca e2e đóng app. Khi thiếu cờ: X lần hai trong lúc hộp "Chưa lưu được thay đổi" hiện thì câu trả lời của hộp chuyển sang lần đóng thứ hai; Escape để lần đầu treo với subscription của nó, và lần lưu thành công kế tiếp (Thử lại ở dải cảnh báo, một câu trả lời AI) trả lời "Thử lại" cho nó: cửa sổ tự đóng dù người dùng đã chọn ở lại.
Tái hiện / bằng chứng: đột biến unit `mutjs-i.mjs` G1 (log `I\logs\mutjs-i.log`); bản web đột biến `node build-web.mjs dist-G1 G1` + 7 ca e2e `-g "clos"` (log `I\logs\e2e-close-mutants.log`): "G1    7 passed" (đối chứng bản ghim 7 passed; G2 5 failed, G3 4 failed, G4 2 failed). Hậu quả (`u2-double-x.mjs`, log `I\logs\u2-double-x.log`), lần lưu lỗi → X hai lần → Escape → sửa được file, bấm "Thử lại" ở dải cảnh báo:
  bản ghim "U2 [4931] Thử lại on the warning, 1.5 s later destroyed: false; events ["save","save"]"
  bản G1   "U2 [4933] Thử lại on the warning, 1.5 s later destroyed: true; events ["save","save","destroy"]"
Cùng mẫu: bốn câu của handler: G2 (`preventDefault`), G3 (`destroy`), G4 (`closing = false`) đều bị e2e giết (log trên); chỉ G1 hở. Các câu bảo vệ khác của đường đóng / lưu đã đột biến ở mục 9 (C1–C3 của `close-guard.ts`, P1–P7 của `persist-queue.ts`, D1–D14 của `app-data.ts`): bị giết, trừ P3 (treo, xem CLR6-I3). `rg -n "requestClose" e2e`: 6 chỗ gọi (`dialog-keyboard.spec.ts:306`, `:315`, `:344` trong vòng 4 lượt; `save-state.spec.ts:245`, `:281`, `:300`), không chỗ nào gọi khi lần đóng trước chưa xong (mỗi lượt của vòng `:344` chờ Escape xong).
Ảnh hưởng: không ai gặp hôm nay (code đúng); một refactor của handler bỏ cờ thì không test nào đỏ, và lỗi chỉ lộ khi người dùng bấm X hai lần lúc lưu lỗi.
Chặn phát hành: không — Low trục T theo K48.
Đề xuất: thêm vào ca `e2e/dialog-keyboard.spec.ts:290` một lần `requestClose()` nữa khi hộp hỏi đang hiện, rồi sau Escape + "Thử lại" ở dải cảnh báo đòi `destroyed` vẫn false (≈ 6 dòng test, 0 dòng SP).
```

### CLR6-I3 — Một vòng chờ của hàng đợi lưu không bao giờ hết làm Vitest treo (không tự hết giờ), và CI không đặt `timeout-minutes`

```
ID: CLR6-I3
Mức: Nit
Trục: T
Vị trí: apps/desktop/src/data/persist-queue.ts:135 (`while (tracked.size > 0) await Promise.allSettled(tracked);`), :141 (vòng thứ hai); .github/workflows/ci.yml:52-56 (job `verify`), :115-124 (job `build-exe`): không job nào có `timeout-minutes` (5b1328a)
Tình trạng: CONFIRMED (treo ở máy); thời hạn 360 phút của GitHub là mặc định của GitHub Actions, không chạy CI để đo
Liên quan: thấy khi đột biến hàng đợi lưu (P3) · có từ trước
Mô tả: Đột biến P3 (`work.then(settled)` thay `then(settled, settled)`: một việc theo dõi bị từ chối không bao giờ ra khỏi `tracked`) làm `flush()` quay vòng trong microtask; timer không chạy được nên `testTimeout` 5 s của Vitest không bao giờ đến: lần chạy 9 file test đích bị treo ≈ 18 phút (22:21:34 → ≈ 22:39) tới khi bị dừng tay, rồi lần chạy cả bộ cũng treo. Trên CI, một lỗi như vậy giữ job `verify` tới mức trần mặc định của GitHub.
Tái hiện / bằng chứng: `I\logs\mutjs-i.log` dòng P3 (vitest chạy từ 22:21:34 không kết thúc, dừng tay ≈ 22:39; dòng log ghi tay "→ 22:41" là ước lúc ghi); harness sau đó đặt `timeout: 420_000` cho `spawnSync`. `rg -n "timeout-minutes|testTimeout" .github vitest.config.ts package.json` → không có.
Cùng mẫu: hai vòng `while (…) await …` của `persist-queue.ts` (:117 `idle`, :135, :141 `flush`); `close-guard.ts:25` (`for (;;)` có `await port.ask()` — chờ người, không quay vòng). Ba vòng của hàng đợi chỉ quay mãi khi sổ sách `tracked` / `running` sai.
Ảnh hưởng: chỉ người làm repo: một hồi quy kiểu này cho CI treo nhiều giờ thay vì đỏ ngay. Không ảnh hưởng người dùng (code đúng).
Chặn phát hành: không — Nit trục T.
Đề xuất: `timeout-minutes` cho job `verify` (vd. 30) và `build-exe` (vd. 45), hai dòng; không đổi code.
```

## 6. Bloat / Hiệu năng

Không có mục riêng (chỉ gói F và chủ đề G). Số đo duy nhất của phiên: đọc file tải 16 MB ở 10a mất 1,0 s trên bản web (K11; là cửa sổ của CLR6-I1, không phải phát hiện P).

## 7. Đếm

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | 0 |
| High | | | | | | | | | | 0 |
| Medium | | | | | | | | | | 0 |
| Low | 1 (I1) | | | | | | | 1 (I2) | | 2 |
| Nit | | | | | | | | 1 (I3) | | 1 |
| **Cộng** | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | **3** |

- CONFIRMED 3 / 3, PLAUSIBLE 0, KNOWN 0.
- Đề xuất **chặn phát hành: 0**; **không chặn: 3** (Low E, Low T, Nit T theo K48).
- Có từ trước cả ba; không phát hiện nào do đợt sửa sau lượt 5 (diff của chủ đề chỉ chạm `persist-queue.ts` / `app-data.ts`, đều có test giữ: B lượt 6 và mục 9).

## 8. Đã xét, không thấy

- **E:** chuỗi K1–K9 qua lớp dữ liệu (AI × Dọn sạch × xóa / khôi phục / Dọn sạch KH đang phân tích × đóng app; Dọn sạch lưu hai lần, lần nào lỗi), K16 (đổi hồ sơ KH khi phiên web / lượt AI còn), K17 (qua nửa đêm). Đúng spec, trừ CLR6-I1.
- **C:** S2-1…S2-6 (spec Phase 6 §4.1), TR-9, TR-11, D10 đối chiếu từng chuỗi K1–K9: khớp. Câu "đóng app không phải chờ (S2-6)" ở §4.4 (`phase-6-hoan-thien.md:254`) trái S2-6 hiện hành, nhưng §4.4 là biên bản duyệt 11/10 được giữ làm lịch sử (Owner chọn ở Issue sửa S2-6; `docs/reviews/raw/2026-10-31/common-fixes.md:5476`, `:5556`) — không ghi.
- **D:** không đường nào làm mất / sai dữ liệu đã lưu lặng lẽ: câu trả lời AI lưu đúng khi KH còn (K1, K4, K9), bị bỏ khi KH hết / dữ liệu đang thay (K2, K3, K5, K8); Dọn sạch lưu lại đủ khi một lần lưu lỗi (K6); đóng app chờ lần thay (K8). Chuỗi S-2 của B (F1–F9) không chạy lại.
- **G:** việc AI theo `generation` / `replacing`: đột biến A1–A5, A7–A9, J1–J3, J5, D2, D5 đều bị giết (mục 9); không thấy đường câu trả lời AI vào dữ liệu khác.
- **S:** export bị cắt giữa chừng khi đóng app: Rust ghi `.claim` + `.tmp` và dọn ở lần mở sau (`storage.rs:361-445`); `STALE_PAGE` chặn lần lưu của trang cũ; không thấy gì ở ranh giới.
- **P:** không thao tác nào của chủ đề chậm thấy được (đọc file 16 MB 1,0 s; 9 chuỗi lớp dữ liệu, mỗi chuỗi một lần mở app, lần đầu sinh seed, tổng 5,2 s).
- **B:** không xét (chủ đề G).
- **T:** 38 đột biến unit + 4 đột biến chạy e2e (mục 9): còn G1 (CLR6-I2), P3 treo (CLR6-I3); G1–G4 sống ở unit là dự kiến (handler chỉ e2e chạy được).
- **A:** hai hộp chồng nhau: focus vào hộp trên (10a), Hủy 10a thì 10c giữ nguyên (K11, K12); không thấy gì thêm ngoài CLR6-I1.

## 9. Phụ lục

### 9.1 Probe, log (`C:\workspace\deep-review-1-6-r6\claude\I\`)

Node v24.20.0 (`C:\Program Files\nodejs` đầu PATH), Home PC, không phiên review nào khác chạy cùng lúc trên worktree này (Codex ở `Project-2C-review-2`). Không dùng cổng 4173, không `pnpm e2e`, không `PW_REUSE`. Mọi trình duyệt: Edge headless, `--host-resolver-rules` chặn mọi host ngoài localhost / 127.0.0.1, `route.abort` cho host khác, `window.open` / clipboard thay từ lần chạy đầu (`blocked` rỗng ở mọi log). Không gọi dịch vụ AI: AI là Mock của `@p2c/ai` (lớp dữ liệu) hoặc `ai_complete` giả của asExe (không probe nào bấm Phân tích trên trình duyệt).

| File | Việc | Log |
|---|---|---|
| `r5copy\B\{hooks, p-flush, p-dr6-139, mutjs, mutant-config, p-listeners}.mjs`, `r5copy\E\{build-dist, serve-dist, pw.config, browser, ui-stub, hooks}.mjs` | bản chép theo tên đủ từ `deep-review-1-6-r5\claude\B\`, `…\E\` (báo cáo gốc `docs/reviews/raw/2026-11-05/claude/B.md` §9, `E.md` §9.1); chỉ làm nguồn, không chạy | — |
| `hooks.mjs` | loader TS cho probe Node (chép `r5copy\B\hooks.mjs`, `LOAD` → `-r6\common`) | — |
| `p-chains.mjs` | K1–K9: `openAppData` + storage giả của exe (giữ / làm lỗi từng lần lưu, giữ backup) + adapter giữ câu trả lời của Mock | `logs\p-chains.log` |
| `mutant-config.mjs`, `mutjs-i.mjs` | 38 đột biến unit (mục 9.2), hook `load` của Vite phục vụ bản đột biến, repo không đổi; `--check` đếm mẫu (mỗi mẫu đúng 1 chỗ) | `logs\mutjs-i.log`, `logs\mutjs-i.stdout*.log` |
| `build-web.mjs`, `web-mutants.mjs`, `serve-dist.mjs`, `pw.config.mjs` | bản web ngoài repo (Vite `build()` của worktree ghim; neo 15/09/2026 + ảnh chụp demo như `e2e/serve.mjs`, hoặc không neo), đột biến G1–G4 vào bản web, `vite preview` 127.0.0.1:4931 / 4932 / 4933, cấu hình Playwright chạy e2e của repo | `logs\build-base.log`, `logs\build-real.log`, `logs\serve-*.log`, `logs\e2e-close-control.log`, `logs\e2e-close-mutants.log` |
| `browser.mjs` | bộ trình duyệt (chép `r5copy\E\browser.mjs`, baseURL 127.0.0.1; asExe = `e2e/support.ts` không đổi từ `2e51e25`) | — |
| `u1-stacked.mjs`, `u1b-typed.mjs` | K10–K12, CLR6-I1 | `logs\u1-stacked.log`, `logs\u1b-typed.log` |
| `u2-double-x.mjs` | K15, CLR6-I2 | `logs\u2-double-x.log` |
| `dist-base\`, `dist-real\`, `dist-G1\` … `dist-G4\` | bản web dựng ra (`git status --short after: ""` ở mọi lần dựng) | — |

### 9.2 Đột biến

Unit (`node mutjs-i.mjs`; 9 file test đích: `persist-queue`, `app-data`, `listeners`, `ai-jobs`, `ai-analysis`, `today`, `close-guard`, `CloseGuard`, `SaveWarning`; sống ở đích thì chạy cả 4 493 test). Đối chứng không đột biến: **196 / 196** xanh. e2e (`build-web.mjs` + 7 ca `-g "clos"` của `save-state.spec.ts`, `dialog-keyboard.spec.ts`): đối chứng **7 / 7** xanh.

| ID | File | Đột biến | Kết quả |
|---|---|---|---|
| J1 | `ai-jobs.ts` | giữ lỗi của job đã bị Hủy (bỏ `jobs.get(key) === entry`) | bị giết (1) |
| J2 | `ai-jobs.ts` | lần chạy mới không bỏ lỗi đã giữ | bị giết (1) |
| J3 | `ai-jobs.ts` | `kept()` bỏ qua `generation` (DR6-144) | bị giết (3) |
| J5 | `ai-jobs.ts` | `end()` xóa entry bất kỳ (job đã Hủy mất ngay) | bị giết (2) |
| A1 | `ai-analysis.ts` | `replaced()` bỏ `replacing()` (S2-3) | bị giết (5) |
| A2, A3 | `ai-analysis.ts` | ChatGPT web không kiểm `generation` sau copy / sau mở trình duyệt | bị giết (1 / 1) |
| A4 | `ai-analysis.ts` | Kiểm tra và lưu bỏ `generation` (DR6-15) | bị giết (1) |
| A5 | `ai-analysis.ts` | KH đã xóa thành lỗi chung (TR-9) | bị giết (2) |
| A7 | `ai-analysis.ts` | AI trích xuất không kiểm `replaced` (R2-07, S2-3) | bị giết (3) |
| A8 | `ai-analysis.ts` | Kiểm tra và lưu lúc đang thay → `failed` | bị giết (1) |
| A9 | `ai-analysis.ts` | phân tích chỉ kiểm `replacing()` | bị giết (3) |
| D1 | `app-data.ts` | `run` ghi trong lúc thay (S2-2) | bị giết (3) |
| D2 | `app-data.ts` | Dọn sạch tăng `generation` (TR-11) | bị giết (1) |
| D3 | `app-data.ts` | Nạp lại đọc ngày trước backup (DR-30) | bị giết (1) |
| D4 | `app-data.ts` | lần thay không `track` (S2-6) | bị giết (3) |
| D5 | `app-data.ts` | lần thay giữ `generation` (DR5-36) | bị giết (11) |
| D7 | `app-data.ts` | DB đang mở không lưu (#206) | bị giết (3) |
| D8 | `app-data.ts` | thay tiếp sau lần lưu lỗi | bị giết (7) |
| D9 | `app-data.ts` | DB cũ không đóng | bị giết (3) |
| D10 | `app-data.ts` | Nạp lại bỏ Cài đặt → AI (DR5-50) | bị giết (2) |
| D12 | `app-data.ts` | lần thay bị từ chối giữ khóa ghi mãi | bị giết (19) |
| D13 | `app-data.ts` | các lần thay không nối hàng (S2-1) | bị giết (2) |
| D14 | `app-data.ts` | `readBackup` kiểm theo đồng hồ, không theo ngày app (DR-86) | bị giết (1) |
| P1 | `persist-queue.ts` | lần ghi thành công giữ bản lỗi | bị giết (3) |
| P3 | `persist-queue.ts` | việc theo dõi bị từ chối không ra khỏi `tracked` | **treo** (Vitest không tự hết giờ; dừng tay) → CLR6-I3 |
| P5 | `persist-queue.ts` | `flush()` ghi lại bản lỗi cả khi lần ghi mới đang chạy | bị giết (1) |
| P6 | `persist-queue.ts` | lần ghi lỗi quên lần lưu cuối | bị giết (2) |
| P7 | `persist-queue.ts` | `flush()` resolve sau lần ghi lỗi | bị giết (6) |
| C1 | `close-guard.ts` | Escape (`stay`) vẫn đóng | bị giết (1) |
| C2 | `close-guard.ts` | lần lưu thành công sau không trả lời hộp (DR6-147) | bị giết (1) |
| C3 | `close-guard.ts` | hộp hiện cả khi đã lưu được | bị giết (1) |
| G1 | `CloseGuard.tsx` | bỏ `if (closing) return;` | sống unit (4 493); **sống e2e 7 / 7** → CLR6-I2 |
| G2 | `CloseGuard.tsx` | bỏ `event.preventDefault()` | sống unit; e2e bị giết (5 đỏ) |
| G3 | `CloseGuard.tsx` | không `destroy` | sống unit; e2e bị giết (4 đỏ) |
| G4 | `CloseGuard.tsx` | không trả `closing = false` | sống unit; e2e bị giết (2 đỏ) |
| T1 | `today.ts` | hẹn giờ nửa đêm không đặt lại | bị giết (1) |
| T3 | `today.ts` | trang ẩn cũng báo đổi ngày | bị giết (1) |

Tổng: 38 đột biến unit — 33 bị giết, 1 treo (P3), 4 sống ở unit (G1–G4, handler chỉ e2e chạy); 4 đột biến e2e — 3 bị giết, 1 sống (G1). Đột biến sống không tương đương: G1.

### 9.3 Cuối phiên

- Server tạm 4931 / 4932 / 4933 đã dừng (`Get-NetTCPConnection` không còn cổng nào nghe).
- `git status --short` cuối phiên (worktree `C:\workspace\Project-2C-review`): rỗng (như đầu phiên); dòng cuối `mutjs-i.log`: `repo git status --short after: ""`.
- Giờ xong: 2026-11-07 22:47 (+07:00).
