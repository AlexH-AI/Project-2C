# Spec Phase 6 — Hoàn thiện & phát hành v1.0 (G1)

- **Trạng thái:** Owner đã duyệt **G1** 11/10/2026 (#515). Spec chi tiết 6B (§4.1 S-2, §4.2 Thùng rác, §4.3 hướng dẫn sử dụng; mockup `trash.html`) Owner đã duyệt **G2 / G3** 11/10/2026 (#520); tách Issue theo §9.
- **Soạn:** 11/10/2026, sau G7 Phase 5 (`main` `3d6c7fc`). Nguồn: `PROJECT-PLAN.md` §5 dòng Phase 6, ADR-0010 (đồng bộ), comment Owner trên #72 (Thùng rác), D-2 / S-1 / S-2 ở `docs/reviews/2026-09-30-phase-1-3-tong-hop.md`, yêu cầu Owner 11/10 (kiểm thử toàn diện; 2 lượt deep review Phase 1–6 bằng 4 agent; phân tích bloat code và hiệu năng; gộp bớt số gói review; #491 sau khi duyệt spec; bỏ so sánh với Project-2; chưa làm `Project-2C-data` ở v1.0).

## 1. Mục tiêu và tiêu chí xong

Phase 6 đưa app tới **v1.0**: dùng được hằng ngày trên hai máy, dữ liệu không mất. Không còn so sánh với Project-2 (Owner quyết 11/10/2026, ADR-0002 Superseded): không có `docs/metrics/FINAL.md`, `docs/COMPARISON.md` hết hiệu lực.

Tiêu chí phát hành v1.0 (G7 cuối):

1. Milestone Phase 6 đóng hết Issue.
2. Kiểm thử phát hành (§5) đạt: kịch bản trọn vòng e2e xanh, danh sách nghiệm thu của Owner đạt, đo hiệu năng trên dữ liệu tải đạt ngưỡng §5.2, exe chạy được trên hai máy và trên một máy Windows sạch, nâng từ exe Phase 5 không mất dữ liệu.
3. Các lượt deep review Phase 1–6 (§6: hai lượt theo kế hoạch, thêm lượt 3 theo quyết định Owner 19/10/2026 và lượt 4 theo quyết định 26–27/10/2026) xong; mọi phát hiện từ Medium trở lên đã sửa, phần còn lại Owner đã quyết (sửa / hoãn sau v1.0 / chấp nhận).
4. `pnpm verify`, `pnpm verify:rust`, `pnpm e2e` xanh trên SHA phát hành; eval AI thật đạt ngưỡng spec Phase 5 §11 sau đợt G5.
5. Hướng dẫn sử dụng tiếng Việt có trong repo và trong bản phát hành.

## 2. Thứ tự

| Bước | Nội dung | Cổng |
|---|---|---|
| **6A** | Việc còn lại từ review Phase 5 (§3), bắt đầu bằng đợt G5 #491 **sau khi spec này qua G1** | G5 (#491) |
| **6B** | Tính năng còn lại (§4): S-2, Thùng rác, hướng dẫn sử dụng | G2 / G3 từng tính năng |
| **6C** | Kiểm thử phát hành (§5), gồm lệnh sinh dữ liệu tải và số đo nền hiệu năng / kích thước | — |
| **6D** | Deep review Phase 1–6, **4 lượt, 6 gói** (§6; lượt 1: 3 agent, 4 → 3 theo ADR-0001 M5, 13/10; lượt 2 còn 2 agent: M7, 17/10; lượt 3 Claude + Codex: M9, 19/10, phần Claude mỗi gói một phiên như lượt 2: Owner 20/10; lượt 4 Claude + Codex + DeepSeek, chạy khi sổ ghi chú OPEN rỗng: M10, 26–27/10); **phân tích bloat code và hiệu năng nằm trong lượt 1**; sửa sau mỗi lượt | Owner chọn việc sửa sau mỗi lượt |
| **6E** | G7: Owner nghiệm thu exe cuối, chỉ số Phase 6, phát hành v1.0 (§7) | **G7** |

6A và 6B có thể xen nhau (khác file). Phần tự động của 6C chạy lại sau mỗi đợt sửa của 6D.

**Vì sao phân tích bloat / hiệu năng không đứng riêng, trước hay sau review:**

- **Không để sau 6D:** refactor bỏ bloat và sửa hiệu năng đụng nhiều file. Làm sau lượt review cuối thì code phát hành là code chưa ai review lại, đúng lúc sát v1.0 (lệch nguyên tắc "review đúng SHA sẽ merge / phát hành").
- **Không cần đứng riêng trước 6D:** bốn agent đều phải đi qua hai trục bloat / hiệu năng ở lượt 1, Claude đi thêm một lượt riêng ở gói F (§6.2). Phân tích một mình trước rồi lại review cùng trục là làm hai lần.
- **Cách làm:** việc chuẩn bị đo (dữ liệu tải, số đo nền) làm sớm ở 6C vì kiểm thử phát hành cũng cần; phát hiện bloat / hiệu năng gộp vào bản tổng hợp lượt 1 và sửa trong đợt sửa lượt 1; **lượt 2 kiểm lại các refactor đó** (hành vi không đổi, số đo không xấu đi).

## 3. 6A — việc còn lại từ Phase 5

Đã có trong milestone Phase 6: #491 T-197 (đợt G5: chặn nhầm, so khớp, ví dụ prompt, R2-04; `gate`), #488 T-198 (script eval), #492 T-199 (`packages/ai` chịu đầu vào / đầu ra bất thường), #493 T-200 (khoảng trống test), #494 T-201 (gộp nhãn / kiểu trường / Mock), #509 T-205 (trợ năng AI), #510 T-206 (phạm vi docs-only của `pnpm verify`). Sau #491: chạy lại eval AI thật (Owner chạy, gói Go).

## 4. 6B — tính năng còn lại

Mỗi mục dưới đây có phần spec chi tiết riêng (thêm vào file này, §4.x) qua G2 / G3 trước khi tách Issue.

1. **S-2 — tuần tự hóa thay DB / lưu / xuất.** Một hàng đợi duy nhất cho mọi thao tác file (ghi muộn trong lúc chờ backup → thay DB #96; hai `replace` chồng nhau #192). Cần cho v1.0 dù chưa có đồng bộ, vì là lỗi chạy đua của thao tác hiện có.
2. **Thùng rác (#72).** Màn khôi phục bản ghi xóa mềm, gộp với nhóm quản lý dữ liệu ở Cài đặt; chốt một lần quy tắc khôi phục chéo (D10, người / KH đã xóa) ở G2; mockup G3.
3. **Hướng dẫn sử dụng tiếng Việt** (`docs/user-guide/`), theo từng màn, có ảnh chụp từ bản build; kèm vào bản phát hành.

**Ra khỏi v1.0 (Owner quyết 11/10/2026):** đồng bộ `Project-2C-data` (ADR-0010 phương án D). Dữ liệu v1 là dữ liệu giả lập; khi chuyển sang dữ liệu nhập liệu sẽ chọn phương án backup lên cloud phù hợp hơn (ADR mới khi đó). Kéo theo: **S-1** (snapshot mỗi bảng một file, D-2) và **gộp backup / phát hiện xung đột** giữa hai máy — cả hai chỉ phục vụ đồng bộ — cũng ra khỏi v1.0 và xét lại cùng phương án cloud. v1.0 chuyển dữ liệu giữa hai máy bằng xuất / nhập `.p2cbackup` như hiện nay.

Không thêm tính năng ngoài danh sách này trong Phase 6 (việc mới ghi sang sau v1.0).

### 4.1 S-2 — tuần tự hóa thay dữ liệu, lưu, xuất (G2)

**Hiện trạng** (`main` `69ed05d`). Phần Rust đã xong ở T-142 (#376): `db_open` / `db_save` / `db_backup` chạy lần lượt dưới một khóa, mỗi lần ghi một file `.tmp` riêng, ghi nguyên tử. Hộp "Đang nạp lại…" / "Đang nhập…" chặn được Escape (DR-58), F5 bị chặn trong exe. Còn lại ở JS (`apps/desktop/src/data/app-data.ts` `replace`, sổ review "S-2 phần JS"):

1. **Ghi muộn trong khoảng chờ backup (#96).** `replace` chờ hàng đợi lưu rảnh, gọi `db_backup`, mở DB mới rồi mới đổi. Trong khoảng đó DB cũ vẫn nhận lệnh ghi. Một lệnh ghi lọt vào sau lúc chép backup sẽ được lưu vào file, rồi bị dữ liệu mới ghi đè: thay đổi đó không có trong backup lẫn trong dữ liệu mới. Đường vào thật, không cần mẹo UI: **lần chạy AI kết thúc đúng lúc đó** (job chạy nền tới 2 × 120 s, `generation` chỉ đổi sau khi thay xong nên kết quả vẫn lưu vào DB cũ).
2. **Hai `replace` chồng nhau (#192).** Cả hai cùng backup, cùng đóng DB cũ (đóng hai lần), DB mới của lần đầu không bao giờ được đóng. UI hiện không mở được lần thứ hai (nút khóa, hộp chặn), nên đây là lá chắn.
3. **Cửa sổ `opening` chưa có test (#206):** trong lúc mở DB mới, cả hai DB đều lưu được.

**Luật (đề xuất G2):**

- **S2-1 Một hàng đợi cho thao tác thay dữ liệu.** Nạp lại và Nhập backup chạy lần lượt theo thứ tự gọi, không bao giờ chồng nhau. Lần sau bắt đầu khi lần trước đã xong hoặc đã lỗi.
- **S2-2 Khóa ghi trong lúc thay.** Từ lúc một lần thay bắt đầu (trước khi chờ lưu, trước backup) tới lúc thay xong hoặc lỗi, mọi lệnh ghi (`run`) bị **từ chối**, DB không đổi. Câu báo mới (i18n), hiện ở chỗ hộp / màn vẫn hiện lỗi lệnh: **"Đang thay toàn bộ dữ liệu (Nạp lại / Nhập backup). Thay đổi này chưa được ghi — thử lại khi xong."** Nhờ vậy backup luôn chứa mọi thay đổi trước lúc thay, và DB cũ không còn gì để lưu sau backup.
- **S2-3 Kết quả AI về trong lúc thay** bị bỏ như khi về sau lúc thay (`discarded`, panel không hiện gì, không báo lỗi), giống DR5-36.
- **S2-4 Thay lỗi** (lưu trước đó lỗi → từ chối như cũ; backup lỗi; mở DB mới lỗi): mở khóa ghi, DB cũ dùng và lưu tiếp như trước, `generation` không đổi.
- **S2-5 Xuất không vào hàng đợi.** Xuất backup / Xuất Excel đọc DB trong bộ nhớ một lần, đồng bộ (không có `await` giữa lúc đọc và lúc có bytes), rồi ghi vào `exports\` bằng tên mới, nguyên tử, không đụng `project2c.db`. Xuất trong lúc thay cho ra file đủ của dữ liệu cũ hoặc của dữ liệu mới, không lẫn. Chặn xuất không thêm gì về an toàn mà làm người dùng chờ tới ~7 s.
- **S2-6 Đóng app trong lúc thay** (Nạp lại, Nhập backup, Dọn sạch Thùng rác) chờ lần thay xong và dữ liệu mới lưu xong rồi mới đóng (lần thay bị từ chối thì chờ tới lúc từ chối); trong lúc chờ, chỉ báo lưu ở sidebar ghi "Đang lưu…" (mockup `settings-data.html` 10d). File sau đó là dữ liệu mới đủ (lần thay bị từ chối hay lỗi: dữ liệu cũ đủ). Owner 25/10/2026 (T-294, #783, sổ review #125) thay câu cũ "không phải chờ": khi đó đóng giữa lúc seed thì app đóng ngay, file còn dữ liệu cũ đủ và lần Nạp lại mất.

**G3:** không có màn mới. Câu báo S2-2 có mẫu ở mockup `trash.html` khối 11g.

**Test chấp nhận** (seam: `app-data.test.ts` với storage giả, tự quyết lúc nào từng promise xong):

- [ ] `run` trong lúc `replace` chờ `backup()` → lỗi khóa ghi, DB không đổi; bytes đã lưu trước khi gọi `backup()` chứa mọi thay đổi trước đó; DB cũ không gọi `save` lần nào sau `backup()`.
- [ ] Lần chạy AI (Mock giả lập chờ) kết thúc trong lúc thay → `discarded`, không lưu, `reportError` không được gọi (`ai-analysis.test.ts`).
- [ ] `backup()` lỗi / mở DB mới lỗi → `run` lại chạy được trên DB cũ và tới `save`; `generation` không đổi.
- [ ] Hai `replace` gọi liền nhau → chạy lần lượt, mỗi lần một backup; dữ liệu cuối là của lần sau; DB cũ và DB mới của lần đầu mỗi cái đóng đúng một lần; không lần nào báo lỗi.
- [ ] Cửa sổ `opening` (#206): lần lưu sau migration của DB mới tới `save`, DB cũ không lưu gì.
- [ ] `exportBackup()` gọi trong lúc thay → text đủ, đọc lại bằng `readBackup` được, số bản ghi bằng dữ liệu cũ hoặc mới.
- [ ] `flush()` (đóng app) ở từng bước của `replace` → chờ lần thay và lần lưu dữ liệu mới; bytes lưu cuối cùng là DB mới ở mọi bước, đọc lại được (S2-6).

**Ước lượng / rủi ro:** ≈ 80 dòng SP (`app-data.ts`, `ai-analysis.ts`, `vi.ts`) + ≈ 250 dòng test, `risk:high` (lối ghi dữ liệu). Không đổi Rust (không cần `build-exe`).

### 4.2 Thùng rác (#72) (G2 + G3)

**Hiện trạng.** Năm loại bản ghi xóa mềm (`deleted_at`): team, nhân sự, KH, lịch hẹn, HĐ. Ghi chú KYC / dữ kiện / phiên bản KYC, chuyển nhóm và phân tích AI không có Xóa (chuyển nhóm chỉ bị rút theo cuộc hẹn, D7). Tầng db đã có `restoreTeam`, `restorePerson`, `restoreCustomer`, `restoreAppointment`, `restorePolicy`, kiểm lại như lệnh tạo. UI chưa có đường khôi phục, dù các hộp xóa nói "khôi phục được". **Lệch mockup:** hộp **5f "Xóa KH"** đã duyệt G3 ở Phase 3 (`customer-forms.html`, nút "Xóa KH…" ở hộp Sửa KH) nhưng app chưa làm. Không có Thùng rác thì không ai thấy lỗ hổng này; làm kèm ở đây (TR-9).

**Luật khôi phục chéo (đề xuất G2, chốt một lần):**

- **TR-1 Không khôi phục dây chuyền, không đổi người lúc khôi phục.** Khôi phục một bản ghi không kéo theo bản ghi khác đã xóa. Khi bản ghi nó cần đã bị xóa hay đã đổi vai trò, nút Khôi phục tắt và dòng lý do **nêu tên bản ghi chặn** cùng việc cần làm ("Khôi phục team Bình Minh trước"). Bản ghi chặn nằm trong Thùng rác thì ngay trên màn này. Không có lựa chọn "khôi phục cả hai" hay "giao cho RE khác": thêm luồng cho một việc hiếm gặp, mà dữ liệu đang là giả lập.
- **TR-2 Phụ thuộc:** KH cần RE chưa xóa, vẫn vai trò RE. Lịch hẹn cần KH chưa xóa, RE như trên, người phối hợp chưa xóa (TL / IS / BD / BDM), người đánh giá kết quả chưa xóa và không phải RE. HĐ cần KH chưa xóa, RE như trên. Nhân sự RE / TL cần team chưa xóa; TL cần team chưa có TL khác. Team cần tên chưa trùng team đang dùng.
- **TR-3 D10 khi khôi phục cuộc hẹn Đã gặp.** Khôi phục trả dữ liệu về **đúng như lúc xóa** (Owner duyệt 15/10/2026, tổng hợp deep review lượt 1 §9 Q1 (a), Q2; DR6-01, DR6-03).
  - Cuộc gặp lúc xóa **không rút chuyển nhóm nào** (giữ nhóm) → khôi phục không ghi chuyển nhóm, không kiểm D10, dù nhóm KH đã đổi sau đó (kể cả cùng ngày cuộc hẹn). Hộp xác nhận: "Không đổi nhóm KH", như lịch không Đã gặp; dòng Thùng rác: "nhóm sau N3 · không đổi nhóm KH" (E18, E19; Owner 17/10/2026, tổng hợp deep review lượt 2 §9 Q7 (a), T-249). Chỉ chặn khi nhóm của chính ngày cuộc hẹn đã đổi lúc cuộc hẹn nằm trong Thùng rác (rút chuyển nhóm của một cuộc gặp trước đó), nên nhóm sau ghi trên lịch không còn là nhóm KH ngày ấy (`STAGE_NOT_ON_DAY`, T-232).
  - Cuộc gặp lúc xóa **có rút** một chuyển nhóm → khôi phục ghi lại chuyển nhóm đó, ngày = ngày cuộc hẹn (như lúc ghi kết quả); nhóm KH chưa đổi từ lúc xóa thì chính chuyển nhóm đã rút quay lại. Các dòng dưới áp cho ca này.
  - KH đã ở đúng nhóm sau cuộc gặp, tới nhóm đó **ngay trong ngày cuộc hẹn** → khôi phục, không thêm chuyển nhóm. Cuộc hẹn đó không tính RF nữa, vì RF gắn với chuyển nhóm, đúng luật hiện có. Tới nhóm đó vào ngày sau → từ chối như dòng dưới: cuộc gặp sẽ ghi giữ một nhóm KH không có trong ngày cuộc hẹn, file xuất ra không nhập lại được (spec Phase 3 §6 luật 4; Owner 15/10/2026, T-232), hoặc chuyển nhóm của cuộc gặp phải ghi lùi trước một chuyển nhóm ngày sau (D10, DR6-104).
  - Nhóm KH đã đổi vào ngày sau ngày cuộc hẹn → **từ chối** (D10 cấm ghi chuyển nhóm lùi ngày), lý do nêu ngày đổi nhóm gần nhất. Một chuyển nhóm **cùng ngày** cuộc hẹn nhưng ghi **sau lúc xóa** tính như đổi nhóm ngày sau (E20); lý do nói "ghi sau lúc xóa cuộc hẹn này" thay "sau ngày cuộc hẹn này" (Q7 (a), T-249). "Sau lúc xóa" theo thứ tự ghi chuyển nhóm (`seq`), không theo đồng hồ: hai máy xuất / nhập có thể lệch giờ (DR6-69, T-248). Chuyển nhóm được đưa lại khi khôi phục giữ chỗ của nó trong thứ tự ghi; khôi phục theo thứ tự đã ghi thì được, ngược lại bị chặn như E20 (vd. hai cuộc gặp cùng ngày cùng nằm trong Thùng rác; Owner 21/10/2026, tổng hợp deep review lượt 3 §9 Q1 (a), DR6-106).
  - Nhóm hiện tại không chuyển được sang nhóm sau cuộc gặp (vd. KH đã đóng mà nhóm sau là N2) → từ chối.
  - Không có ngoại lệ "khôi phục mà bỏ chuyển nhóm": như thế RF và nhóm KH lệch với kết quả cuộc gặp.
- **TR-4 Khôi phục KH** đưa KH về cùng mọi bản ghi con **chưa xóa riêng**: lịch hẹn, HĐ, ghi chú KYC, phân tích AI (vốn chỉ bị ẩn theo KH). Bản ghi con đã xóa riêng trước đó vẫn ở Thùng rác, khôi phục riêng sau khi KH về.
- **TR-5 Ngày trong tương lai** (bản ghi xóa đến từ file nhập, spec Phase 3 §6 luật 10): kết quả Đã gặp / Không đến sau hôm nay, HĐ nộp / phát hành sau hôm nay → từ chối như lệnh ghi. Lịch Dự kiến ngày đã qua khôi phục được và hiện ở "chưa ghi kết quả".
- **TR-6 Không tự dọn; người dùng dọn sạch được (hỏi trước, backup trước).** Thùng rác giữ bản ghi tới khi khôi phục (D4), hoặc tới khi người dùng dọn sạch (TR-11). App không tự xóa bản ghi nào, kể cả khi Thùng rác lớn: TR-13 chỉ nhắc. Không có xóa vĩnh viễn từng dòng. Xuất backup mang theo cả Thùng rác (như hiện nay); nhập / nạp lại thay cả Thùng rác. Owner chốt 17/10/2026 (tổng hợp deep review lượt 2 §9 Q8 (c), DR6-84), thay luật "không xóa vĩnh viễn" duyệt 11/10; Owner đã cân nhắc rồi bỏ hướng tự xóa bản cũ nhất khi vượt trần.
- **TR-7 Thùng rác không theo góc nhìn** (Toàn bộ / Team / RE ở thanh trên): là việc quản lý dữ liệu như Cài đặt → Dữ liệu, hiện mọi bản ghi xóa.
- **TR-8 Luôn hỏi trước khi khôi phục**, hộp xác nhận nêu hệ quả: số bản ghi con hiện lại (KH), nhóm KH đổi và RF (cuộc hẹn Đã gặp), "không đổi nhóm KH" (lịch khác). Lý do: khôi phục đổi chỉ số đã báo cáo; một hộp đơn giản rẻ hơn một lần bấm nhầm.
- **TR-9 Xóa KH (5f)** làm theo mockup đã duyệt: hộp Sửa KH có "Xóa KH…" → hộp 5f đếm lịch hẹn (đã gặp, lần tính RF), HĐ, ghi chú KYC; câu cuối đổi thành "Dữ liệu vẫn còn: khôi phục ở Cài đặt → Thùng rác." Xóa xong về danh sách Khách hàng. Lần chạy AI của KH đó đang chạy → kết quả bị bỏ (`CUSTOMER_NOT_FOUND` đã nằm trong nhóm `discarded`). Dòng Ghi chú KYC chỉ ghi số, bỏ "— giữ nguyên, không bao giờ xóa": dọn sạch Thùng rác xóa hẳn cả ghi chú của KH đã xóa (TR-11; mockup 11f).
- **TR-10 Câu ở các hộp xóa** trỏ về chỗ khôi phục: 6g "Xóa mềm, khôi phục được ở Cài đặt → Thùng rác.", xóa HĐ / nhân sự / team thêm cùng câu đó.
- Lịch **Dời lịch** vẫn không xóa được (Owner 30/09, #171): ngoài phạm vi.
- Khóa ghi S2-2 áp cả cho khôi phục (khôi phục là một lệnh ghi).

**Dọn sạch Thùng rác (TR-6, #662).** Owner chốt hướng ngày 17/10/2026; chi tiết dưới Owner duyệt G2 / G3 ngày 19/10/2026 (cả 6 đề xuất cuối mục, PR #707).

- **TR-11 Dọn tất cả: hỏi trước, backup trước, một transaction.**
  - **Nút "Dọn sạch Thùng rác…"** ở đầu màn, có khi Thùng rác có bản ghi; tắt khi mọi bản ghi đều được giữ lại (TR-12). Dọn mọi bản ghi, không theo loại / ô tìm đang chọn.
  - **Hộp xác nhận** (11i) đếm theo loại những gì bị xóa hẳn: KH, kèm lịch hẹn, HĐ, ghi chú KYC, phân tích AI của các KH đó (phần chưa xóa riêng, như 11b; phần đã xóa riêng đếm ở loại của nó); lịch hẹn; HĐ; nhân sự; team. Hộp nói rõ ba điều: không hoàn tác được; dữ liệu đang dùng và chỉ số không đổi; app backup file dữ liệu trước, lấy lại bằng cách chép bản backup như sau Nạp lại (10c). Có bản ghi giữ lại (TR-12) thì nêu số. Gõ **DỌN SẠCH** để xác nhận, như Nạp lại (câu hỏi 4).
  - **Đường chạy:** cùng hàng đợi thay dữ liệu của Nạp lại / Nhập backup (§4.1, `replace` của `app-data`).
    - Chờ lưu xong; lần lưu trước lỗi → từ chối như Nạp lại.
    - Chép file vào `backups\`; lỗi → không dọn.
    - Khóa mọi lệnh ghi tới khi xong (S2-2); kết quả AI về lúc đó bị bỏ (S2-3). Trong lúc dọn hộp ở lại với "Đang dọn…", không đóng được, nên không thao tác nào gặp câu báo S2-2.
    - Bản web không có file, không backup: hộp ghi như Nạp lại ("Bản web không lưu file…"), nút "Dọn sạch".
  - **Một transaction, theo thứ tự khóa ngoại.** Lỗi giữa chừng → không đổi gì. Dọn xong thu gọn file (`VACUUM`, câu hỏi 3). Thu gọn chạy sau transaction (SQLite không cho chạy trong transaction): nếu riêng bước này lỗi, dữ liệu đã được dọn, app vẫn báo như 11j, file chỉ chưa nhỏ lại tới lần dọn sau (PR code #662).
    - Dòng KH: KH cùng mọi dữ liệu con — lịch hẹn (cả lịch đã xóa riêng), người phối hợp, chuyển nhóm (cả chuyển nhóm đã rút), HĐ (cả HĐ đã xóa riêng), ghi chú / dữ kiện / phiên bản KYC, phân tích AI.
    - Dòng lịch hẹn: lịch, người phối hợp, chuyển nhóm đã rút theo nó.
    - Dòng HĐ, nhân sự, team: chính bản ghi đó.
  - **Sau khi dọn** (11j): hộp đóng; đầu thẻ báo "Đã dọn sạch Thùng rác", số đã xóa hẳn theo loại, tên file backup (bản exe), số bản ghi giữ lại nếu có; focus về thông báo (như 11e). Không dọn được → câu lỗi ở cùng chỗ, dữ liệu không đổi.
  - **Dữ liệu đang dùng không đổi.** Bản ghi đã xóa vốn không vào danh sách và chỉ số: chỉ số mọi kỳ / góc nhìn và phần chưa xóa của file xuất giống hệt trước / sau. Lần chạy AI của KH chưa xóa về sau lúc dọn vẫn lưu. Nhân sự chỉ còn dữ liệu của KH đã dọn thì xóa được; câu "KH trong Thùng rác" của hộp 9b (T-250, `person.inUseTrash`, `person.inUseSupportTrash`) thêm vế "hoặc dọn sạch Thùng rác". Luật nhập backup không đổi.
- **TR-12 Giữ bản ghi còn được dùng.** Bản ghi trong Thùng rác mà dữ liệu còn lại sau khi dọn (kể cả bản ghi được giữ) vẫn dùng tới thì giữ lại, cùng dữ liệu con của nó. Dòng của nó có lý do một dòng nêu bản ghi dùng tới nó, như dòng bị chặn (TR-1), hiện cả trước khi dọn. Nút Khôi phục vẫn theo TR-1…TR-5.
  - Lịch hẹn: "Giữ lại khi dọn: lịch 15/10/2026 10:00 dời từ lịch này."
  - Nhân sự là RE / người phối hợp của bản ghi được giữ: "Giữ lại khi dọn: lịch 08/10/2026 10:00 còn ghi người này." (Lịch giữ lại luôn là Dời lịch, mà chỉ lịch Đã gặp mới có người đánh giá — CHECK `appointments_outcome_reviewer` — nên không có vế người đánh giá.)
  - Team của nhân sự được giữ: "Giữ lại khi dọn: nhân sự Vương Thị Mai còn thuộc team này."
  - Dữ liệu tạo trong app không có ca nào. KH đã xóa chỉ được dữ liệu của chính nó dùng tới, dọn cùng nó. Nhân sự / team đã xóa chỉ còn được bản ghi đã xóa dùng tới, vì lệnh xóa từ chối khi còn (`PERSON_IN_USE`, `TEAM_HAS_MEMBERS`; luật nhập 5, 9).
  - Ca đã biết chỉ đến từ file nhập: lịch **Dời lịch** đã xóa mà lịch mới dời từ nó vẫn còn. App không cho xóa lịch Dời lịch, nhưng luật nhập 5 nhận chuỗi dời lịch có lịch đã xóa. Giữ lịch đó, cùng RE / người phối hợp đã xóa của nó và team đã xóa của họ.
- **TR-13 Nhắc khi Thùng rác lớn.** Từ **1 000** bản ghi (số ở đầu màn), dưới câu giới thiệu có câu nhắc (11h): "Thùng rác có 1.313 bản ghi nên mở chậm dần. Nên dọn sạch khi không cần khôi phục các bản ghi này nữa." 999 bản ghi → không có. Màn mở chậm tuyến tính theo số bản ghi (DR6-84: exe 138 ms ở 1 313 bản ghi, chạm 200 ms ở ≈ 2 000).

**Màn (G3, mockup `docs/design/mockups/trash.html`):** Cài đặt có thêm mục **Thùng rác** sau Dữ liệu và AI (`#/settings/trash`).

- Đầu: số bản ghi, nút **Dọn sạch Thùng rác…** (TR-11), câu ngắn về TR-6; từ 1 000 bản ghi thêm câu nhắc (TR-13, 11h). Thanh lọc: **Loại** (Tất cả · KH · Lịch hẹn · HĐ · Nhân sự · Team, có số đếm) và ô tìm theo tên (KH, nhân sự, team; lịch hẹn / HĐ tìm theo tên KH).
- Bảng (`DataTable`, "Hiện thêm" 100 dòng như DR-03): **Loại · Bản ghi · Thuộc · Xóa lúc · thao tác**, mới xóa nhất ở trên. "Bản ghi" theo loại: KH = tên + nhóm, kèm số bản ghi con sẽ hiện lại; lịch hẹn = ngày giờ + trạng thái / kết quả; HĐ = ngày nộp + FYP + trạng thái; nhân sự = tên + vai trò; team = tên. "Thuộc": KH + RE + team; bản ghi cha đã xóa ghi thêm "(đã xóa)".
- Dòng bị chặn: nút Khôi phục tắt, lý do một dòng dưới bản ghi (TR-1…TR-5). Màn tính lý do trước khi bấm; lệnh khôi phục vẫn kiểm lại (dữ liệu có thể vừa đổi) và lỗi hiện trong hộp.
- Dòng giữ lại khi dọn: lý do một dòng dưới bản ghi (TR-12), cùng chỗ với lý do chặn. Hộp dọn sạch: 11i; sau khi dọn: 11j.
- Khôi phục xong: dòng biến mất, thông báo "Đã khôi phục …" kèm nút **Mở** (KH / lịch hẹn / HĐ → hồ sơ KH; nhân sự / team → Team & nhân sự).
- Trống: "Thùng rác trống" + câu một dòng về loại bản ghi nằm ở đây.

**Ví dụ chuẩn (G2) — mỗi dòng là một test chấp nhận**, ngày hôm nay 11/10/2026:

| # | Bản ghi xóa | Tình huống | Kết quả |
|---|---|---|---|
| E1 | KH Trịnh Minh Anh (N3, RE Đỗ Khánh Linh) | RE còn | Khôi phục được; hộp: hiện lại 7 lịch hẹn, 0 HĐ, 5 ghi chú KYC |
| E2 | KH như E1 | RE Đỗ Khánh Linh đã xóa | Chặn: "RE Đỗ Khánh Linh đã xóa — khôi phục RE trước" |
| E3 | KH như E1 | Đỗ Khánh Linh nay là TL | Chặn: "Đỗ Khánh Linh nay là TL, không phụ trách KH được — đổi lại vai trò RE trước" |
| E4 | Lịch Dự kiến 06/10 của KH Trịnh Minh Anh, xóa riêng | Sau đó KH bị xóa | Chặn: "Khôi phục KH Trịnh Minh Anh trước"; khôi phục KH (E1) rồi khôi phục lịch → được |
| E5 | Lịch Đã gặp 02/10, N3 → N2, xóa 09/10 (chuyển nhóm bị rút, KH về N3) | Nhóm KH không đổi sau đó | Khôi phục được; hộp: "Nhóm KH N3 → N2 từ 02/10/2026, tính 1 RF" |
| E6 | Như E5 | Ghi cuộc gặp 05/10 N3 → N1 sau khi xóa | Chặn: "Nhóm KH đã đổi ngày 05/10/2026, sau ngày cuộc hẹn này (D10)" |
| E7 | Như E5 | Chuyển tay N3 → N2 ngày 02/10, sau khi xóa | Khôi phục được, không thêm chuyển nhóm; hộp: "Nhóm KH giữ N2; cuộc hẹn này không tính RF". Chuyển tay ngày 10/10 thì chặn như E6: "Nhóm KH đã đổi ngày 10/10/2026, sau ngày cuộc hẹn này (D10)" (Owner 15/10/2026, T-232) |
| E8 | Lịch Đã gặp 28/09, N4 → N3 | KH đã Mất cơ hội ngày 01/10 | Chặn như E6 (ngày đổi nhóm 01/10) |
| E9 | Lịch có người phối hợp Phó Đức Huy | Phó Đức Huy đã xóa | Chặn: "Người phối hợp Phó Đức Huy đã xóa — khôi phục trước" |
| E10 | Lịch Đã gặp có người đánh giá Vũ Thanh Tâm | Vũ Thanh Tâm nay là RE | Chặn: "Người đánh giá Vũ Thanh Tâm nay là RE" |
| E11 | Lịch Dự kiến 30/09 (đã qua) | — | Khôi phục được, hiện ở "chưa ghi kết quả"; hộp: "Không đổi nhóm KH" |
| E12 | HĐ nộp 15/09, 24.000.000 ₫ | KH, RE còn | Khôi phục được |
| E13 | HĐ xóa, nộp 20/10 (từ file nhập) | — | Chặn: "Ngày nộp 20/10/2026 sau hôm nay" |
| E14 | Nhân sự RE Vương Thị Mai, team Bình Minh | Team Bình Minh đã xóa | Chặn: "Khôi phục team Bình Minh trước"; khôi phục team rồi người → được |
| E15 | TL Lý Quốc Bảo, team Sao Mai | Sao Mai đã có TL Nguyễn Thu Hà | Chặn: "Sao Mai đã có TL Nguyễn Thu Hà" |
| E16 | Team Bình Minh | Đã có team khác tên Bình Minh | Chặn: "Đã có team Bình Minh — đổi tên team kia trước" |
| E17 | Bất kỳ | Đang Nạp lại / Nhập backup | Từ chối với câu S2-2 |
| E18 | Lịch Đã gặp 02/10 của KH N3, nhóm sau N3 (giữ nhóm), xóa | Ghi cuộc gặp 05/10 N3 → N2 (trước hay sau khi xóa) | Khôi phục được, không thêm chuyển nhóm; dòng: "nhóm sau N3 · không đổi nhóm KH"; hộp: "Không đổi nhóm KH"; "Đã gặp" của kỳ về lại |
| E19 | Lịch Đã gặp 10/10 của KH N2, nhóm sau N2 (giữ nhóm), xóa | Chuyển tay N2 → N3 ngày 10/10 | Khôi phục được, không thêm chuyển nhóm; KH giữ N3 |
| E20 | Như E5 | Chuyển tay N3 → N1 ngày 02/10, sau khi xóa | Chặn như E6, câu riêng: "Nhóm KH đã đổi ngày 02/10/2026, ghi sau lúc xóa cuộc hẹn này (D10)". Chuyển tay cùng ngày ghi **trước** khi xóa thì không chặn |

**Ví dụ chuẩn dọn sạch (G2, #662) — mỗi dòng là một test chấp nhận**, hôm nay 11/10/2026. Thùng rác có 14 bản ghi như mockup 11a: 3 KH (kèm 12 lịch hẹn, 1 HĐ, 9 ghi chú KYC, 2 phân tích AI), 6 lịch hẹn, 2 HĐ, 2 nhân sự, 1 team.

| # | Tình huống | Kết quả |
|---|---|---|
| D1 | Mở hộp dọn sạch | "KH 3 — kèm 12 lịch hẹn · 1 HĐ · 9 ghi chú KYC · 2 phân tích AI", "Lịch hẹn 6", "HĐ 2", "Nhân sự 2", "Team 1"; không có dòng giữ lại; nút xác nhận tắt tới khi gõ đúng DỌN SẠCH (câu hỏi 4) |
| D2 | Dọn | Thùng rác trống. Không còn dòng nào của 3 KH ở mọi bảng. Lịch 02/10 của KH Phạm Gia Bảo đi cùng chuyển nhóm đã rút của nó; KH vẫn N3. `PRAGMA foreign_key_check` rỗng. Thông báo "Đã dọn sạch Thùng rác" + số theo loại + tên file backup |
| D3 | Như D2, so trước / sau | Chỉ số Tổng quan / Báo cáo mọi kỳ, mọi góc nhìn giống hệt; xuất backup phần chưa xóa giống hệt; file mang tên ở thông báo, trong `backups\`, mở lại được và có đủ 14 bản ghi đã xóa (app có thể dùng lại một bản backup giống hệt đã có thay vì chép bản mới) |
| D4 | RE Vũ Minh Khoa chỉ còn là RE của lịch hẹn của một KH trong Thùng rác (hộp 9b: "Có cả dữ liệu của KH đã xóa: …") | Sau dọn: hộp 9b hết câu đó, xóa được RE Vũ Minh Khoa |
| D5 | Thêm lịch **Dời lịch** 08/10/2026 10:00 của KH Phạm Gia Bảo, đã xóa (từ file nhập); lịch 15/10/2026 10:00 dời từ nó chưa xóa | Dòng lịch 08/10: "Giữ lại khi dọn: lịch 15/10/2026 10:00 dời từ lịch này."; hộp: "Giữ lại 1 bản ghi còn được dùng". Sau dọn Thùng rác chỉ còn lịch 08/10; lịch 15/10 không đổi |
| D6 | Như D5; RE ghi trên lịch 08/10 (KH đã bàn giao cho RE khác) đã xóa, team của người đó cũng đã xóa | Giữ cả ba. RE: "Giữ lại khi dọn: lịch 08/10/2026 10:00 còn ghi người này."; team: "Giữ lại khi dọn: nhân sự <tên RE> còn thuộc team này." |
| D7 | Lần lưu gần nhất lỗi | Từ chối, không backup: "Chưa dọn: lần lưu gần nhất bị lỗi, backup sẽ thiếu các thay đổi đó. Bấm "Thử lại" ở dải cảnh báo đầu màn, lưu được rồi thì dọn lại. Dữ liệu không bị đổi." (vế "Bấm "Thử lại"…" từ T-294; mockup 11j chưa có) |
| D8 | Backup lỗi (vd. ổ đĩa đầy) | Không dọn: "Chưa dọn được Thùng rác. Dữ liệu không bị đổi." |
| D9 | Lỗi giữa chừng (một câu xóa bị từ chối) | Như D8: không đổi gì, kể cả các dòng đã xóa trước câu lỗi |
| D10 | Lệnh ghi / kết quả AI tới trong lúc dọn | Lệnh ghi bị từ chối (S2-2); kết quả AI bị bỏ (S2-3) |
| D11 | Câu SQL sửa / xóa ghi chú, dữ kiện, phân tích AI | KH chưa xóa: sửa và xóa đều bị trigger chặn như trước. KH đã xóa mềm: xóa qua; sửa vẫn bị chặn (dữ kiện vẫn chỉ đổi được trạng thái) |
| D12 | Thùng rác 1 000 bản ghi / 999 bản ghi | Có câu nhắc TR-13 / không có |
| D13 | Bản web | Hộp ghi "Bản web không lưu file: dữ liệu chỉ nằm trong trình duyệt.", nút "Dọn sạch"; dọn như D2, thông báo không có tên file backup |

**Mô hình dữ liệu:** khôi phục không đổi schema, không migration. Thêm hàm đọc ở `packages/db` (vd. `listTrash`): mỗi bản ghi xóa kèm thông tin hiện, hệ quả khôi phục và lý do chặn. Lý do chặn dùng **chung hàm kiểm** với các lệnh `restore…`, không viết luật lần hai; test bảo đảm lý do của màn và lỗi của lệnh trùng nhau ở E1–E16, E18–E20. Lỗi của lệnh cần nêu tên bản ghi chặn → thêm params (`name`, `date`) cho các mã đã có (`PERSON_NOT_FOUND`, `RE_REQUIRED`, `TEAM_NOT_FOUND`, `TRANSITION_BEFORE_LATEST`…), không thêm mã mới ngoài lỗi khóa ghi của S2-2.

**Mô hình dữ liệu của dọn sạch (#662):**

- Không đổi bảng, cột. Một migration tự viết mới nới ba trigger chặn xóa (`kyc_notes_no_delete`, `kyc_facts_no_delete`, `ai_analyses_no_delete`): chỉ cho xóa dòng của KH đã xóa mềm. Trigger chặn sửa và mọi xóa khác giữ nguyên (phụ lục ADR-0008). `LATEST_SCHEMA_VERSION` tăng 1; DB cũ có dữ liệu mở được.
- `@p2c/db`: `previewPurge` là kế hoạch của lệnh dọn (số sẽ xóa hẳn theo loại, bản ghi giữ lại kèm lý do): lệnh dọn tính nó trong transaction của mình, rồi trả số đã dọn theo loại cùng tập giữ lại (11j nêu số bản ghi giữ lại). Hộp 11i đọc cùng kế hoạch từ các dòng `listTrash` vừa đọc (`purgePlan` của app), không đọc DB lần nữa; `previewPurge` là chuẩn so của test (PR #833). Tập giữ lại (TR-12) tính ở **một hàm** (`keptRecords`) dùng chung cho lệnh dọn và `listTrash` (lý do giữ lại của từng dòng), như lý do chặn dùng chung hàm kiểm của `restore…`.
- `AppData`: dọn qua hàng đợi thay dữ liệu (backup trước, khóa ghi), trả tên file backup. Dọn không thay DB, nên `generation` không đổi.
- Không thêm mã lỗi: lỗi của dọn là lỗi lưu / backup / lệnh như Nạp lại.
- Tài liệu sửa ở PR code:
  - `docs/user-guide/09-cai-dat.md`: câu TR-6, mục mới "Dọn sạch Thùng rác"; `04-khach-hang.md`: câu hộp 5f.
  - `docs/testing/nghiem-thu-v1.md`: NT-TR-01 (câu TR-6), NT-KH-14 (5f); dòng mới cho 11h–11j, đặt sau NT-TM-16 vì dọn xóa hẳn "KH Thùng rác" của dòng đó và "RE Thùng rác" thành xóa được (ghi chú review PR #700 trong sổ); bỏ dòng 11a khỏi "Lệch mockup đã biết"; thêm 11h–11j vào bảng đối chiếu mockup.

**Ước lượng:** db `listTrash` + params lỗi ≈ 200 SP / 400 test (`risk:med`); Xóa KH 5f ≈ 100 SP + e2e (`risk:med`); màn Thùng rác + hộp khôi phục + câu hộp xóa ≈ 300 SP + e2e (`risk:med`, tách đôi danh sách / hộp nếu vượt P1). Dọn sạch (#662, `risk:high`: đường xóa hẳn dữ liệu duy nhất của app): PR docs này; PR code ≈ 120–200 SP + migration + ≈ 250–300 dòng test.

**Câu hỏi G1 / G2 / G3 cho Owner (#662).** Mỗi câu có đề xuất; Owner đồng ý mà không ghi gì khác thì lấy đề xuất. **Owner đồng ý cả 6 đề xuất, duyệt G1 / G2 / G3 (19/10/2026, PR #707).**

1. **G1 — phụ lục ADR-0008:** append-only của ghi chú KYC, dữ kiện, phân tích AI có một ngoại lệ là dọn dữ liệu của KH đã xóa mềm; trigger chỉ nới cho đúng ca đó. **Đề xuất: đồng ý.**
2. **G2 — TR-6, TR-11…TR-13 và ví dụ D1–D13.** **Đề xuất: đồng ý.**
3. **G2 — thu gọn file sau khi dọn (`VACUUM`).** SQLite xóa dòng mà không trả chỗ: file giữ nguyên cỡ, chỗ trống chỉ được dùng lại cho dữ liệu ghi sau, và phần đã dọn có thể còn sót trong chỗ trống đó. Mỗi lần lưu ghi lại cả file (ADR-0016).
   - (a) Thu gọn ngay sau khi dọn: file nhỏ lại (≈ 9–10 KB mỗi KH đã dọn), mỗi lần lưu sau ghi ít hơn, phần đã dọn không còn trong file. Lúc dọn lâu thêm; PR code đo và ghi số.
   - (b) Không thu gọn.
   - **Đề xuất: (a).**
4. **G3 — gõ DỌN SẠCH để xác nhận**, như Nạp lại (10c): đây là thao tác xóa hẳn duy nhất của app. **Đề xuất: có.**
5. **G3 — mockup `trash.html`:** 11a (nút, câu TR-6), 11f (bỏ "giữ nguyên, không bao giờ xóa"), 11h–11j mới. Trong 11a, dòng lịch Đã gặp bị chặn ghi "nhóm sau N2" như app: đây là lệch mockup đã biết (sổ review #543, `nghiem-thu-v1.md` "Lệch mockup đã biết"), vì khi bị chặn app không tính nhóm trước cuộc gặp. **Đề xuất: duyệt.**
6. **Phạm vi PR code:** thêm vào file được sửa `docs/user-guide/04-khach-hang.md` (câu hộp 5f). Thêm cả `e2e/team.spec.ts` và `apps/desktop/src/routes/team/team-view.test.ts`, theo comment của Owner ở #662 (câu 9b mới). **Đề xuất: đồng ý.**

### 4.3 Hướng dẫn sử dụng (G2)

**Người đọc:** người dùng app (Owner, TL, RE), không cần biết kỹ thuật. Viết theo việc cần làm, từng bước ngắn, nhãn đúng như trên màn. Thuật ngữ ngành giữ tiếng Anh, có bảng giải thích lấy từ `CONTEXT.md`.

**Định dạng (đề xuất):** Markdown ở `docs/user-guide/`, mỗi màn một file + ảnh PNG ở `docs/user-guide/img/`. Repo public nên GitHub hiện đúng định dạng, có ảnh, không cần công cụ mới. GitHub Release v1.0 đính kèm `huong-dan-su-dung.zip` (thư mục này) để đọc offline và ghi link tới trang GitHub. Không làm PDF / HTML riêng (cần công cụ chuyển đổi → G4), không thêm nút "Hướng dẫn" trong app ở v1.0 (mở link ngoài từ exe cần thêm quyền / plugin Tauri).

**Mục lục:**

| File | Nội dung |
|---|---|
| `README.md` | Mục lục; app làm gì; bản exe và bản web; làm trên hai máy (xuất trước khi đổi máy, nhập ở máy kia, "bản nhập sau thắng" — §8) |
| `01-bat-dau.md` | Chạy exe portable, thư mục `Project2C-data\` (file DB, `backups\`, `exports\`), lần mở đầu có dữ liệu giả lập, trạng thái lưu (chỉ báo ở chân sidebar: "Đã lưu HH:MM" / "Đang lưu…" / "Chưa lưu được vào file", bản web ghi dữ liệu chỉ trong trình duyệt; "Lưu lần cuối" ở Cài đặt → Dữ liệu), báo lỗi lưu (dải ở đầu màn, nút **Thử lại**), góc nhìn Toàn bộ / Team / RE |
| `02-tong-quan.md` | Tổng quan: chọn kỳ, Lọc, ô Lịch hẹn 4 nhóm, 6 KPI + so kỳ trước, KH theo nhóm, so sánh team / RE |
| `03-lich-hen.md` | Lịch hẹn: 4 nhóm, lịch tháng / năm, đặt lịch, ghi kết quả (Đã gặp / Hủy / Không đến), hẹn tiếp, dời lịch, sửa / xóa |
| `04-khach-hang.md` | Khách hàng: Kanban / bảng, tạo / sửa / xóa KH, chuyển nhóm tay |
| `05-ho-so-kh.md` | Hồ sơ KH: dữ kiện KYC, ghi chú + xác nhận, mâu thuẫn, dòng thời gian, hợp đồng (nộp / phát hành), lịch hẹn của KH |
| `06-ai.md` | KYC Intelligence: phân tích, discovery, lịch sử, mã F, STALE, AI trích xuất, ChatGPT web; giới hạn (không gợi ý sản phẩm, G5) |
| `07-bao-cao.md` | Báo cáo: Tổng hợp / Theo team / Theo RE / Theo mốc, xuất Excel |
| `08-team.md` | Team & nhân sự: tạo team, thêm / sửa / xóa người, vai trò RE / TL / IS / BD / BDM |
| `09-cai-dat.md` | Cài đặt → Dữ liệu (file, xuất / nhập backup, nạp lại), → AI (Mock / OpenCode, gói, model, key), → Thùng rác (§4.2) |
| `10-su-co.md` | Khi có lỗi: chưa lưu được vào file, không mở được file lúc khởi động (mở từ backup), app đang mở ở cửa sổ khác, lỗi AI thường gặp |
| `11-thuat-ngu.md` | Thuật ngữ: RE, TL, IS, BD, BDM, KH N4–N1, RF, FYP, KYC, CURRENT / STALE… |

**Ảnh chụp:**

- Chụp tự động bằng Playwright trên bản build web, ngày neo cố định như e2e (`DEMO_ANCHOR`), khung 1440 × 900: chạy lại cho ra cùng ảnh. Một cấu hình Playwright riêng (vd. `playwright.guide.config.ts`, chạy `pnpm exec playwright test -c …`), **không** chạy trong CI, không thêm script vào `package.json` (khỏi phải build exe).
- Lệnh chụp kiểm luôn mọi đường dẫn ảnh / link tương đối trong `docs/user-guide/` đều tồn tại.
- Commit PNG vào repo: ≈ 25 ảnh, mỗi ảnh ≤ 150 KiB, tổng ≤ 4 MiB (1 KiB = 1 024 byte; `e2e/guide/check.guide.ts`).
- Phần chỉ có ở exe (đường dẫn file, trạng thái lưu, lỗi khởi động, khóa một cửa sổ) viết bằng chữ, đánh dấu "(bản exe)"; bản web hiện khác (dữ liệu trong trình duyệt, mất khi tải lại).

**Thời điểm:** viết sau khi S-2 và Thùng rác merge (màn của 6B đã xong). Chụp lại ảnh sau đợt sửa cuối của 6D, trước G7; G7 kiểm hướng dẫn khớp exe phát hành (một dòng trong `docs/testing/nghiem-thu-v1.md`).

**Test chấp nhận:**

- [ ] Mỗi màn ở sidebar, mỗi mục Cài đặt và mỗi hộp thoại có trong mockup đã duyệt đều có ít nhất một đoạn hướng dẫn (bảng đối chiếu cuối `README.md`).
- [ ] Lệnh chụp chạy hai lần liền cho ra ảnh giống hệt; mọi link / ảnh tương đối tồn tại.
- [ ] Nhãn trong hướng dẫn trùng chuỗi `vi.ts` hiện tại.

**Ước lượng:** lệnh chụp + kiểm link ≈ 150 dòng (`risk:low`); nội dung (docs-only, `risk:low`) tách 2 PR theo nửa mục lục.

### 4.4 Câu hỏi G2 / G3 cho Owner (6B)

**Owner đồng ý cả 8 đề xuất và duyệt G2 / G3 sau khi xem mockup `trash.html` (11/10/2026).**

1. **S-2:** khóa mọi lệnh ghi trong lúc thay (S2-2) thay vì cho ghi rồi chép sang DB mới; xuất không vào hàng đợi (S2-5); đóng app không phải chờ (S2-6).
2. **TR-1:** khôi phục không dây chuyền, nêu tên bản ghi chặn; không có "khôi phục cả hai" hay "giao RE khác".
3. **TR-3 / E7:** cuộc hẹn Đã gặp khôi phục khi KH đã ở nhóm sau cuộc gặp thì không thêm chuyển nhóm và không tính lại RF.
4. **TR-6:** không xóa vĩnh viễn, không tự dọn Thùng rác.
5. **TR-8:** luôn có hộp xác nhận khi khôi phục.
6. **TR-9:** làm luôn hộp Xóa KH 5f (mockup đã duyệt Phase 3, app chưa có).
7. **Hướng dẫn:** Markdown + PNG trong repo, zip kèm Release, không có nút trong app ở v1.0; ảnh chụp tự động từ bản web.
8. **G3:** mockup `trash.html` (11a–11g).

## 5. 6C — kiểm thử phát hành

1. **Kịch bản trọn vòng tự động (e2e):** một chuỗi trên bản build web đi hết vòng nghiệp vụ — tạo team / RE → khách hàng → ghi chú KYC + xác nhận dữ kiện → lịch hẹn → kết quả cuộc gặp → hợp đồng → Tổng quan / Báo cáo khớp số → AI (Mock) → xóa mềm + khôi phục ở Thùng rác → xuất backup → nạp lại → nhập backup → số liệu như trước. Chạy trong CI như e2e hiện có.
2. **Danh sách nghiệm thu cho Owner** `docs/testing/nghiem-thu-v1.md`: theo từng màn và từng dòng mockup, mỗi dòng có thao tác + kết quả mong đợi + ô Đạt / Lỗi; dùng ở 6C (lượt thử) và ở G7 (lượt cuối trên exe phát hành).
3. **Exe trên máy thật:** hai máy của Owner và một máy Windows sạch (vd. Windows Sandbox, Owner chạy): lần chạy đầu, thư mục dữ liệu, không cần quyền admin; **nâng từ exe Phase 5** (`3d6c7fc`) giữ nguyên dữ liệu; backup máy này → nhập máy kia và ngược lại.
4. **Độ bền dữ liệu:** tắt app giữa lúc lưu / thay DB / xuất (S-2), file DB hỏng, ổ đầy hoặc không ghi được — app báo lỗi rõ, không mất bản đã lưu.
5. **Hiệu năng** trên dữ liệu tải theo §5.2, đo trên exe release.
6. **Eval AI thật** sau đợt G5 (§3).

Lỗi tìm ra ở 6C thành Issue thường; lỗi chặn phát hành gắn `risk:high`.

### 5.1 Dữ liệu tải và số đo nền

- Bộ dữ liệu tải của deep review Phase 1–4 (1 496 KH, 10 434 lịch hẹn) chỉ nằm ngoài repo trên Office Laptop. Thêm **một lệnh sinh dữ liệu tải tất định trong repo** (cùng cỡ, thêm `ai_analyses` và dữ liệu Phase 6) để hai máy và bốn reviewer đo cùng một bộ.
- **Số đo nền** ghi vào `docs/metrics/phase-6.md` trước lượt review 1: thời gian các thao tác ở §5.2, bộ nhớ webview, kích thước bundle web theo gói JS và exe; số dòng sản phẩm / test theo vùng. Đây là mốc để lượt 2 so "không xấu đi".

### 5.2 Ngưỡng hiệu năng

- Đo: mở app (lần đầu / mở lại), màn đầu sau tải lại, đổi kỳ / sắp cột / chọn dòng ở Lịch hẹn, Khách hàng, Tổng quan, Báo cáo, xuất Excel, panel AI và lịch sử phân tích, nhập / xuất backup, lưu DB.
- Giữ ngưỡng Nhóm C của deep review Phase 1–4 (thao tác màn < 200 ms trên dữ liệu tải; `docs/metrics/phase-4.md` mục "Đo đầu-cuối"), thêm ngưỡng cho màn Phase 5 / 6 sau số đo nền. Không màn nào xấu hơn số đo Phase 4.

## 6. 6D — deep review Phase 1–6: 4 lượt, 6 gói

### 6.1 Vai trò

| Bên | Ai chạy | Việc |
|---|---|---|
| Claude (context sạch mỗi gói, tuần tự; lượt 1–2: mỗi gói một phiên sạch, không subagent; lượt 3: mỗi gói một phiên sạch như lượt 2, subagent / Workflow chỉ khi Owner bật ultracode cho phiên đó — ADR-0001 M9, sửa 20/10; lượt 4: như lượt 3, Claude Opus 5.5 — M10) | Owner mở phiên | Reviewer, chỉ đọc, worktree review riêng |
| Codex | Owner | Reviewer độc lập, chỉ đọc (ADR-0001 M2). Lượt 4: model GPT Sol 6.1 (Owner 27/10 — M10) |
| Muse Spark 1.3 (Muse Code) | Owner | Reviewer độc lập, chỉ đọc (13/10: DeepSeek v4.1 Flash bỏ, Muse đổi sang Wonder — ADR-0001 M5; 14/10: về lại Spark 1.3 trên Office Laptop — M6). Chỉ lượt 1; lượt 2 bỏ Muse (17/10 — M7) |
| DeepSeek v4.1 Flash (DeepSeek Harness) | Owner | Reviewer độc lập, chỉ đọc, như Codex (ADR-0001 M2). Chỉ lượt 4 (Owner 27/10 — M10; bỏ từ 13/10 theo M5). Chạy qua DeepSeek Harness (DSH), DeepSeek API trả theo mức dùng (Owner đổi 28/10, thay gói OpenCode Go) |
| **Claude (phiên tổng hợp)** | sau khi đủ báo cáo | **Vai chính:** đọc mọi báo cáo, kiểm lại từng phát hiện trên code (đúng / đã biết / sai), gộp trùng, chốt mức, đề xuất hướng giải quyết cho từng vấn đề (kèm phương án khi có nhiều cách), xếp việc sửa thành phương án cho Owner chọn |

Báo cáo của Codex / Muse / DeepSeek là **dữ liệu tham khảo**; kết luận "sẵn sàng phát hành" chỉ lấy từ phiên tổng hợp sau khi đã kiểm trên code (bài học Phase 5: DeepSeek / Muse kết luận SẴN SÀNG khi còn 2 lỗi Medium — `docs/reviews/2026-10-10-danh-gia-deepseek-muse.md` §7).

### 6.2 Chia 6 gói

Cỡ đo trên `3d6c7fc` (dòng sản phẩm / test; Rust có test trong cùng file), cộng phần Phase 6 dự kiến. Phase 5 cũng 6 gói, mỗi bên ≈ 2–3 giờ.

| Gói | Phạm vi | Dòng SP / test (hiện tại) | Trọng tâm riêng |
|---|---|---|---|
| **A. Lõi dữ liệu** | `packages/domain` + `packages/db` (schema, migration, repository, backup, seed) | 7 400 / 9 100 | Tiền, ngày, kỳ, chỉ số; bất biến dữ liệu; nhập backup; golden không chiều theo code |
| **B. File và Rust** | `apps/desktop/src-tauri` + lớp `src/data` (adapter lưu, thay DB) + S-2 (Phase 6) | 3 100 Rust + ≈ 1 500 TS + phần S-2 | Ghi nguyên tử, hàng đợi S-2, mất dữ liệu, ranh giới bảo mật (đường dẫn, key) |
| **C. AI** | `packages/ai` + màn / view AI (panel, lịch sử, ChatGPT web, trích xuất, Cài đặt → AI) | 1 700 + ≈ 1 500 / 2 200 + test view | Guardrail G5, validator, STALE, key không sang webview |
| **D. Màn nhập liệu** | `packages/ui`, shell, i18n, Khách hàng (phần không AI), KYC, Team | ≈ 7 000 / ≈ 4 000 | Khớp mockup / nhãn, form, trợ năng |
| **E. Lịch hẹn, chỉ số, quản lý** | Lịch hẹn, Kết quả, Hợp đồng, Tổng quan, Báo cáo, Cài đặt, Thùng rác (Phase 6) | ≈ 6 000 / ≈ 2 000 | Đếm / lọc đúng nghĩa nhãn, số khớp giữa màn, xuất Excel |
| **F. Xuyên gói + bloat / hiệu năng + công cụ** | `tools/`, CI, e2e; luồng xuyên gói; **toàn bộ codebase cho trục bloat / hiệu năng** | 2 300 / 6 900 | Code chết / lặp / export thừa, dependency, bundle / exe, đo trên dữ liệu tải, test yếu, CI |

Gói F là chỗ phân tích bloat code và hiệu năng toàn cục (yêu cầu Owner 11/10); các gói A–E vẫn ghi hai trục này trong phạm vi của mình. Nếu cần gọn hơn nữa, gộp D + E (5 gói) — đổi lại gói D+E ≈ 13 000 dòng SP, dài gấp đôi gói khác.

### 6.3 Cách làm (theo khuôn deep review Phase 1–4 và Phase 5)

- **Kế hoạch chi tiết** `docs/process/deep-review-phase-1-6.md` soạn ở bước 0 của lượt 1 (SHA ghim, prompt từng bên, KNOWN, baseline lấy từ §5.1), Owner duyệt trước khi chạy.
- **Trục:** các trục của deep review trước (đúng-sai / edge case, toàn vẹn dữ liệu, bảo mật ở ranh giới, test yếu, trợ năng / i18n, khớp spec / mockup / nhãn) **và hai trục bắt buộc ghi riêng: bloat code, hiệu năng** (đo trên dữ liệu tải §5.1).
- **Độc lập:** cùng SHA, mỗi bên một thư mục, cấm đọc báo cáo của nhau cho tới phiên tổng hợp; kiểm bằng log phiên như Phase 5.
- **Muse (lượt 1):** chạy không hỏi duyệt (`--yolo`, Owner chọn 13/10) để tránh hàng chục lần Owner duyệt tay; thư mục làm việc là thư mục kết quả, repo chỉ đọc theo prompt; ACL chặn thư mục của bên khác, `git status` mỗi gói và quét log phiên thay cho sandbox (`docs/process/deep-review-phase-1-6.md` §7.1).
- **Lượt 1** trên SHA sau 6C → tổng hợp (gồm phần bloat / hiệu năng: số đo, phát hiện, đề xuất refactor) → Owner chọn → sửa (Issue thường, review phiên sạch; refactor giữ nguyên hành vi, test cũ xanh trước và sau, không đổi golden).
- **Lượt 2** trên SHA sau đợt sửa lượt 1, cùng 6 gói, **hai bên Claude và Codex** (Owner 17/10 bỏ Muse, máy chạy tùy và số đo so với mốc cùng máy — ADR-0001 phụ lục M7; kế hoạch `docs/process/deep-review-phase-1-6.md` §L2), có hai phần ngang nhau (Owner chốt 11/10):
  1. **Kiểm phần đã sửa:** trạng thái từng vấn đề lượt 1 (đã sửa / một phần / hồi quy); refactor bloat / hiệu năng không đổi hành vi; số đo không xấu hơn nền.
  2. **Tìm lỗi mới và edge case mới** trên toàn bộ phạm vi gói, không chỉ quanh chỗ đã sửa: prompt lượt 2 yêu cầu mỗi bên thử những kịch bản / biên chưa có trong báo cáo lượt 1 (danh sách vấn đề lượt 1 đưa vào KNOWN để không báo lại).

  → tổng hợp → Owner chọn → sửa.
- **Lượt 3** (Owner thêm 19/10/2026, trước G7; ADR-0001 phụ lục M9; kế hoạch `docs/process/deep-review-phase-1-6.md` §L3): trên SHA sau đợt sửa lượt 2, cùng 6 gói, hai bên Claude và Codex, cùng hai phần như lượt 2 (kiểm phần đã sửa sau lượt 2; lỗi / edge case mới trên toàn bộ phạm vi gói). Phần Claude chạy bằng **Workflow**: mỗi gói một subagent context sạch, tuần tự A → F, trong một phiên Owner mở. *Sửa 20/10/2026 (Owner, trước khi chạy):* phần Claude chạy như lượt 2, mỗi gói một phiên sạch Owner mở; mức suy luận, ultracode do Owner chọn từng phiên. Sau tổng hợp: **sửa hết** (Owner chốt 19/10), rồi G7.
- **Lượt 4** (Owner thêm 26–27/10/2026, trước G7; ADR-0001 phụ lục M10; kế hoạch `docs/process/deep-review-phase-1-6.md` §L4): deep review toàn bộ code, cùng 6 gói, ba bên Claude Opus 5.5, Codex (GPT Sol 6.1) và DeepSeek v4.1 Flash (qua DeepSeek Harness, DeepSeek API trả theo mức dùng; Owner bổ sung 27/10, đổi cách chạy 28/10), phần Claude như lượt 3. Chỉ chạy khi mọi ghi chú OPEN của `docs/state/review-notes.md` đã sửa hết (Owner 27/10): SHA ghim là `main` sau T-305…T-308 và đợt sửa mục OPEN còn lại. Hai phần như lượt 2–3: kiểm phần đã sửa sau lượt 3 (đợt sửa lượt 3, đợt sửa sổ ghi chú review trước v1.0, T-305…T-308, đợt sửa mục OPEN còn lại); lỗi / edge case mới trên toàn bộ phạm vi gói. Phần sau tổng hợp Owner chọn cùng G1 của kế hoạch (§L4.11).
- Báo cáo gốc lưu nguyên văn ở `docs/reviews/raw/<ngày>/{claude,codex,muse,deepseek}/` qua PR docs; tổng hợp ở `docs/reviews/`.
- Công cụ phân tích: ưu tiên thứ đã có (`dependency-cruiser`, `codemap`, script `node`). Công cụ mới (vd. `knip`, `cargo-bloat`) là **G4**.

### 6.4 Ước lượng

6 gói × 3 bên = 18 báo cáo ở lượt 1; lượt 2 bỏ Muse (M7) nên 6 gói × 2 bên = 12 báo cáo, 30 cho hai lượt; lượt 3 (M9) thêm 12 báo cáo, 42 cho ba lượt; lượt 4 (M10) có ba bên nên thêm 18, 60 cho bốn lượt. Theo Phase 5: mỗi bên ≈ 2–3 giờ đồng hồ một lượt (Phase 1–6 lớn hơn, ước ≈ 3–4 giờ); Muse chạy `--yolo` nên không tốn thời gian chờ duyệt.

### 6.5 Quy tắc

ADR-0001 phụ lục **M4** (cùng PR với spec này): ở review đóng Phase 6, Muse tham gia như Codex (M5, 13/10: bỏ DeepSeek; M6, 14/10: Muse dùng Spark 1.3; M7, 17/10: lượt 2 bỏ Muse) — chỉ đọc, không viết code, báo cáo là dữ liệu tham khảo, không thay review phiên sạch. Không mở Agent tool, không cho agent ngoài viết code; multi-agent thử ở project mới, không ở 2C (Owner 11/10). *Sửa 17/10/2026 (ADR-0001 phụ lục M8):* Claude được dùng subagent / Workflow khi Owner bật (`ultracode`); agent ngoài Claude vẫn không viết code. Câu "không mở Agent tool" chỉ còn áp cho 2 lượt deep review 6D đã chạy; lượt 3 định chạy phần Claude bằng Workflow (M9, 19/10), rồi Owner đổi 20/10: mỗi gói một phiên như lượt 2, subagent / Workflow chỉ ở phiên Owner bật ultracode. Lượt 4 chạy phần Claude như lượt 3, và DeepSeek (DeepSeek Harness) review chỉ đọc như Codex (M10, 26–28/10). Bỏ so sánh với Project-2 nên không còn ràng buộc từ `docs/COMPARISON.md` (ADR-0001 phụ lục M3, ADR-0002 Superseded).

## 7. 6E — G7 và phát hành v1.0

- Owner nghiệm thu exe cuối theo `docs/testing/nghiem-thu-v1.md`, điền số Owner vào `docs/metrics/phase-6.md`.
- **GitHub Release v1.0** (repo public): exe + hướng dẫn sử dụng; đăng Release là thao tác công khai nên chỉ làm khi Owner bảo ở G7.
- Đánh giá cuối dự án (thay `FINAL.md` cũ): chỉ số Phase 1–6 của 2C, ghi trong `docs/metrics/phase-6.md`.
## 8. Quyết định Owner 11/10 và câu hỏi còn lại (G1)

Đã chốt 11/10: #491 làm sau khi spec này qua G1; lượt 2 vừa kiểm phần đã sửa vừa tìm lỗi / edge case mới (§6.3); bỏ so sánh với Project-2 (Project-2 dừng; ADR-0002 Superseded, `COMPARISON.md` hết hiệu lực, ADR-0001 phụ lục M3); `Project-2C-data` ra khỏi v1.0 (§4).

Owner đồng ý (11/10): thứ tự 6A–6E như §2, phân tích bloat / hiệu năng nằm trong lượt review 1; giữ 6 gói như §6.2; S-1 và gộp backup / xung đột ra khỏi v1.0 cùng `Project-2C-data` (§4), không thêm cảnh báo khi nhập backup (phương án a). Hệ quả đã biết: làm trên hai máy vẫn là "bản nhập sau thắng" — mỗi lúc làm trên một máy, xuất trước khi đổi máy.

Không còn câu hỏi mở; chờ Owner duyệt G1.

## 9. Tách Issue

Sau G1: Issue cho 6C (lệnh dữ liệu tải + số đo nền; kịch bản trọn vòng; danh sách nghiệm thu), 6D (bước 0 mỗi lượt; tổng hợp mỗi lượt). Issue tính năng 6B tách sau khi phần spec chi tiết của từng tính năng qua G2 / G3.

6B dự kiến (số T- cấp lúc tạo Issue), theo thứ tự:

| # | Issue | Spec | risk | Ghi chú |
|---|---|---|---|---|
| B1 | S-2: hàng đợi thay dữ liệu + khóa ghi | §4.1 | high | Làm trước: khôi phục (B4) là lệnh ghi chịu khóa S2-2 |
| B2 | db: `listTrash`, lý do chặn dùng chung với `restore…`, params lỗi nêu tên | §4.2 TR-1…TR-5, E1–E16 | med | |
| B3 | Xóa KH (5f) | §4.2 TR-9 | med | Độc lập với B2, làm song song được |
| B4 | Màn Cài đặt → Thùng rác + hộp khôi phục + câu ở các hộp xóa (TR-10) | §4.2, mockup 11a–11g | med | Sau B1, B2; tách đôi nếu vượt P1 |
| B5 | Lệnh chụp ảnh hướng dẫn + kiểm link | §4.3 | low | Sau B4 |
| B6 | Nội dung hướng dẫn sử dụng (2 PR docs) | §4.3 | low | Sau B5 |
