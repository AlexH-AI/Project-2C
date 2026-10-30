# KNOWN — deep review Phase 1–6, lượt 4

Dựng ở bước chuẩn bị (kế hoạch `plan.md` §L4.5, §L4.9 bước 4), 29/10/2026 00:22 +07:00, máy `DESKTOP-KDURKJP` (Home PC), ở SHA ghim `2e51e25` (`2e51e25eb0125f56d3d938b97ef18d6873dae076`). Phát hiện trùng một mục dưới đây gắn `KNOWN`, chỉ nêu khi có **bằng chứng mới** (hậu quả nặng hơn ghi chú, đường vào mới). Dòng của bảng R1 / R2 (phần 4, 5) chỉ ghi ở bảng R của gói kiểm, không ghi lại thành phát hiện.

Năm phần: (1) nguyên văn mục OPEN (rỗng) và ACCEPTED của `docs/state/review-notes.md` ở SHA ghim; (2) quyết định Owner còn hiệu lực K1–K40 (K12, K13, K14, K17, K21 theo chữ ở `plan.md` §L4.5); (3) nguyên văn mục "Lệch mockup đã biết" của `docs/testing/nghiem-thu-v1.md` ở SHA ghim; (4) bảng R1 (37 dòng) và các mục KNOWN theo mã; (5) bảng R2 theo Issue, thêm các Issue của đợt sửa mục OPEN trước lượt 4.

> Ghi chú sổ thêm sau SHA ghim (chỉ PR docs): chưa có lúc dựng file này; sổ ở `origin/main` = SHA ghim `2e51e25`.

---

# Phần 1 — `docs/state/review-notes.md` ở `2e51e25`: OPEN và ACCEPTED (nguyên văn)

OPEN không còn mục lá nào (điều kiện B2, kiểm ở bước chuẩn bị 1 trên `origin/main` = `2e51e25`); đoạn đầu của mục OPEN giữ nguyên văn vì nó tả đường đi của các mục [G7] tới đợt sửa mục OPEN.

### OPEN

Rà sổ G7 Phase 6 (23/10, `main` `4ba705b`): mọi mục dưới đây đã kiểm trên code và vẫn đúng. **Owner 23/10: sửa hết trước v1.0.** Quyết định này thay lần chốt trước đó cùng ngày, khi Claude đề xuất hoãn phần lớn sổ sau v1.0. Mọi mục OPEN vào một đợt sửa trước các bước G7 còn lại: 19 Issue T-283…T-301 (#772–#790), Owner duyệt kế hoạch 23/10. Đợt sửa xong 26/10 (T-301 PR 2/2, PR #846): mục lá còn ở OPEN đều là [G7]. Mỗi mục lá gắn đúng một nhãn: **[T-xxx #n]** là Issue sửa mục đó, **[G7]** là việc của G7. Mục thuộc nhiều Issue đã tách thành mục con. Năm mục đã chuyển sang ACCEPTED theo đề xuất trước đó trở lại OPEN. Nhóm cuối mục OPEN thêm mười phần có cải thiện thật từ ACCEPTED và ba lệch mockup đã biết. **[G7]**: làm trong G7 (PR docs `phase-6.md`, lần chụp lại ảnh hướng dẫn, PR docs nghiệm thu). Mục đã sửa từ trước mà sổ chưa chuyển nay ở RESOLVED; mục chỉ ghi lại, hoặc review / Owner đã chấp nhận lúc ghi, nay ở ACCEPTED. **Rà sổ 27/10 (trước vòng review toàn bộ code, Owner duyệt):** mục [G7] làm được trước vòng review chuyển sang T-305 (#849, code), T-306 (#850, spec / nghiệm thu / hướng dẫn) và T-307 (#851, số đo); mục #547 tách ba phần. Còn [G7] là việc của lần chụp lại ảnh hướng dẫn, sau vòng review và đợt sửa của nó. T-305 xong 27/10 (PR #855), gộp cả phần [G7] "chụp phần trên" của #547 (Owner 27/10); hai ghi chú mới của review #855 là [G7] (PR nhỏ G7). T-306 xong 27/10 (PR #857): 11 mục [T-306] đã chuyển sang RESOLVED, nên nhóm review #547, #554, #740, #764, #846 không còn mục nào; review #857 không có ghi chú mới. T-307 xong 27/10 (PR #859): 15 mục [T-307] đã chuyển sang RESOLVED, nên nhóm review #539, #543, #545, #566, #572, #710, #717, #801, #805, #812, #817, #828, #833, #835, #845 không còn mục nào; hai ghi chú mới của review #859 là [G7] (PR docs `phase-6.md` của G7). T-308 xong 27/10 (PR #861): PR không sửa mục nào của sổ; bảy ghi chú mới của review #861 là [G7] (lần chụp lại ảnh hướng dẫn, PR docs nghiệm thu, PR nhỏ G7), thêm một mục [T-309 #854] cho KNOWN lượt 4. T-309 xong 28/10 (PR #863; Owner duyệt G1 28/10): mục [T-309 #854] đã chuyển sang RESOLVED; tám ghi chú mới của review #863 gom thành bảy mục [G7], sửa trước khi ghim SHA lượt 4 (B2): ba mục chạm cách chạy DeepSeek ở PR docs ghi quyết định DSH 28/10, bốn mục còn lại ở PR code / PR tài liệu của đợt sửa mục OPEN. **Gắn lại nhãn 28/10** (Owner 28/10: việc DSH là Issue riêng): 21 mục [G7] chuyển sang T-310 (#865, code, 8 mục), T-311 (#866, tài liệu, 6 mục), T-312 (#867, chụp lại ảnh hướng dẫn, 4 mục, làm sau T-310) và T-313 (#868, DeepSeek qua DSH, 3 mục, chờ Owner chốt G4 / G6). OPEN không còn mục [G7]. T-310 xong 28/10 (PR #871): 7 mục [T-310] đã chuyển sang RESOLVED, mục ảnh logo trùng byte sang ACCEPTED (task chọn giữ bản sao), nên nhóm review #855 không còn mục nào. Review #871 có một ghi chú mới (ca e2e chập chờn có sẵn), gắn [G7] như nhóm review #863 lúc ghi, gắn lại nhãn khi có Issue; sửa trước khi ghim SHA lượt 4 (B2). T-311 xong 28/10 (PR #870): 6 mục [T-311] đã chuyển sang RESOLVED, nên nhóm review #859 không còn mục nào. Review #870 có một ghi chú mới (câu tóm tắt bảng R1 ở §L4.4 của kế hoạch lượt 4), gắn [G7] như nhóm review #871 (Owner 28/10), gắn lại nhãn khi có Issue; sửa trước khi ghim SHA lượt 4 (B2). T-313 xong 28/10 (PR #872): 3 mục [T-313] và mục [G7] của review #870 (câu tóm tắt CL3-A29 ở §L4.4) đã chuyển sang RESOLVED, nên nhóm review #863 và nhóm review #870 không còn mục nào. Review #872 có năm ghi chú mới (bước dọn và nhánh dự phòng của `dot2.mjs`, việc đọc file `.codex` của phiên thử, bảng yêu cầu ở đầu lượt 4, số dư DeepSeek lúc bắt đầu), gắn [G7] như nhóm review #870, gắn lại nhãn khi có Issue; sửa trước khi ghim SHA lượt 4 (B2). **Gắn lại nhãn 28/10, lần 2** (sau PR #875): 6 mục [G7], của review #871 (1) và #872 (5), chuyển sang T-314 (#876, PR nhỏ trước lượt 4). OPEN không còn mục [G7]. T-314 xong 28/10 (PR #878): 6 mục [T-314] đã chuyển sang RESOLVED, nên nhóm review #871 và nhóm review #872 không còn mục nào. Review #878 có hai ghi chú mới (`clean` của `dot2.mjs` giữ cả thư mục mới có `node_modules`, cùng cache `.vite` trong đó; kế hoạch chưa ghi việc `clean` xóa một phần `target\` khi thư mục này có sẵn lúc ghi mốc), gắn [G7] như nhóm review #872, gắn lại nhãn khi có Issue; sửa trước khi ghim SHA lượt 4 (B2). T-312 xong 28/10 (PR #882): 4 mục [T-312] đã chuyển sang RESOLVED, nên nhóm review #760, #825, #838 và #861 không còn mục nào. Review #882 có một ghi chú mới (`rightOfSidebar` của bộ chụp ảnh hướng dẫn đo `main` trước khi cuộn về đầu trang), gắn [G7] như nhóm review #878, gắn lại nhãn khi có Issue; sửa trước khi ghim SHA lượt 4 (B2). **Gắn lại nhãn 28/10, lần 3** (sau PR #883): mục [G7] của review #882 chuyển sang T-316 (#884, PR nhỏ trước lượt 4). T-315 xong 28/10 (PR #881): 2 mục [G7] của review #878 (Issue #880 gộp) đã chuyển sang RESOLVED, nên nhóm review #878 không còn mục nào. Review #881 có ba ghi chú mới (Memory của app không được dọn sau phiên thử của đợt 2; nhánh Full Access chưa được kiểm ACL; `clean` của `dot2.mjs` in dòng `kept` cả cho thư mục đã có lúc ghi mốc), gắn [G7] như nhóm review #882 lúc ghi, gắn lại nhãn khi có Issue; sửa trước khi ghim SHA lượt 4 (B2). **Gắn lại nhãn 28/10, lần 4** (sau PR #886; Owner 28/10: gộp vào T-316): ba mục [G7] của review #881 chuyển sang T-316 (#884, PR nhỏ trước lượt 4). OPEN không còn mục [G7]. T-316 xong 28/10 (PR #888): 4 mục [T-316] đã chuyển sang RESOLVED, nên nhóm review #882 và nhóm review #881 không còn mục nào. Review #888 có một ghi chú mới (nhánh hỏng của phiên thử dọn Memory nhưng chưa dọn `common\baseline.md`), gắn thẳng [T-317 #889] (Owner 28/10: sửa trước lượt 4 ở Issue riêng); sửa trước khi ghim SHA lượt 4 (B2). T-317 xong 28/10 (PR #891): mục [T-317] đã chuyển sang RESOLVED, nên nhóm review #888 không còn mục nào; review #891 không có ghi chú mới. OPEN không còn mục lá nào (B2; bước chuẩn bị lượt 4 kiểm lại ở `origin/main`).

Theo file, gộp vào lần chạm sau cùng file (hoặc T-h nếu còn chỗ):

### ACCEPTED

- **Issue #865 (T-310; kế hoạch lượt 4 Owner duyệt G1 28/10 cho task chọn cách), review #871** (`REVIEW: PASS` @`92c88ac`, mức low), `docs/design/mockups/img/` (`heritas-tree.png`, `heritas-wordmark.png`, `heritas-lcrm.png`): mục *Duplicated Code* của review #861. Ba ảnh logo của mockup giữ bản sao, trùng từng byte ba ảnh của `apps/desktop/src/assets/brand/`. Lý do (thân PR #871, mục 7): mockup đã duyệt G3 là hợp đồng giao diện; trỏ ảnh của app thì một lần đổi logo phía app đổi luôn mockup mà không qua G3, và review app ↔ mockup mất mốc độc lập để so. Thư mục mockup tự chứa: không mockup nào trỏ ra ngoài `docs/design/mockups/`, và cấu hình xem mockup `mockups` của `.claude/launch.json` lấy gốc `docs/design/mockups`, nên đường dẫn ra ngoài nhận `index.html` thay vì ảnh. Hai nơi cùng blob nên repo lưu mỗi ảnh một lần. Đổi logo vốn qua G3; PR đó sửa cả hai nơi.

- **Issue #789 (T-300, kế hoạch Owner duyệt 23/10), review #843** (`REVIEW: PASS` @`df24283`, mức med), `packages/ui/src/components/DataTable.tsx`: phần còn lại của mục `DataTable` (Phase 1). `cellClass` (#240) và ba tùy chọn `fixed`, `compact`, `width` (PR #838) là class của component, chỉ e2e phủ. Issue #789 tách phần logic ra hàm thuần (`packages/ui/src/components/table-view.ts`, có test) và không thêm thư viện DOM (G4: không), như mục #227 (PR #240) ở dưới. Muốn unit test các class này thì phải thêm công cụ test component (G4).

- **Owner 25/10, review #837** (T-304, #831, `REVIEW: PASS` @`8fbee71`, mức high), `eslint.config.js` (luật chỉ cho `zod/mini`): Owner nhận một lỗ của luật, không sửa trước v1.0:
  - `eslint.config.js:55`: mục `paths` so tên trần `zod` phân biệt hoa thường, còn `patterns` thì không, nên `import { z } from 'Zod'` / `'ZOD'` không bị báo. Trên Windows (CI `windows-latest` và hai máy), TypeScript và Vite vẫn resolve tên viết hoa ra zod bản đầy đủ: review build thử một file nhỏ ra 87 229 B, có zod classic, so với 11 502 B bằng `zod/mini`. Chỉ xảy ra khi viết sai hoa thường tên gói (auto-import và mọi file hiện có viết `zod`), nhỏ hơn `import()` động mà Issue #831 đã để ngoài. Cách sửa nếu cần: một mục `regex` `^zod(/(?!mini$)|$)` (luật mặc định không phân biệt hoa thường) thay cả `paths` lẫn `patterns`; review đã thử: báo mọi tên luật hiện báo, thêm `Zod` / `ZOD`.

- **Owner 25/10, review #828** (T-291, #780, `REVIEW: PASS` @`7635e9f`, mức high), `packages/ai/src/extract-json.ts` (mục 11 của Issue, hướng của review #822): Owner giữ cách đọc mới và nhận loại ca nó làm sai, không sửa trước v1.0:
  - Lời văn có `{` không đóng rồi một `"{}"` trong nháy, trước câu trả lời: ở lượt đọc lại, dấu nháy của lời văn là chữ thường nên `"{}"` thành khối ngoài cùng và được lấy trước câu trả lời. Vd. `Theo mẫu { "a": "{}" ` + câu trả lời ra `{}` (V1, tốn một lần thử), trong khi trước PR #828 lượt đầu lấy đúng câu trả lời. Thân PR #828 đo trên chuỗi giống câu trả lời: mỗi 600 000 lần đọc, sửa đúng ≈ 2 100 ca (loại ca của review #822), làm sai ≈ 90; không chiều nào ACCEPTED nhầm.

- **Owner 25/10, review #817** (T-294, #783, `REVIEW: PASS` @`ade08be`, mức med), chỉ báo lưu và nút Thử lại (`docs/design/mockups/settings-data.html`): hai điểm mockup không vẽ khác đi; Owner giữ như mockup, không sửa trước v1.0:
  - `apps/desktop/src/shell/SaveWarning.tsx:33`: Thử lại mà vẫn lỗi cùng nguyên nhân thì màn không đổi gì: dải giữ chữ nên `role="alert"` không đọc lại, focus ở nguyên nút; chỉ có "Đang lưu…" thoáng qua ở chân sidebar (file bị giữ thì Rust báo lỗi ngay). Mockup không vẽ trạng thái đang thử lại. Cách sửa nếu cần: nút tắt và ghi "Đang lưu…" trong lúc `flush()` chạy.
  - `apps/desktop/src/shell/Sidebar.tsx:95`: "Đã lưu HH:MM" không có ngày; app mở qua nửa đêm (T-126) thì sáng hôm sau vẫn ghi giờ của hôm qua, dù `formatLocalTime` của `@p2c/domain` ghi là cho giờ "whose day is clear from context". Mockup 10d chỉ có `HH:MM`; ngày giờ đủ của lần lưu cuối có ở Cài đặt → Dữ liệu ("Lưu lần cuối"). Cách sửa nếu cần (G3): thêm ngày (vd. `formatLocalDayMonthTime`) khi lần lưu cuối không thuộc hôm nay.

- **Owner 25/10, review #815** (T-302, #793, `REVIEW: PASS` @`dfc7203`, mức low), `tools/pr-core.test.mjs` (`docsRead`): hai giới hạn của cách đoán tài liệu mà test đọc từ gốc repo. Chưa test nào trong repo gặp; Owner chấp nhận, không sửa trước v1.0:
  - `tools/pr-core.test.mjs:42` (`DOCS_PATH`): một đường dẫn `docs/…` tới file không phải `.md`, theo sau là một đối số chuỗi `.md`, bị ghép thành một đường dẫn: `Promise.resolve(['docs/a/b.png', 'CLAUDE.md'])` cho `docs/a/b.png/CLAUDE.md` (`callAround` trả `resolve`), `join(root, 'docs/img/a.png', 'x.md')` cho `docs/img/a.png/x.md`; code trước PR #815 trả `[]`. Gặp thì ca `CODE_DOCS` đỏ vì một tài liệu không có thật, không sót tài liệu nào. Cách sửa nếu cần: bỏ kết quả khi một đoạn đứng trước đoạn cuối có đuôi file.
  - `tools/pr-core.test.mjs:48` (`callAround`): đếm cả ngoặc nằm trong chuỗi / comment, nên `readFileSync(join(root, '(', 'docs/golden/ai-eval.md'))` cho `[]`, tức sót tài liệu mà không có gì báo. Cách viết rất khó gặp.

- **Rà sổ G7 Phase 6 (23/10), review #760**, `apps/desktop/src/index.css` (Lệch 1 của PR #760 so với Issue #735): `scroll-margin-top: --spacing(20)` đặt lên nội dung của `main` (trừ hộp thoại), không phải `scroll-padding-top` lên phần tử cuộn của trang như Issue ghi. Lý do là số đo trên Edge của PR: thanh nằm trong trang, nên với `scroll-padding-top` thì focus vào nút của thanh làm trang cuộn (500 → 142); ca `e2e/topbar-focus.spec.ts:76` giữ hành vi này. Không phải lỗi: làm theo chữ Issue thì hỏng hành vi đó. Vì vậy mục này ở lại ACCEPTED khi Owner 23/10 chốt "sửa hết trước v1.0".

- **Rà sổ G7 Phase 6** (23/10, `main` `4ba705b`): các ghi chú dưới chỉ ghi lại, hoặc review / Owner đã chấp nhận lúc ghi, nên không còn việc phải làm. Đã kiểm trên code: vẫn đúng như ghi. Chuyển từ OPEN, giữ chữ gốc (bỏ phần đầu nhóm). Mười phần có cải thiện thật (PR #769 từng chuyển sang đây) trở lại OPEN theo phạm vi Owner chốt 23/10, xem nhóm "Đưa vào đợt sửa" ở cuối OPEN:
  - Review #239, `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx`: nhánh `!pickable` vẫn có thể gắn `bg-period-band` về lý thuyết; `inPeriod` ⇒ `pickable` nên không xảy ra.
  - Review #521, `apps/desktop/src/routes/customers/ai-panel-view.ts` (`issueLine`): nhận ra "bị cắt" bằng so chuỗi `CUT_ANSWER.detail` đã lưu trong `validator_json`; đổi chữ đó sau này thì dòng cũ hiện "Không có khối JSON hợp lệ". Dữ liệu giả lập nên chấp nhận được (R2-02); đổi chữ thì nạp lại dữ liệu.
  - Review #547: Issue #533 ghi "spec chụp ảnh không nằm trong `testDir` của `playwright.config.ts`" nhưng lại chỉ định `e2e/guide/**`; PR tách bằng đuôi `*.guide.ts` ngoài `testMatch` mặc định nên `pnpm e2e` không chạy. Không cần sửa code; đổi `testMatch` của e2e sang dạng nhận cả `*.ts` sẽ kéo spec chụp ảnh vào e2e.
  - Review #620: `ACCESS_DENIED` của `apps/desktop/src-tauri/src/storage.rs` gom mọi `PermissionDenied` của `open` (kể cả `project2c.db` là thư mục), PR đã nêu, chấp nhận.
  - Review #628, `apps/desktop/src/routes/customers/ai-panel-view.test.ts`: test "takes kyc v<n> of its chip from the input taken…" gần như hiển nhiên, vì `webChip` không còn nhận danh sách phiên bản; vẫn đúng chữ test chấp nhận của #598, phần chống lưu vào dữ liệu mới có test thật ở `apps/desktop/src/data/ai-analysis.test.ts`. Cùng review: `PROMPT_VERSIONS` (`packages/ai/src/schema.ts`) chép chuỗi version của `prompts/*.ts` vì `schema.ts` không được import prompt; test `packages/ai/src/schema.test.ts` giữ khớp.
  - Review #630, NIT `apps/desktop/src/routes/SettingsTrash.tsx`: `useCallback((db) => listTrash(db), [today])` + `eslint-disable` đưa ngày vào qua một dependency mà callback không đọc. Đúng hành vi; review chọn giữ comment, comment đã có (`:276-278`, DR6-43).
  - Review #640, `packages/domain/src/text.ts` (`normalizeText`): bỏ mọi `\p{Cf}` thì bỏ cả U+200D (ZWJ) và U+200C (ZWNJ), nên tên có emoji ghép được lưu thành các emoji rời. Owner đã chọn đúng luật này ("bỏ `\p{Cf}`", Issue #604); chỉ xem lại nếu có tên thật dùng emoji ghép.
  - Review #667 (P-2): PR sửa bốn file ngoài danh sách của Issue (`packages/db/src/customers.ts` + test, `packages/db/src/index.ts`, `apps/desktop/src/routes/appointments/DeleteAppointmentDialog.tsx`), có nêu lý do trong thân PR (luật D7 nằm ở `withdrawAppointmentTransition`; khung "Khi lưu" của 6f dùng chung chữ với 6g) nhưng không có mục "Ngoài danh sách file" riêng.
  - Review #669: `apps/desktop/src/shell/AppShell.tsx` gọi `scrollTo(0, 0)` cả khi đổi mục trong Cài đặt, hợp ý "mở màn khác"; PR sửa `e2e/navigation.spec.ts` (DR6-81) ngoài ngoặc của Issue #654 mà không nêu ở phần lệch (P-2), file đúng chỗ.
  - Review #718 (P-2): PR #718 sửa `docs/reviews/raw/README.md` (thêm dòng 2026-10-21) ngoài danh sách file của Issue #714; lý do hiển nhiên (bảng mục lục của `raw/`).
  - Review #746, `apps/desktop/src/routes/customers/KycIntelligence.tsx` (dòng "Mức bằng chứng" của `Item`): PR #746 bỏ `whitespace-nowrap`, khác `.strength { white-space: nowrap }` của `docs/design/mockups/customer.html`. Bỏ là đúng: dòng nằm trong khối `flex-wrap`, chỉ khác bản `nowrap` đúng ở chỗ bản cũ tràn. Không thêm lại `nowrap` "cho khớp mockup".
  - Review #760: ca canh của `e2e/topbar-focus.spec.ts` đọc `scrollMarginTop` tính được (cơ chế, không phải hành vi), chấp nhận vì Issue #735 nêu hợp đồng là "giá trị chừa ra" (đổi cơ chế thì đổi cả ca này); `showFact` của `apps/desktop/src/routes/customers/CustomerProfile.tsx` căn giữa cả lề 80, dữ kiện mở từ mã F thấp hơn tâm khoảng 40, vẫn trong khung nhìn; dải 80 của `apps/desktop/src/index.css` làm Tab / mũi tên của `Segmented` / `focus()` cuộn thêm tối đa 16 hoặc 21 (Lệch 2 của PR).

- **Owner quyết 17/10 (PR #667, T-249, DR6-70):** khung "Khi lưu" của hộp 6f hiện ở mọi ca Lưu rút chuyển nhóm của chính cuộc gặp mà không ghi chuyển nhóm nào thay. Như vậy là rộng hơn câu chữ của Issue #653, vốn chỉ nói ca dời ngày.
  - Ba ca này: dời ngày qua một lần đổi nhóm khác; đổi Đã gặp → Hủy / Không đến; tự chọn nhóm sau "giữ nguyên".
  - Luật chung là `undoneMove` (`outcome-form.ts`), khớp `editMeetingOutcome`: lệnh rút khi `!keepsStage || moved`, và `applyOutcome` không ghi gì khi nhóm sau = nhóm cuối ngày.
  - Chọn nhóm sau khác (ghi chuyển nhóm mới thay) thì không hiện khung: dòng đọc lại có sẵn đã nêu chuyển nhóm mới và RF.
  - Trước đây quyết định này chỉ ghi ở thân PR.
- Ghi chú review #539, ca "TR-5: blocks a policy issued after today" (`packages/db/src/trash.test.ts`, HĐ phát hành 12/10) đỏ khi `TZ=Pacific/Auckland`: Issue #606 (DR6-65) chốt đồng hồ `setup()` chỉ bảo đảm múi giờ UTC−11…+12, Auckland giờ mùa hè (UTC+13) nằm ngoài. PR #644 giữ nguyên ca này, comment DR-15 nêu khoảng bảo đảm. CI và hai máy ở UTC+7.
- Panel KYC Intelligence (#439): `BADGE_COLORS` của panel không gộp với `GATE_COLORS` (`CustomerKyc.tsx`) vì mockup tô `PAIN_POINT_ANALYSIS` khác nhau (panel `c-info`, thẻ KYC `c-ok`). Chip theo `provider` đã sửa trong chính #439 (commit `6a3f242`) → comment chuyển đi trên T-174 #433 chỉ còn việc thêm tên "ChatGPT web".

- **DR-43 (Owner quyết 06/10, deep review §11 điểm 5):** HĐ / cuộc gặp MET mang ngày hoặc nhóm trước ngày tạo KH là **nhập bù hợp lệ** — không thêm luật ở lệnh hay khi nhập backup. Câu báo khi MET đổi nhóm bị chặn mang đúng ngày chặn (DR-64, T-144 #378). **Owner 17/10 giữ quyết định này** (deep review lượt 2 §9 Q1 (a), DR6-68 hồi quy do #616): trước ngày tạo KH, nhóm của ngày = nhóm tạo KH → #652 (T-248).

- Review #334 (T-126): `apps/desktop/src/data/today.ts` `untilMidnight` tự tính `new Date(y, m, d + 1)` ngoài `packages/domain` — chỉ ra mili giây cho hẹn giờ, không parse / format; đưa vào `domain` nếu nơi khác cần. Ngày được chọn của màn Lịch hẹn không tự nhảy sang ngày mới qua nửa đêm (Issue #318 "Hệ quả thêm").
- **Owner quyết 30/09 (#171):** lịch Dời lịch không có nút xóa (chuỗi dời, cần quy tắc riêng G1/G2); ô **Giờ** ở hộp 6f giữ; câu "Xóa mềm, khôi phục được" ở 6g giữ — màn "Thùng rác" xếp Phase 6 (xem comment Owner trên #72).
- Hộp lỗi màn hình chỉ hiện `String(error)`, không stack (#206 vòng 1; React 19 tự `console.error` kèm stack).
- `storage.rs`: đường dẫn kết thúc bằng `\` sẽ thành `"…\"` — không xảy ra vì `folder()` luôn trả `…\exports|backups` (#196); `rename` trên Windows ghi đè đích, chỉ tránh nhờ claim (chương trình ngoài tạo trùng tên trong vài ms thì bị ghi đè) (#192).
- Lịch hẹn: chưa có cây Team → RE ở cột trái (góc nhìn dùng bộ chọn chung; "Trong ngày" đảm nhận team → RE); tóm tắt tháng / trigger / chuyển nhóm của mockup là chỉ số Phase 4 (#156/#158). Biến thể "không đổi nhóm KH" của hộp xóa hiện bảng 3 dòng cả cho lịch Hủy / Không đến (#179).
- #227 (PR #240): test unit tùy chọn "`DataTable` gắn class của cột vào ô" thay bằng e2e (`appointments.spec.ts:189`) — mâu thuẫn spec với hạ tầng test, review chấp nhận.
- Hai file ngoài danh sách của #68 (`domain/period.ts` `formatDayMonth`, `db/appointments.ts` `coordinatorsByAppointment`) — Owner ghi nhận (#155).
- Hành vi theo spec, lớp gọi phải tuân (#33, #36, #44, #62):
  - `suggestedQuestions` trả cho mọi hạng mục thiếu ở cả 4 trạng thái (UI quyết định hiện); trường mâu thuẫn xếp theo `KYC_FIELDS`.
  - "Mới nhất" theo thứ tự thao tác, không theo `confirmedDate`; lớp nhập liệu chuẩn hóa kiểu giá trị theo trường.
  - `isRfAppointment` dựa vào `StageTransition.appointmentId` → db/UI luôn tạo transition gắn `appointmentId` khi ghi "nhóm sau cuộc gặp".
  - `markKycConflict` đổi mọi lỗi của `markConflict` thành `KYC_NO_CONFLICT`; chuỗi "Cập nhật KYC dd/mm/yyyy" có ở cả `db/kyc.ts` và `domain/kyc.ts`; ghi chú `SYSTEM` là dữ liệu DB, UI không dịch lại; đổi ngày sinh cùng năm vẫn tạo ghi chú + dữ kiện thay thế, không tạo phiên bản.
- R1: `PERSON_IN_USE` đếm cả KH xóa mềm (câu báo ở T-046); năm > 9999 (gộp vào miền năm T-f).
- ADR-0003 còn nói `/resume` và branch protection — Owner để nguyên (ADR đã Accepted); `CLAUDE.md` và PLAN là bản đúng.
- **DR6-53 (Owner 15/10, deep review Phase 1–6 lượt 1 §8.5):** `ulid` (`packages/db/src/ids.ts`) với đồng hồ trước 1970 cho mã 16–17 ký tự (`time % 32` âm → `charAt` rỗng), mốc 1900 và 1969 trùng phần thời gian (H·MU-A1). Cần đồng hồ máy sai trước 1970; mã vẫn khác nhau nhờ phần ngẫu nhiên → chấp nhận, không sửa.
- **PR #628 (T-237, #598, review @`ac486e6`):** bấm Kiểm tra và lưu trong lúc **đang** thay dữ liệu (Nạp lại / Nhập backup), `saveChatGptAnswer` (`apps/desktop/src/data/ai-analysis.ts:347`) trả `replacing` và giữ phiên, không trả `discarded` như chữ Issue #598 ("đã thay hoặc đang thay (như `analyseCustomer`)"). Kiểm tra và lưu là lệnh ghi do người dùng bấm nên theo S2-2 (spec Phase 6, `docs/design/phase-6-hoan-thien.md:63`), khác câu trả lời AI tới lúc đang thay (S2-3). Không ghi vào dữ liệu khác: đang thay thì `run` từ chối; thay xong thì `generation` đổi → `discarded`, panel bỏ phiên; thay lỗi thì phiên lưu được (S2-4). Review nêu điểm này cho Owner trước khi merge; Owner bảo merge 15/10.
- **J5 của DR6-60 (Owner 17/10, deep review Phase 1–6 lượt 2 §9 Q10):** đột biến J5 ở `apps/desktop/src/data/app-data.ts` còn sống ở cả hai lượt, nhưng gần tương đương ở React 19 (lượt 1 đã đề xuất "không cần sửa, hoặc đổi comment"). Không thêm test; comment `app-data.ts:394-396` sửa cho khớp điều test kiểm ở #656 (T-252).

---

# Phần 2 — Quyết định Owner còn hiệu lực (hành vi có chủ ý, không phải lỗi)

K1–K17: `plan.md` §5; K18–K21: §L2.5; K22–K29: §L3.5; K30–K40: §L4.5. Giữ nguyên chữ, trừ K12, K13, K14, K17 ghi theo chữ đã sửa ở §L4.5 (K14 như §L3.5) vì chữ cũ trái với quyết định sau, và K21 có ngoặc "(Q6 lượt 1; đợt G5 lượt 2: K28; đợt G5 lượt 3: K31)" sau vế V1 / `LAW_NAME` (§L4.5).

| # | Quyết định | Nguồn |
|---|---|---|
| K1 | Dữ liệu là giả lập: siết luật thì áp ở lệnh + nhập backup, Owner nạp lại; không migration / cảnh báo / UI cho dữ liệu cũ sai. Schema AI đổi thì nạp lại; `db` chỉ import module schema của `@p2c/ai` | R2-02, #402, `CLAUDE.md` |
| K2 | HĐ / cuộc gặp Đã gặp mang ngày hoặc nhóm trước ngày tạo KH là nhập bù hợp lệ | DR-43 (ACCEPTED) |
| K3 | Trần 100 tỷ đồng mỗi số tiền (lệnh + nhập backup); ô tiền nhận "VNĐ", "1tr5", "1 tỷ 2", nhóm nghìn bằng dấu cách | Owner 06/10 |
| K4 | Bảng lớn dùng "Hiện thêm" (100 dòng), không ảo hóa | DR-03, Owner 06/10 |
| K5 | Người phối hợp chỉ TL / IS / BD / BDM; người đánh giá chỉ IS / TL / BDM / BD | ADR-0007, DR-47, D9 |
| K6 | "Lịch hẹn lần n" chỉ đánh số lịch đã gặp; lịch Dời lịch không có nút xóa | DR-67, #171 |
| K7 | Một yêu cầu AI tại một thời điểm; Hủy giữ khóa tới khi Rust xong (≤ 120 s); lỗi key / mạng không tự chuyển Mock | spec Phase 5 §5.2, D-1 |
| K8 | Key chỉ ở Credential Manager, kiểu lưu `Local`; Rust chặn cả dạng escape JSON / URL-encode của key | DR5-25, R2-10 |
| K9 | Gói Go hết hạn: Owner gia hạn, không xử lý / không mã HTTP riêng; rủi ro chính sách gói Go đã chấp nhận | #408, ADR-0009 W-1 mục 7 |
| K10 | Xác nhận lại cùng giá trị giữ phân tích CURRENT, panel ánh xạ mã F cũ; "Nạp lại" giữ Cài đặt → AI; phiên ChatGPT web chờ dán thì nút AI trích xuất của KH đó tắt; nút AI tắt vì bận nơi khác có dòng giải thích | Owner 10/10 (tổng hợp Phase 5 §8) |
| K11 | G5: chặn loại sản phẩm bảo hiểm; không chặn tên ngân hàng / quỹ / mã chứng khoán; nhãn tính cách cho phép trong `personalityNotes`. Không thêm đợt G5 cho chất lượng output E16 / E17 (không vi phạm) | G5 07/10, eval 11/10 |
| K12 | Ra khỏi v1.0: `Project-2C-data`, S-1 (định dạng snapshot mỗi bảng một file, D-2), gộp backup / xung đột; làm trên hai máy là "bản nhập sau thắng", không cảnh báo khi nhập. Kiểm `kyc_versions.hash` khi nhập backup đã làm ở T-291 (luật nhập 7, K33): dòng sổ "S-1 / D-1" (probe Codex Sol 02/10) đã RESOLVED. Bỏ vế "`kyc_versions.hash` khi nhập snapshot — dòng OPEN" của chữ cũ | spec §4, Owner 11/10; sửa theo K33, T-291 (`plan.md` §L4.5) |
| K13 | S-2: khóa mọi lệnh ghi trong lúc thay dữ liệu; xuất không vào hàng đợi; đóng app trong lúc thay (Nạp lại, Nhập backup, Dọn sạch) chờ lần thay xong và dữ liệu mới lưu xong rồi mới đóng (S2-1…S2-6). Bỏ vế "đóng app không chờ" duyệt 11/10 | spec §4.1 (G2); sửa theo K35, S2-6 sửa 25/10 (`plan.md` §L4.5) |
| K14 | Thùng rác: không khôi phục dây chuyền, không tự dọn (chỉ dọn tay mọi bản ghi theo K27, không xóa từng dòng), không theo góc nhìn, luôn hỏi trước khi khôi phục (TR-1…TR-13). Bỏ vế "không xóa vĩnh viễn" duyệt 11/10 (spec §4.2 TR-6) | spec §4.2 (G2 / G3); sửa theo K27, TR-6 mới (`plan.md` §L3.5; §L4.5 giữ như §L3.5) |
| K15 | Mở app lần đầu ≈ 3–4 s (gần hết là sinh seed demo, drizzle dựng câu SQL) là chấp nhận; ngưỡng là "không chậm hơn exe Phase 4 đo cùng cách, cùng máy"; không tối ưu seed ở v1.0 | #574, `phase-6.md` |
| K16 | Hướng dẫn sử dụng là Markdown + PNG trong repo, không có nút trong app, không PDF / HTML | spec §4.3 |
| K17 | Không phải phát hiện: PR vượt ngưỡng kích thước (ghi ở `docs/metrics/`); cách làm "chỉ Claude viết code" (ADR-0001), kể cả subagent / Workflow ở phiên gói Owner bật ultracode (M8–M10), và việc Codex, DeepSeek review chỉ đọc (M2, M10); mức `code-review` của `review-pr` (ADR-0017, phụ lục 21/10); việc dùng công cụ mới (G4) | ADR-0001 (M2, M8–M10), ADR-0017, spec §6.3; sửa theo M10 (`plan.md` §L4.5) |
| K18 | Khôi phục cuộc gặp Đã gặp **về như lúc xóa**: cuộc gặp giữ nhóm không ghi chuyển nhóm, không kiểm D10 (E18–E20 của TR-3). Một luật **"nhóm của KH tại ngày cuộc hẹn"** cho ghi / sửa / xóa / khôi phục cuộc gặp và chuyển tay lùi ngày, kèm luật nhập backup (K1: dữ liệu cũ nạp lại, hash `tables` của dữ liệu tải đã đổi) | Owner 15/10 Q1, Q2; spec Phase 6 §4.2, spec Phase 3 §4 |
| K19 | Bàn giao KH (5c) chuyển lịch **Dự kiến** sang RE mới trong cùng transaction; "Hẹn tiếp" (6h) và "Hẹn lần tiếp theo" (6c) lấy RE hiện tại của KH; lịch đã có kết quả và HĐ giữ RE cũ (ADR-0007) | Owner 15/10 Q3; spec Phase 3 §4 dòng `updateCustomerProfile` |
| K20 | Chữ: tên team / nhân sự / KH và giá trị KYC gộp mọi khoảng trắng Unicode thành một dấu cách, bỏ mọi `\p{Cf}`, từ chối UTF-16 hỏng; **ghi chú KYC giữ xuống dòng**, chỉ gộp trong từng dòng; giá trị liệt kê sai → `INVALID_CHOICE`; cùng một hàm ở lệnh, nhập backup và UI | Owner 16/10 (Issue #604) |
| K21 | Các đề xuất còn lại của §9 tổng hợp lượt 1: tiền KYC đọc lại khi `parseVnd` hiểu được, giữ chữ tự do khi không (Q4); NT-TQ-06 theo golden "100%" / "60%" (Q4); V1 / `LAW_NAME` sửa đúng chữ G5, không G5 mới (Q6 lượt 1; đợt G5 lượt 2: K28; đợt G5 lượt 3: K31); STALE mờ mà ≥ AA (Q7); case size chỉ của cuộc gặp Đã gặp gần nhất (Q8); hồ sơ 3 cột ở 1 440 (Q9); phiên bản 1.0.0 (Q12); điểm ghi "Lệch mockup đã biết" của `nghiem-thu-v1.md` (#619) | Owner 15/10; ngoặc sau vế V1 / `LAW_NAME` theo `plan.md` §L4.5 |
| K22 | Trước ngày tạo KH, "nhóm của ngày" = nhóm tạo KH: cuộc gặp Đã gặp giữ nhóm trước ngày tạo ghi / khôi phục / nhập được (DR-43, K2); đổi nhóm trước ngày tạo vẫn bị D10. E20 so **thứ tự ghi** (`seq`), không so mốc thời gian. Khôi phục chỉ đưa lại chuyển nhóm của chính KH đó | Owner 17/10 Q1 (a); spec Phase 3 §4; #652 → #666 |
| K23 | Nhận diện / che key: mọi tổ hợp tới **hai lớp** escape (JSON, URL), kể cả dạng trộn theo từng đoạn, ở `ai.rs` và script eval | Owner 17/10 Q2 (a) + Q9; #657 → #680 |
| K24 | `integrity_check` mỗi lần mở dữ liệu có file: chi phí ≈ +30–40 ms là có chủ ý. `project2c.db` chỉ đọc → từ chối mở (`ACCESS_DENIED`). Màn lỗi khởi động bảo đóng cửa sổ lỗi rồi mở lại | Owner 17/10 Q3 (a); #656 → #674 |
| K25 | K20 mở rộng: `normalizeText` gộp mọi Unicode White_Space (gồm U+0085), bỏ mọi `\p{Default_Ignorable_Code_Point}` và U+2800; lệnh, nhập backup, UI dùng cùng hàm; dữ liệu giả lập nạp lại (K1) | Owner 17/10 Q4; #659 → #686 |
| K26 | Hộp 9b đếm như lệnh (gồm lịch của KH trong Thùng rác) và nêu KH đã xóa; câu cho người hỗ trợ theo Q5 (a). Hộp 6f nêu hậu quả khi dời ngày làm rút một chuyển nhóm (Q6 a). Chữ Thùng rác: dòng cuộc gặp giữ nhóm ghi "nhóm sau N3 · không đổi nhóm KH"; có câu chặn riêng khi ngày đổi nhóm trùng ngày cuộc hẹn (Q7 a, spec TR-3 / E20) | Owner 17/10 Q5–Q7 và câu thêm về xóa nhân sự; #653 → #667, #654 → #669 |
| K27 | **Dọn sạch Thùng rác** (TR-6 mới, TR-11–TR-13, D1–D13, mockup 11h–11j, phụ lục ADR-0008): không tự dọn; một nút dọn **mọi** bản ghi, không dọn từng dòng; hộp đếm theo loại, gõ DỌN SẠCH; chạy qua hàng đợi thay thế (chờ lưu, backup trước, chặn ghi); một transaction rồi `VACUUM` ngoài transaction; bản ghi còn được dùng thì giữ lại, kèm lý do trên dòng; câu nhắc từ 1 000 bản ghi; trigger chặn xóa của ghi chú KYC, dữ kiện, phân tích AI chỉ cho đi dòng của KH đã xóa mềm. Hộp 5f không còn nói ghi chú KYC không bao giờ xóa | Owner 17/10 Q8 (c); G1 / G2 / G3 19/10 (PR #707); #662 → #709, #710 |
| K28 | Đợt G5 lượt 2: `analysis@3`, `discovery@3` (`phase-5-prompts.md` §11): so khớp bỏ dấu theo từng chữ, ký tự vô hình ở V3–V6, chi tiết V1, trần chuỗi gốc, "kỉ" / "qui". Chữ prompt không đổi so với `@2` | Owner duyệt G5 18/10; #661 → #698 |
| K29 | J5 của DR6-60 được chấp nhận (đột biến gần tương đương ở React 19); comment `app-data.ts` sửa theo | Owner 17/10 Q10; #656 → #674 |
| K30 | Quyết định lượt 3 (21/10, mọi đề xuất). Q1 (a): khôi phục "R rồi X cùng ngày" giữ hành vi; chuyển nhóm được đưa lại giữ chỗ trong thứ tự ghi, khôi phục theo thứ tự đã ghi thì được, ngược lại bị chặn như E20 (TR-3). Q2 (a): `normalizeText` bỏ cả `\p{Cc}` không phải White_Space, mở rộng K25. Q3 (a): câu Thùng rác của 9b chỉ sửa chữ (dọn sạch trước, rồi phạm vi của vế khôi phục); `personUsage` không đổi. Q5 (a): CL3-C7 giữ K1 + R2-02. Q6 (a): bấm "Backup rồi dọn sạch" → thông báo 11j ≤ 500 ms trên dữ liệu tải (exe), đo tay ở G7 | tổng hợp lượt 3 §9; #720, #721, #723 |
| K31 | Đợt G5 lượt 3 (Owner duyệt 23/10, "duyệt hết"; `phase-5-prompts.md` §12): `analysis@4`, `discovery@4`, giữ `extraction@1`, `web@1`. Ở dạng tách dấu, dấu không đứng sau nguyên âm đọc như một dấu cách. Nhận diện tin nhắn của app tách dòng ở CR, LF, U+0085, U+2028, U+2029 (VT, FF từ §13.4, K33). Danh sách đóng "ấm", "lạnh", "nội", "ít" chỉ khớp dạng không dấu khi cả cụm không dấu. V6 miễn "giới", và miễn "định" trừ khi đứng sau "quy" / "qui". Việc không làm: §12.8 | #728 → #762, #766 |
| K32 | Sổ ghi chú (Owner 23/10): sửa hết mục OPEN trước v1.0; 12 mục "Owner chọn không sửa" 15/10 giữ; khoảng chờ nghiệm thu lượt L1 ghi là lệch chấp nhận (`nghiem-thu-v1.md`). Cổng duyệt cùng kế hoạch: G2 / G5 cho bảy luật T-291 và luật T-290 (chữ vào spec qua PR docs trước PR code); G4 cho một lần gọi OpenCode thật (T-290) và **không** thêm thư viện test component (T-300); G6 cho quyền đặt tiêu đề cửa sổ (T-293); G3 gom ở T-284 (thêm T-303 ngày 24/10) | `PROJECT-STATE.md` 23/10; #769–#771, #791 |
| K33 | Bảy luật T-291 (G2 / G5 23/10; chữ ở PR #824): (1) nhập backup tính lại hash phiên bản KYC mới nhất của mỗi KH, sai thì từ chối; Owner 25/10 thêm luật dạng hash của mọi phiên bản (spec Phase 3 §6 luật 7); (2) chỉ nhận `output_json` đúng dạng app ghi; (3) dòng REJECTED có output trên 20 000 ký tự thì không lưu output, panel báo "output quá lớn"; (4) chữ tùy chọn của lịch hẹn chỉ có ký tự vô hình là rỗng; (5) gõ ngày nhanh đầu năm: ngày đó năm nay chưa tới mà năm trước mới qua không quá 60 ngày thì gợi ý năm trước, app không tự đổi năm (ADR-0007 phụ lục); (6) sắp tên đổi chữ số toàn khổ / Ả Rập về chữ số thường trước khi so; (7) VT / FF trong ghi chú tính là xuống dòng. Version prompt không đổi. Dữ liệu cũ sai: K1 | #780 → #824, #828 |
| K34 | Trả lời AI bị cắt (G5 23/10, spec Phase 5 §6.1): sau một `{` của lời văn (ký tự sau nó không phải `"`) mà còn một khối JSON đủ thì dùng khối đó; `{` mà ngay sau là `"` tính là mở object, khối trong nó không lấy. Loại ca lời văn có `{` không đóng rồi `"{}"` trong nháy: ACCEPTED (Owner 25/10, review #828) | #779 → #820, #822 |
| K35 | Trạng thái lưu (Owner 25/10, T-294). Một nguồn trạng thái lưu. Chỉ báo 10d ở chân sidebar: "Đã lưu HH:MM", "Đang lưu…", "Chưa lưu được vào file"; mở app chưa lưu gì trong phiên thì "Đã lưu", không giờ. Nút Thử lại trên dải lưu lỗi chỉ ghi lại bản đang có. Câu từ chối D7 của Nạp lại / Nhập backup / Dọn sạch thêm vế bấm "Thử lại". Đóng app chờ lần thay đang chạy (S2-6 sửa 25/10, K13). Hai điểm mockup không vẽ, Owner giữ như mockup: ACCEPTED (review #817) | #783 → #817, #819; spec Phase 6 §4.1 |
| K36 | G3 (Owner 23/10, T-284; 24/10, T-303). Token `--border-control` #687890 cho viền ô nhập, ô ngày Tùy chọn và mũi tên sắp xếp chưa chọn (≥ 3:1, chỉ theme tối). Ô khóa giữ viền đứt `--border-strong`: WCAG 1.4.11 không đòi 3:1 cho thành phần không thao tác được. Hộp 8d có dòng số HĐ khi dời tháng. Khối "Thông tin tham khảo" mờ (2h): khung viền liền, thẻ trong viền đứt. Dòng help 1a / 4a khớp `AI_MODELS` | #773 → #795; #797 → #811; `docs/design/mockups/README.md` |
| K37 | G6 (Owner 23/10, T-293): `capabilities/default.json` thêm đúng một quyền `core:window:allow-set-title`, để `AppShell` đặt tiêu đề cửa sổ theo màn ("<Màn> · Heritas L-CRM" từ T-308) | #782 → #807 |
| K38 | `zod/mini` thay `zod` đầy đủ (DR6-25): cùng gói `zod` của ADR-0005, không thêm dependency; chữ lỗi mặc định chỉ còn "Invalid input" vì không `detail` V1 nào dùng chữ mặc định. Luật lint chặn import `zod` đầy đủ (T-304); lỗ tên viết hoa `Zod` / `ZOD`: ACCEPTED (Owner 25/10, review #837) | #781 → #830; #831 → #837 |
| K39 | Tên v1.0 (Owner 26–27/10, ADR-0013 phụ lục 27/10): app hiện là **Heritas L-CRM**, slogan "Where legacy meets trust". Chỉ đổi phần nhìn thấy: khối logo ở góc sidebar, icon exe / taskbar / tab, tiêu đề cửa sổ, `productName`, `<title>`, `description` của `Cargo.toml`. Tên mã Project-2C giữ ở mọi chỗ khác: repo, `gh`, `@p2c/*`, `project2c.exe`, `Project2C-data\`, `project2c.db`, tên / đuôi / định dạng backup (`BACKUP_FORMAT`), câu báo lỗi (bốn câu có chữ "Project-2C"), `KEY_SERVICE`, `identifier`. Logo cách (c) (G3); font Playfair Display nghiêng 400, bộ Latin, đóng gói cục bộ, OFL (G4) | #852 → #861; `PROJECT-STATE.md` 26–27/10 |
| K40 | Sổ ghi chú trước lượt 4 (Owner 27/10, B2): lượt 4 chỉ chạy khi mọi mục OPEN của sổ đã sửa, kể cả mục [G7]. Quyết định này thay quyết định trước đó cùng ngày: "mục [G7] làm sau khi xong mọi task". Ghi chú không chặn mới của review các PR sửa cũng sửa trước khi ghim SHA | `PROJECT-STATE.md` 26–27/10 |

---

# Phần 3 — "Lệch mockup đã biết" của `docs/testing/nghiem-thu-v1.md` ở `2e51e25` (nguyên văn)


Không mở Issue mới cho các điểm dưới (đã ghi ở `docs/state/review-notes.md`, đã được mockup sau thay, hoặc Owner chọn không sửa).

- **Mockup vòng 2 được mockup sau thay:** trạng thái "Hoãn" của `appointments.html` / `table-more.html` nay là "Dời lịch"; lịch tháng 3 màu thành 4 nhóm (`overview.html` §2); bộ chọn góc nhìn thay cây Team → RE ở cột trái và khối tóm tắt tháng / trigger / chuyển nhóm của `appointments.html` (sổ review, mục Lịch hẹn #156 / #158).
- **Hộp 6h:** dưới ô Khách hàng vẫn có dòng "Lần gặp thứ n · lần trước dd/mm/yyyy"; mockup 6h không có dòng này (T-298 chỉ bỏ khối "Các lần hẹn trước").
- **Ô Case size dự kiến (6c, 6d, 6f):** câu help "Dấu phẩy hay dấu chấm theo sau đúng 3 chữ số là dấu ngăn nghìn …" là câu tĩnh nên hiện ở cả ba hộp; mockup chỉ vẽ ở 6d (T-298).
- **Khách hàng, thẻ KH ở Kanban (`customers.html`):** app ghi "n HĐ" màu HĐ đã phát hành, n đếm mọi HĐ đã nộp, phát hành hay chưa. Mockup vẽ KH chỉ có HĐ nộp là "1 HĐ nộp", màu HĐ đã nộp (`pol-submitted`) (rà sổ 26/10/2026, T-306).
- **Hồ sơ KH, thẻ Lịch hẹn:** cột Kết quả rộng 120 px, mockup 92 px, để ở 1 440 mọi kết quả nằm một dòng (dài nhất là "Chưa ghi kết quả"); chỉ chuyển giữa hai nhóm đóng ("Tạm hoãn → Mất cơ hội") xuống hai dòng (Owner 26/10/2026). Cột Ngày 84 px như mockup, "Hẹn tiếp" 56 px (mockup 58 px); Ghi chú lấy phần còn lại nên hẹp hơn mockup. Mọi trạng thái là chữ màu, mockup vẽ badge `.badge.plain`. "Chưa ghi kết quả" cũng là chữ, không phải badge như ở các danh sách: badge không xuống dòng và rộng hơn cột (T-298).
- **Hồ sơ KH, Dòng thời gian (`customer.html`):** mục v1 của mockup "KYC lần đầu · N4 → N3" gộp chuyển nhóm vào mục KYC; app ghi mục đó như mọi lần cập nhật ("Cập nhật KYC dd/mm/yyyy"), chuyển nhóm là một mục riêng. App không có mã ghi chú ("N-0914:" trước chữ ghi chú). Nút **AI trích xuất** đứng ngay sau tiêu đề mục, xuống dòng khi tiêu đề có nhãn "thay đổi quan trọng" mà cột hẹp; mockup đặt nút bên phải (T-297, PR #835).
- **Hộp 8d (`policy-forms.html`):** khung "Ảnh hưởng chỉ số" không in đậm số tiền của dòng FYP và "−1" / "+1" của dòng số HĐ; mockup in đậm (8d, "8d dời tháng") (T-296, PR #833).
- **Team (`team.html`):** đầu màn, danh sách team, "Người hỗ trợ", bảng chỉ có RE theo `phase-3-feedback.html` B1 (mockup sau thay).
- **Hộp 10c (`settings-data.html`):** ngày neo không in đậm. Câu backup là đoạn chữ thường chỉ nêu thư mục `Project2C-data\backups\`, không phải khung "alert info" có tên file như mockup: app chưa biết tên file trước khi backup (T-295, PR #825).
- **Lưu lỗi và trạng thái lưu (`settings-data.html` 10d, `trash.html` 11j):** lưu lỗi hiện bằng dải ngang ở đầu cột nội dung, câu theo nguyên nhân (file bị giữ, ổ đầy, file chỉ đọc, thư mục cấm tạo file) kèm nút **Thử lại**, thay cho thông báo ở góc trên phải có tiêu đề và câu chung của mockup. Mở app, chưa lưu gì trong phiên: chân sidebar ghi "Đã lưu" không có giờ (NT-DB-21); mockup chỉ có "Đã lưu HH:MM". Câu D7 của 11j thêm vế "Bấm "Thử lại" ở dải cảnh báo đầu màn, lưu được rồi thì dọn lại." (T-294, PR #817).

**Owner chọn không sửa** (15/10/2026, deep review Phase 1–6 lượt 1, `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §8.4, §9 Q4):

- **Hồ sơ KH (`customer.html`), thẻ Lịch hẹn:** không có ô chọn "Kỳ Tất cả ▾"; thẻ luôn hiện mọi lịch của KH (NT-HS-12) (DR6-29).
- **Hộp 5c Sửa KH:** chú thích ô Ngày sinh không ghi giá trị cũ ("trước: 1984"), giữ "năm hoặc đủ ngày" (DR6-36).
- **Hộp 7c, "Đánh dấu mâu thuẫn" ở trường cốt lõi:** không có khung cảnh báo trước rằng cổng sẽ thành `CONFLICT_RESOLUTION` (nút Phân tích tắt); hậu quả chỉ hiện sau khi lưu ("Có mâu thuẫn ở trường cốt lõi: cần làm rõ trước khi phân tích.") (DR6-36).
- **Hộp 7a:** dữ kiện đã thêm chỉ ghi tên trường, không có nhãn hạng mục + "cốt lõi" (DR6-36).
- **Nút tạo KH:** `customers.html` ghi "+ Khách hàng", `phase-3-feedback.html` B2 ghi "+ KH mới" (hai mockup tự lệch); app theo `customers.html` (NT-KH-01) (DR6-36).
- **Hộp 6c Kết quả cuộc gặp:** dòng dưới tiêu đề không có "· lần n" ("… 10:00 · lần 3 · hiện N2" trong mockup); NT-LH-21 ghi theo app (DR6-48).
- **Tổng quan 1a, 1c, ô Lịch hẹn:** nhóm ghi "Dời lịch / hủy / không đến", mockup ghi "Dời – hủy – không đến" (NT-TQ-04 ghi theo app) (DR6-48).
- **Tổng quan, ô Tỉ lệ chốt:** app luôn ghi đủ "a HĐ phát hành ÷ b RF"; mockup tự lệch: 1a dạng đủ ("7 HĐ phát hành ÷ 16 RF"), 1c, 1e dạng gọn ("6 ÷ 14 RF", "2 ÷ 3 RF") (DR6-48).
- **Tổng quan 1a, cách viết tỉ lệ chốt:** tỉ lệ tròn ghi "60%", "100%", "0%" theo golden `chi-so.md`; bảng So sánh team của mockup 1a ghi "60,0%", "100,0%", "0,0%". Không tròn vẫn một chữ số ("66,7%"). File Excel luôn một chữ số (`0.0%`) (NT-TQ-06, DR6-47).
- **Báo cáo 2b, 2c:** dòng meta cạnh tiêu đề bảng ghi "n RE · thứ tự theo team rồi tên" / "n mốc" (NT-BC-05, 06), mockup ghi "30 RE · Tháng 10/2026 (MTD) · Toàn bộ" / "5 mốc · Tháng 10/2026 (MTD) · Toàn bộ" (kỳ và góc nhìn đã có ở dòng "Đang xem") (DR6-48).
- **Cài đặt → Dữ liệu, thẻ File dữ liệu:** dòng Nội dung không có số ghi chú KYC ("· 3.470 ghi chú KYC" trong mockup); mockup tự lệch với hộp 10a cùng file (5 mục, như app) (NT-CD-02) (DR6-48).
- **Lịch hẹn B4 (4b, 4c, 4d), lịch tháng:** chú giải dưới lịch không có mẫu "Trong kỳ" cho dải tô của kỳ Tuần / Tùy chọn; chỉ có 4 nhóm lịch (NT-LH-07, 08) (DR6-48).

**Owner chọn ghi là lệch chấp nhận** (23/10/2026, thay câu hỏi để lại cho lượt L1; `docs/PROJECT-STATE.md`):

- **Danh sách KH (`customers.html`, vòng 2):** ô tìm "Ctrl K", bộ lọc Phạm vi / RE / KYC / "Đã có HĐ", hàng kỳ, ô Sắp xếp, dòng "Độ phủ KYC", nhãn KYC / AI và ngày hẹn trên thẻ, dòng "+n vào · lên N3 trong tháng" dưới đầu cột, lý do đóng ở khung Tạm hoãn / Mất cơ hội: app và hướng dẫn sử dụng không có các phần này.
- **Cài đặt (`settings-data.html`):** khung trái Cài đặt không có mục "Chung"; trang lỗi khởi động 10d không có hai nút "Mở từ backup tự động mới nhất" / "Mở thư mục" (app ghi cách chép bản backup bằng chữ).

---

# Phần 4 — Bảng R1 và KNOWN theo mã (`plan.md` §L4.5 phần 4, nguyên văn)

**4. Bảng R1** (dưới): 35 DR6 và 2 mục KNOWN đã sửa vào bảng R1 của gói kiểm (§L4.4), không báo lại thành phát hiện. Ngoài bảng:

- **Các DR6 khác** (DR6-01…103, đã sửa ở lượt 1–3, trừ các mục KNOWN dưới): không báo lại. Phần sửa hỏng lại → phát hiện mới, "Liên quan: DR6-xx". DR6-69 kiểm qua DR6-105.
- **KNOWN, chỉ nêu khi có bằng chứng mới** (hậu quả nặng hơn, đường vào mới):
  - DR6-53 (chấp nhận);
  - J5 của DR6-60 (K29);
  - CL3-C7 (K1, R2-02; Q5 a);
  - Claude F K2 của lượt 3: bản xuất của dữ liệu tải code lượt 1 không qua luật nhập 4 mới (K1).

Mức: L = Low, N = Nit (mức chốt ở tổng hợp lượt 3 §6, §8.4 và tổng hợp lượt 1). "Gói kiểm": gói ghi dòng R1; gói đầu là gói chính. Mô tả đầy đủ ở tổng hợp lượt 3 §6, §8.4 (DR6-104…134, CL3-A29, CL3-B2) và tổng hợp lượt 1 §3–§5 (DR6-25, 37, 66, 67). Cột "Issue → PR" kể cả PR sau chạm cùng vấn đề (trong ngoặc).

| Mã | Mức | Vấn đề (ngắn) | Issue → PR | Gói kiểm |
|---|---|---|---|---|
| DR6-104 | L | Khôi phục cuộc gặp đã rút chuyển nhóm đi đường E7 khi KH tới nhóm sau cuộc gặp vào ngày sau ngày cuộc hẹn | #720 → #740 (+ TR-3 #850 → #857) | A |
| DR6-105 | L | Luật nhập nhận mốc mọi độ chính xác mà code so chữ (`transitionWithdrawnAt`, thứ tự Thùng rác); phần còn của DR6-69 | #720 → #740 (+ #781 → #830) | A |
| DR6-106 | N | "Xóa R, ghi X cùng ngày, xóa X, khôi phục R rồi X" (Q1 a: câu TR-3, test hai thứ tự) | #720 → #740 | A |
| DR6-107 | L | Nhập backup nhận chuỗi bắt đầu bằng U+FEFF | #721 → #738 | A |
| DR6-108 | L | `raw_output` nhận nửa surrogate lẻ | #721 → #738 | A, C |
| DR6-109 | L | Hộp 5a / 5c / 7a gửi lệnh chữ đã chuẩn hóa | #721 → #738 | D |
| DR6-110 | L | `parseVnd` / `parseQuickDate` đọc chữ gốc | #721 → #738 | A, D, E |
| DR6-111 | L | Ký tự điều khiển C0 / C1 (Q2 a) | #721 → #738 (+ G5 §7 #728 → #762) | A, C |
| DR6-112 | N | `byName` coi tên khác nhau là bằng | #721 → #738 (+ luật 6 #780 → #828) | A |
| DR6-113 | L | `INSERT OR REPLACE` lách trigger chỉ thêm | #722 → #742 (+ #776 → #805) | A |
| DR6-114 | N | Cột trỏ tới nhân sự liệt kê bốn nơi; nhánh người đánh giá không thể xảy ra | #722 → #742, #776 → #805 | A |
| DR6-115 | L | Câu Thùng rác của 9b (Q3 a) | #723 → #744 (+ #788 → #841) | D |
| DR6-116 | L | Màn Team & nhân sự không có đích focus dự phòng | #723 → #744 (+ #788 → #841) | D |
| DR6-117 | L | Chuỗi liền dài tràn: thẻ Lịch hẹn, 7a / 7c / 7d, tên KH | #724 → #746 | D |
| DR6-118 | L | Panel KYC Intelligence, khối AI của chi tiết lịch hẹn tràn khung | #724 → #746 | C |
| DR6-119 | N | Tên nút trùng cho trình đọc màn hình (HĐ, Thùng rác) | #725 → #748 (+ #785 → #833) | E |
| DR6-120 | L | Lưu lỗi `PermissionDenied` không do chương trình khác (ACL, chỉ đọc giữa phiên) | #726 → #750, #752 → #764 (+ #782 → #807, #783 → #817) | B, D |
| DR6-121 | L | Mock trích xuất đề xuất sai ở sáu dạng câu | #727 → #753, #778 → #809, #777 → #812 | C |
| DR6-122 | L | Dấu viết rời giữa hai chữ lọt V3–V6 (G5) | #728 → #762, #766 | C |
| DR6-123 | L | Nhận diện tin nhắn của app tách dòng chỉ ở CR / LF (G5) | #728 → #762, #766 | C |
| DR6-124 | N | V3–V6 chặn nhầm câu thường (G5) | #728 → #762, #766 | C |
| DR6-125 | L | Test hở của lệnh Dọn sạch (tập giữ lại, D3, D11, đếm ghi chú SYSTEM) | #722 → #742 | A |
| DR6-126 | L | Test hở còn lại của gói A (a–f) | #720 → #740 (a, b, d), #721 → #738 (e, f), #722 → #742 (c) | A |
| DR6-127 | L | `wrap-anywhere` của dòng cuộc gặp ở Dòng thời gian không test nào giữ | #724 → #746 | D |
| DR6-128 | L | Test hở gói E: màn Dọn sạch; chỗ nối 6f ↔ `editedDay` | #725 → #748 | E |
| DR6-129 | L | Bộ e2e không ghim đồng hồ | #719 → #736 (+ #772 → #792, #793 → #815) | F |
| DR6-130 | N | Test hở của `notes-core` | #719 → #736 | F |
| DR6-131 | N | Mockup 6d và NT-LH-25 ghi "1,234 tr → 1.234.000 ₫" | #729 → #755 (+ #756 → #758) | E |
| DR6-132 | N | Tài liệu / chú thích chưa theo Dọn sạch; `packages/db/CLAUDE.md` về trigger đọc `customers` | #729 → #755 (a), #722 → #742 (b) (+ #756 → #758) | D, A |
| DR6-133 | N | `06-ai.md` lấy ví dụ chip prompt cũ | #729 → #755 (+ `@4`: #728 → #766) | C |
| DR6-134 | N | Luật DR-43 viết ba nơi | #720 → #740 (+ #775 → #804) | A, E |
| DR6-25 | L | `zod` bản đầy đủ ≈ 10 % `index.js` (lượt 1, hoãn) | #781 → #830 (+ #831 → #837) | C, A, F (bundle) |
| DR6-37 | N | Dấu nối / ký hiệu viết cứng trong JSX (lượt 1, hoãn) | #655 → #693 (một phần), #790 → #845 | D, E |
| DR6-66 | N | Export / hàm chỉ test dùng (lượt 1, hoãn) | #655 → #693 (một phần), #775 → #801, #777 → #812, #790 → #845 | F, A, C, D, E |
| DR6-67 | N | Code lặp ≥ 3 nơi (lượt 1, hoãn) | #774 → #799, #775 → #801, #777 → #812, #782 → #807, #790 → #845 | F, A, B, C, D, E |
| CL3-A29 | N | `KEPT_APPOINTMENTS` quét cả bảng `appointments` mỗi lần `listTrash` (KNOWN #709, bằng chứng mới lượt 3) | #722 → #742 (một phần: bỏ CTE khi không có lịch đã xóa), #776 → #805 (chỉ mục `0012`) | A, F (đo) |
| CL3-B2 | N | Sau một lần lưu lỗi, Nạp lại / Nhập backup / Dọn sạch bị từ chối mà không có cách thử lưu lại (KNOWN #96, đường vào Dọn sạch) | #783 → #817 (nút Thử lại) | B, D, E |

Đếm: 35 DR6 (22 L · 13 N; 31 của lượt 3 và 4 của lượt 1) và 2 mục KNOWN đã sửa = 37 dòng.

---

# Phần 5 — Bảng R2 theo Issue (`plan.md` §L4.5 phần 5, thêm dòng ở bước chuẩn bị)

**5. Bảng R2** (dưới): mỗi Issue một dòng. Mục tiêu, test chấp nhận và ghi chú sổ đã gom (mục RESOLVED) ở `common\fixes.md`.

| Issue | Việc (theo tên Issue) | PR | Gói kiểm |
|---|---|---|---|
| #735 T-280 | Thanh trên cùng không che phần tử nhận focus (WCAG 2.4.11) | #760 | D |
| #772 T-283 | e2e / `tools`: helper dùng chung, đồng hồ / múi giờ, luật import, `pr-status` | #792 | F |
| #773 T-284 | G3: mockup và token cho bốn chỗ đổi hình thức | #795 | D, E |
| #774 T-285 | Hàm dùng chung vào `domain`, API `nextKycVersion` | #799 | A |
| #775 T-286 | `db`: gộp hàm lặp, bỏ hàm chỉ test dùng | #801, #804 | A |
| #776 T-287 | `db`: tham chiếu nhân sự, Thùng rác / Dọn sạch, đếm RF, seed và test | #805 | A, D, F (đo) |
| #777 T-288 | `ai`: hằng dùng chung với `db`, `retry.ts`, phạm vi export, version prompt trong test | #812 | C, A |
| #778 T-289 | Mock trích xuất: đề xuất sai còn lại của review #753 | #809 | C |
| #779 T-290 | `ai`: cụm khớp trong `detail`, trích JSON khi bị cắt, ngưỡng test, message assistant rỗng | #820, #822 | C |
| #780 T-291 | Bảy luật duyệt 23/10 | #824, #828 | A, C, D, E |
| #781 T-292 | `zod/mini` thay `zod` đầy đủ | #830 | C, A, F (bundle) |
| #782 T-293 | Rust: `storage.rs`, `backups\` không đọc được, test `ai.rs`, tiêu đề cửa sổ theo màn | #807 | B, D |
| #783 T-294 | Trạng thái lưu: chỉ báo 10d, nút Thử lại, đóng app khi đang lưu | #817, #819 | B, D |
| #784 T-295 | Cài đặt → Dữ liệu và mở file: số liệu 10c, kiểm file trước migrate, thông báo, ChatGPT web | #825 | B, E, C |
| #785 T-296 | Thùng rác và HĐ: hộp xác nhận dùng chung, tên nút theo ô, trạng thái HĐ, câu E20, hộp 8d | #833 | E |
| #786 T-297 | KYC và AI: dòng thời gian theo mockup, lỗi AI giữ khi đổi màn, hộp 3f, Cài đặt → AI | #835 | D, C |
| #787 T-298 | Hồ sơ KH và Lịch hẹn: 5d, 6a / 6h, 6d, thẻ Lịch hẹn, ô ngoài tháng, focus khung Chi tiết | #838 | D, E |
| #788 T-299 | Team, Báo cáo, Tổng quan: hộp nhân sự, bảng thành viên, bảng số cho chart N4–N1, bộ chọn kỳ | #841 | D, E |
| #789 T-300 | `packages/ui` và vỏ: token tương phản, `DataTable`, token-guard, ngưỡng nhánh, favicon, thanh trên cùng | #843 | D, F |
| #790 T-301 | Dọn app: mã chết, hằng lặp, ký hiệu viết cứng | #845, #846 | D, E, F |
| #793 T-302 | Luật lint `import()` động của `@playwright/test`; `docsRead` | #815 | F |
| #797 T-303 | G3: mockup ô khóa, câu ngoài phạm vi của token viền | #811 | D |
| #831 T-304 | Luật lint chặn `zod` đầy đủ; mặc định của schema AI | #837 | F, C |
| #849 T-305 | `classes.ts` (`HEADING`, `BADGE`), `recordBadge`, `WEB_MODE.tone`, đồng hồ bộ chụp ảnh | #855 | D, E, F |
| #850 T-306 | Tài liệu: spec Phase 6, nghiệm thu, hướng dẫn | #857 | B, E |
| #851 T-307 | Số đo Phase 6: bảng PR vượt ngưỡng, `integrity_check` theo MB | #859 | F |
| #852 T-308 | Tên Heritas L-CRM: khối logo, font slogan, icon, tiêu đề | #861 | D, B |
| #865 T-310 | Mục sổ phần code trước lượt 4: HEADING còn sót, stageBadge, lang của slogan, tên app một nguồn, ảnh logo, PACKAGES | #871 | D, E, F, B |
| #866 T-311 | Mục sổ phần tài liệu trước lượt 4: luật đếm phase-6.md, đối chiếu .brand, K21 / K31, dòng R1 CL3-A29, chữ 3 lượt | #870 | F, D |
| #867 T-312 | Chụp lại toàn bộ ảnh hướng dẫn với logo mới, trước lượt 4 | #882 | F |
| #876 T-314 | Mục sổ [G7] trước lượt 4: dot2.mjs clean / remove, phiên thử, bảng yêu cầu, số dư DeepSeek, ca e2e Cài đặt; chỉ phần e2e (`e2e/customer-ai.spec.ts`), phần kế hoạch là quy trình | #878 | F |
| #884 T-316 | Mục sổ trước lượt 4: rightOfSidebar không phụ thuộc độ cuộn; Memory sau phiên thử, ACL ở Full Access, dòng kept của dot2.mjs; chỉ phần e2e (`e2e/guide/shots.guide.ts`), phần kế hoạch là quy trình | #888 | F |

Đếm lúc soạn: 27 Issue (T-280, 22 của đợt sổ OPEN, T-305…T-308). Bước chuẩn bị thêm một dòng cho mỗi Issue của đợt sửa mục OPEN trước lượt 4 (đề xuất 8: T-310…T-312), gói kiểm theo file Issue đó sửa. Không có dòng R2: T-279 (quy trình, K17), T-281 (ở R1, DR6-120), T-282 (ở R1, DR6-131…133).

**Bước chuẩn bị (29/10/2026 00:22 +07:00, SHA ghim `2e51e25`):** đợt sửa mục OPEN trước lượt 4 có tám Issue, T-310…T-317 (#865, #866, #867, #868, #876, #880, #884, #889; sổ gắn lại nhãn ngày 28/10). Thêm năm dòng trên (T-310, T-311, T-312, T-314, T-316): PR của chúng sửa code, e2e hay tài liệu đối chiếu với app. Cột "Gói kiểm" theo `classifyFile` (`tools/size-report-core.mjs`) trên file của PR; dòng chỉ tài liệu (T-311: `phase-6.md`, `nghiem-thu-v1.md`; T-312: ảnh và `docs/user-guide`) theo gói của màn / số đo mà tài liệu tả, như T-306, T-307. Thân Issue, PR và nhóm RESOLVED của cả tám Issue ở `fixes.md`.

Đếm ở bước chuẩn bị: 32 Issue (T-280, 22 của đợt sổ OPEN, T-305…T-308, và năm của đợt sửa mục OPEN). Không có dòng R2 thêm: T-313 (#868), T-315 (#880), T-317 (#889) chỉ sửa quy trình (kế hoạch lượt 4, ADR-0001, `PROJECT-STATE.md`, `CLAUDE.md`, mục review của spec Phase 6), như T-279 (K17). Phần kế hoạch của T-314, T-316 cũng là quy trình.
