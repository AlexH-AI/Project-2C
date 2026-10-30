# Issue và PR sửa sau lượt 3 — deep review Phase 1–6, lượt 4

Dựng ở bước chuẩn bị (`plan.md` §L4.9 bước 4), 29/10/2026 00:23 +07:00, máy `DESKTOP-KDURKJP`, bằng `gh issue view` / `gh pr view --json` trên `AlexH-AI/Project-2C`; sổ ghi chú đọc ở SHA ghim `2e51e25`. Nguyên văn thân 49 Issue của các bảng `plan.md` §L4.2 (đợt sửa lượt 3, đợt sửa sổ OPEN trước v1.0, trước vòng review) và của đợt sửa mục OPEN trước lượt 4 (T-310…T-317), cùng thân mọi PR của chúng (55 PR, gồm PR spec / golden / G5 / ghi chấp nhận đi kèm trong bảng). Mỗi thân PR có các mục "Lệch so với Issue", "Chưa làm", "Sửa sau review", "Ghi chú OPEN liên quan" khi PR có. Sau thân PR là nguyên văn các nhóm RESOLVED của `docs/state/review-notes.md` mà Issue đó gom (49 nhóm, theo nhãn T-xxx ở dòng đầu nhóm), để thử biến thể gần (`plan.md` §L4.4 bảng R2 bước 3). Tiêu đề trong thân đã hạ hai cấp để lồng dưới mục của file này; chữ giữ nguyên.

Kiểm khi dựng: Issue đều CLOSED, PR đều MERGED, commit merge của mỗi PR có trong bảng §L4.2 (đợt sửa mục OPEN: theo cột PR của sổ) và nằm trong lịch sử của `2e51e25`. Đợt sửa mục OPEN trước lượt 4: T-313, T-315, T-317 chỉ sửa quy trình (không có dòng R2, `known.md` phần 5); thân của chúng ở đây để đủ đợt.

| Đợt | Issue | Tiêu đề | PR (commit merge) | Nhóm RESOLVED |
|---|---|---|---|---:|
| Đợt sửa lượt 3 | #719 | T-268: Đồng hồ e2e cố định, test công cụ notes-core (DR6-129, 130) | #736 (`1276ccd`) | 1 |
| Đợt sửa lượt 3 | #720 | T-269: Khôi phục theo E7, mốc thời gian dạng app ghi, một hàm nhóm của ngày (DR6-104…106, 126, 134) | #740 (`33b6c33`) | 1 |
| Đợt sửa lượt 3 | #721 | T-270: Chữ và tiền: U+FEFF, nửa surrogate, hộp gửi chữ gốc, ký tự điều khiển (DR6-107…112, 126) | #738 (`d3e51d0`) | 1 |
| Đợt sửa lượt 3 | #722 | T-271: Dọn sạch: REPLACE không lách trigger, cột trỏ tới nhân sự một nơi, test tập giữ lại (DR6-113, 114, 125, 126, 132) | #742 (`213a13e`) | 1 |
| Đợt sửa lượt 3 | #723 | T-272: Câu Thùng rác của hộp 9b, focus màn Team & nhân sự (DR6-115, 116) | #744 (`e63270f`) | 1 |
| Đợt sửa lượt 3 | #724 | T-273: Chuỗi liền dài không tràn khung, panel AI vừa khung (DR6-117, 118, 127) | #746 (`3fcdd4d`) | 1 |
| Đợt sửa lượt 3 | #725 | T-274: Tên nút Hợp đồng / Thùng rác phân biệt được, e2e hộp Dọn sạch và 6f (DR6-119, 128) | #748 (`efbfa88`) | 1 |
| Đợt sửa lượt 3 | #726 | T-275: Lưu file: nhận ra mất quyền ghi lúc mở, câu lỗi file chỉ đọc (DR6-120) | #750 (`b91cc73`) | 1 |
| Đợt sửa lượt 3 | #727 | T-276: Mock trích xuất bớt đề xuất sai, gộp ghi chú OPEN của Mock (DR6-121) | #753 (`cbdb590`) | 1 |
| Đợt sửa lượt 3 | #728 | T-277: Đợt G5 lượt 3: dấu viết rời, nhận diện tin nhắn của app, chặn nhầm câu thường (DR6-122…124) | #762 (`8b5ff6f`), #766 (`405ded1`) | 2 |
| Đợt sửa lượt 3 | #729 | T-278: Tài liệu: tiền gõ dấu phẩy, ngoại lệ Dọn sạch, ví dụ chip prompt (DR6-131…133) | #755 (`4cc2a23`) | 1 |
| Đợt sửa lượt 3 | #730 | T-279: Nâng mức code-review của skill review-pr (low high, med max, high max + mọi phát hiện) | #731 (`cece0f9`) | 0 |
| Đợt sửa lượt 3 | #735 | T-280: Thanh trên cùng không che phần tử nhận focus (scroll-padding-top, WCAG 2.4.11) | #760 (`018fdc4`) | 1 |
| Đợt sửa lượt 3 | #752 | T-281: Lưu file: thư mục dữ liệu không cho tạo file vẫn báo "chương trình khác" (sau DR6-120) | #764 (`3753932`) | 1 |
| Đợt sửa lượt 3 | #756 | T-282: Tài liệu: dọn ghi chú không chặn của review PR #755 (câu help 0,500 tr, hộp 5f cũ, từ điển Thùng rác) | #758 (`da0d3c8`) | 0 |
| Đợt sửa sổ OPEN trước v1.0 | #772 | T-283: e2e và tools: helper dùng chung, đồng hồ / múi giờ, luật import, pr-status; ghi quyết định 23/10 | #792 (`f469639`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #773 | T-284: G3: mockup và token cho bốn chỗ đổi hình thức (tương phản, hộp 8d, panel mờ, dòng help 1a / 4a) | #795 (`f2465f8`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #774 | T-285: Hàm dùng chung vào packages/domain (ngày giờ, ngày ISO, bỏ dấu, chuẩn hóa so sánh, id ngẫu nhiên), API nextKycVersion | #799 (`7d5029a`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #775 | T-286: packages/db: gộp hàm lặp của lệnh, bỏ hàm chỉ test dùng (DR6-66, DR6-67) | #801 (`228acac`), #804 (`931b9b8`) | 2 |
| Đợt sửa sổ OPEN trước v1.0 | #776 | T-287: packages/db: tham chiếu nhân sự, Thùng rác / Dọn sạch, đếm RF, seed và test | #805 (`597c632`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #777 | T-288: packages/ai: hằng dùng chung với db, tách logic khỏi retry.ts, phạm vi export, version prompt trong test | #812 (`a5ff382`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #778 | T-289: Mock trích xuất: bớt đề xuất sai còn lại của review #753 | #809 (`33f7891`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #779 | T-290: packages/ai: cụm khớp trong detail, trích JSON khi bị cắt, ngưỡng test, message assistant rỗng (G4) | #820 (`ccd07d7`), #822 (`d1a75e7`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #780 | T-291: Bảy luật duyệt 23/10: hash KYC và output_json khi nhập backup, output REJECTED lớn, chữ chỉ có ký tự vô hình, ngày nhanh đầu năm, thứ tự tên, VT / FF | #824 (`cc65196`), #828 (`7cdc432`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #781 | T-292: Dùng zod/mini thay zod đầy đủ (DR6-25) | #830 (`78370a0`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #782 | T-293: Rust: storage.rs, backups không đọc được, test ai.rs, tiêu đề cửa sổ exe theo màn | #807 (`f36935e`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #783 | T-294: Trạng thái lưu: chỉ báo lưu 10d, nút Thử lại trên dải lưu lỗi, đóng app khi đang lưu | #817 (`e7a11ba`), #819 (`0e1ac42`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #784 | T-295: Cài đặt → Dữ liệu và mở file: số liệu hộp 10c, kiểm file trước migrate, thông báo section, ChatGPT web | #825 (`10b5bd7`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #785 | T-296: Thùng rác và Hợp đồng: hộp xác nhận dùng chung, tên nút theo ô, trạng thái HĐ, câu E20, hộp 8d | #833 (`b71239a`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #786 | T-297: KYC và AI: dòng thời gian theo mockup (bộ lọc, mã F), lỗi AI giữ khi đổi màn, hộp 3f, Cài đặt → AI | #835 (`f5fa622`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #787 | T-298: Hồ sơ KH và Lịch hẹn: hộp 5d, 6a / 6h, 6d, thẻ Lịch hẹn, ô ngoài tháng, focus khung Chi tiết | #838 (`49fcd2a`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #788 | T-299: Team, Báo cáo, Tổng quan: hộp nhân sự, bảng thành viên giữ cách sắp, bảng số cho chart N4–N1, bộ chọn kỳ | #841 (`b226cb9`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #789 | T-300: packages/ui và vỏ: token tương phản, DataTable, token-guard, ngưỡng nhánh, favicon, thanh trên cùng | #843 (`ff03c8a`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #790 | T-301: Dọn app: mã chết và hằng lặp (DR6-66, DR6-67 phần app), ký hiệu viết cứng (DR6-37) | #845 (`5abef68`), #846 (`1fd8e9e`) | 2 |
| Đợt sửa sổ OPEN trước v1.0 | #793 | T-302: Luật lint bắt cả import() động của @playwright/test; docsRead nhận join có ngoặc lồng và đường dẫn tách đoạn | #815 (`17601a3`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #797 | T-303: G3: mockup ô khóa và câu ngoài phạm vi của token viền ô nhập (sau T-284) | #811 (`bb29ab6`) | 1 |
| Đợt sửa sổ OPEN trước v1.0 | #831 | T-304: Luật lint chặn import zod bản đầy đủ; mặc định của schema AI là mảng mới mỗi lần parse | #837 (`4f9082a`) | 1 |
| Trước vòng review | #849 | T-305: Gom class tiêu đề / huy hiệu về classes.ts, recordBadge, WEB_MODE.tone, đồng hồ bộ chụp ảnh hướng dẫn | #855 (`fc40dfa`) | 1 |
| Trước vòng review | #850 | T-306: Tài liệu trước vòng review: spec Phase 6 (S2-6, TR-3, hộp 11i, 150 KiB), nghiệm thu (thư mục cấm tạo file, lệch mockup), gạch ngang ở hướng dẫn | #857 (`fa4023e`) | 1 |
| Trước vòng review | #851 | T-307: Số đo Phase 6 trước vòng review: bảng PR vượt ngưỡng, integrity_check theo MB, kết quả đợt sửa lượt 3 | #859 (`9f9d90e`) | 1 |
| Trước vòng review | #852 | T-308: Tên và nhận diện Heritas L-CRM: logo gốc trên nền tối viền champagne, icon, slogan | #861 (`c4eec8b`) | 0 |
| Đợt sửa mục OPEN trước lượt 4 | #865 | T-310: Mục sổ phần code trước lượt 4: HEADING còn sót, stageBadge, lang của slogan, tên app một nguồn, ảnh logo, PACKAGES | #871 (`a9fd5e6`) | 1 |
| Đợt sửa mục OPEN trước lượt 4 | #866 | T-311: Mục sổ phần tài liệu trước lượt 4: luật đếm phase-6.md, đối chiếu .brand, K21 / K31, dòng R1 CL3-A29, chữ 3 lượt | #870 (`7e720aa`) | 1 |
| Đợt sửa mục OPEN trước lượt 4 | #867 | T-312: Chụp lại toàn bộ ảnh hướng dẫn với logo mới, trước lượt 4 | #882 (`8e22542`) | 1 |
| Đợt sửa mục OPEN trước lượt 4 | #868 | T-313: Lượt 4: DeepSeek chạy qua DeepSeek Harness (DSH), DeepSeek API trả PAYG, thay OpenCode | #872 (`98a48e7`) | 1 |
| Đợt sửa mục OPEN trước lượt 4 | #876 | T-314: Mục sổ [G7] trước lượt 4: dot2.mjs clean / remove, phiên thử, bảng yêu cầu, số dư DeepSeek, ca e2e Cài đặt | #878 (`63ee94f`) | 1 |
| Đợt sửa mục OPEN trước lượt 4 | #880 | T-315: Lượt 4: DeepSeek chạy trong app desktop WorkBuddy trên gói WorkBuddy Pro, thay DSH | #881 (`aaa4f57`) | 1 |
| Đợt sửa mục OPEN trước lượt 4 | #884 | T-316: Mục sổ trước lượt 4: rightOfSidebar không phụ thuộc độ cuộn; Memory sau phiên thử, ACL ở Full Access, dòng kept của dot2.mjs | #888 (`8006780`) | 1 |
| Đợt sửa mục OPEN trước lượt 4 | #889 | T-317: Mục sổ trước lượt 4: nhánh hỏng của phiên thử dọn cả common\baseline.md, không chỉ Memory | #891 (`f44e1a9`) | 1 |

---

# Issue #719 — T-268: Đồng hồ e2e cố định, test công cụ notes-core (DR6-129, 130)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **E2E không đọc giờ máy (DR6-129):** mọi test e2e chạy trên đồng hồ trang cố định (giữa buổi sáng ngày neo `15/09/2026`), nên test bắt đầu sát nửa đêm không còn đọc ngày neo +1. Test cần qua nửa đêm tự chuyển giờ (`page.clock.fastForward` / `runFor`, như `e2e/period-picker.spec.ts`).
   - Comment `e2e/anchor.ts:3-4` ("expectations never read the machine clock") nói đúng cách làm mới.
2. **Test hở công cụ `notes-core` (DR6-130):** hai ca test: ghi chú nêu thư mục `e2e/perf/` với đích đúng thư mục đó → "Trong vùng", không vào "Trùng file"; `targetPatterns` với ngoặc nhiều nhóm (`packages/{db,domain}/src/{a,b}.ts`) mở đủ 4 đường dẫn (+ file test).
3. Gộp ghi chú OPEN cùng file (dưới): `notes-core` bỏ sót mục chứa U+2028 / U+2029, đường dẫn rút gọn khớp nhiều file; câu cổng "tested base" ở `.claude/rules/ci.md` và `CLAUDE.md`.

##### Bối cảnh

Deep review Phase 1–6 lượt 3 (T-267 #714), nhóm **L3-J**; Owner 19/10: sửa hết. Từ T-126, ngày ghim của bản dựng e2e chạy theo đồng hồ máy (`apps/desktop/src/data/app-data.ts:254-260`). 22 / 27 file spec không đặt `page.clock`, nên test vắt qua 00:00 thấy 16/09 thay 15/09. Cổng e2e của bước chuẩn bị lượt 3 có hai flaky đúng vì vậy (`full-cycle.spec.ts:178`, `team.spec.ts:458`). Làm **trước** các Issue lượt 3 có e2e, vì mọi PR sau và cổng của SHA phát hành chạy e2e.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §6.7 (DR6-129, 130), §8.2 L3-J
- `docs/reviews/raw/2026-10-21/claude/F.md` CL3-F1, CL3-F2 (kịch bản K3, K11); `docs/reviews/raw/2026-10-21/codex/F.md` CX3-F1
- `docs/reviews/raw/2026-10-21/common-baseline.md` mục "Hai test e2e flaky"
- `e2e/anchor.ts`, `e2e/support.ts`, `e2e/period-picker.spec.ts` (ca qua nửa đêm), `e2e/full-cycle.spec.ts:95-110`, `playwright.config.ts`
- `apps/desktop/src/data/app-data.ts:252-262` (T-126)
- `tools/notes-core.mjs` (`expandBraces` :18-23, `pathsNamed` :105, `openNotes` :135, `relatedNotes` :201), `tools/notes-core.test.mjs`
- `.claude/rules/ci.md:12`, `CLAUDE.md` mục "Quy trình một task" bước 5 (cổng tested base)

##### File / thư mục được phép sửa

- `e2e/**` (fixture đồng hồ chung, dòng import của các spec, `anchor.ts`)
- `playwright.config.ts` (chỉ khi cần cho fixture)
- `tools/notes-core.mjs`, `tools/notes-core.test.mjs`
- `.claude/rules/ci.md`, `CLAUDE.md` (chỉ câu cổng tested base ở bước 5)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các file trên (sổ @ `98d0016`):

- L154 `tools/notes-core.mjs:105` (`pathsNamed`: đường dẫn rút gọn khớp mọi file kết thúc bằng nó): **gộp**, lọc theo package của mục khi khớp hơn một file.
- L173 `tools/notes-core.mjs:135` (`openNotes`: `.` không khớp U+2028 / U+2029, mục bị bỏ qua): **gộp** + test.
- L176 `.claude/rules/ci.md:12`, `CLAUDE.md` bước 5 (danh sách commit của `main` sau bản đã test đọc đủ trang, đọc ít hơn `total_commits` thì chặn): **gộp** (một vế câu).
- L88 `playwright.config.ts` (`testMatch` và spec chụp ảnh): để lại, ghi chú tự nói không cần sửa code.
- Mục khớp theo glob `e2e/**` (L22, L77, L86, L87, L104, L105, L115, L129, L146, L166, L167, L209): để lại. Task chỉ đổi fixture đồng hồ và dòng import, không chạm nội dung các spec đó; L209 làm ở T-274.

##### Interface / hợp đồng

- Không đổi code sản phẩm. Hướng gợi ý: một fixture `test` chung (vd. `e2e/fixtures.ts`, `test.extend` với `page` đã `page.clock.install` trước lần mở đầu) mà mọi spec import thay `@playwright/test`. Phiên làm task chọn cách, ghi lý do ở PR.

##### Test chấp nhận

- [ ] `e2e/full-cycle.spec.ts` xanh khi bắt đầu lúc 23:59:50 giờ của trình duyệt (vd. `use.timezoneId` để nửa đêm tới giữa lần chạy, như probe `k3b` của CL3-F1), `retries: 0`; đối chứng 09:30 vẫn xanh.
- [ ] Cả bộ e2e xanh; các test vốn dùng `page.clock` (qua nửa đêm, giao thừa) vẫn xanh.
- [ ] Comment `e2e/anchor.ts` khớp cách làm mới.
- [ ] Đột biến T61f (đường dẫn thư mục tính "Trùng file") và T61k (chỉ mở nhóm ngoặc đầu) của CL3-F2 có test đỏ.
- [ ] Mục OPEN chứa U+2028 / U+2029 hiện trong `notes-for`; đường dẫn rút gọn khớp nhiều file chỉ ra các file cùng package của mục (test).

Ước lượng: ≈ 0–15 dòng `tools/` + ≈ 40–90 dòng e2e / test (dòng import của 27 spec tính riêng).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #736 — test(e2e): start every page clock on the anchor morning (T-268)

Trạng thái: MERGED · merge 2026-10-21T02:51:28Z · commit `1276ccd1ac3b573728cf2b9915d201dc5afb7a73` · nhánh `task/T-268-e2e-clock` · nhãn: type:task, risk:low

Closes #719

#### Thay đổi

- **DR6-129, đồng hồ trang cố định cho mọi test e2e** (`e2e/fixtures.ts`, mới):
  - `test` chung = `test` của Playwright, ghi đè fixture `context`: trước lần mở trang đầu, `context.clock.install({ time: ANCHOR_MORNING })` (09:30 ngày neo 15/09/2026). Mọi trang của test chạy trên đồng hồ này. Ngày e2e = ngày neo lúc mở rồi theo đồng hồ (T-126), nên không còn sang 16/09 khi nửa đêm của máy tới giữa lần chạy.
  - Vì sao `install`, không `setFixedTime`: `install` cho đồng hồ chạy tiếp theo thời gian thật từ 09:30, hẹn giờ của app chạy như thường; một test phải chạy hơn 14 giờ mới qua nửa đêm. `setFixedTime` đứng yên `Date`, dễ hỏng chỗ app đo thời gian trôi.
  - Vì sao ghi đè `context`, không `page`: đồng hồ của Playwright thuộc context (`page.clock` là đồng hồ của context), nên mọi trang của test, cả trang mở sau, đều theo.
  - Test vẫn tự đặt giờ được: gọi `install` / `setFixedTime` lần nữa chỉ đặt lại giờ (`ClockController.install` của Playwright 1.63 không cài lại). Các test qua nửa đêm / giao thừa / TR-5 vẫn tự cài 23:50 / 23:59 hay `fastForward` như cũ.
  - `e2e/fixtures.ts` xuất lại `expect`, `Locator`, `Page`, nên mỗi spec chỉ đổi đường dẫn của dòng import (`'@playwright/test'` → `'./fixtures'`): 27 spec ở `e2e/` và `e2e/perf/stats.spec.ts`.
  - **Lựa chọn `machineClock`** (mặc định `false`): đồng hồ của Playwright thay cả `performance`, không giữ entry nào, nên `seedDuration` luôn ra `undefined`. Hai spec đọc entry này đặt `test.use({ machineClock: true })`: `seed-timing.spec.ts`, `seeded-snapshot.spec.ts`. Cả hai không kiểm gì theo ngày.
  - `seedDuration` (`e2e/seeded-snapshot.ts`) nay báo lỗi khi trang không có entry `navigation` (trang chạy đồng hồ giả), thay vì đọc thành "không seed". Bỏ `machineClock` thì ca "a page load opens the data seeded beforehand" đỏ, không xanh suông.
  - Bỏ `page.clock.install({ time: ANCHOR_MORNING })` (và `reload` đi kèm) nay thừa: `appointment-outcome.spec.ts` (`cancelledOnNewYearsEve`), `customer-policies.spec.ts` (ca 8b qua giao thừa). Fixture đã cài đúng giờ đó trước lần mở đầu.
  - `e2e/fixtures.spec.ts` (mới), hai ca:
    - trang bắt đầu ở sáng ngày neo và đồng hồ chạy tiếp;
    - không spec nào lấy `test` từ `@playwright/test` (quét `e2e/**/*.spec.ts`, cách làm như `tauriImports` của `tauri-contract.test.ts`). Spec mới quên fixture thì đỏ ngay, không đợi tới lần chạy qua nửa đêm.
  - Comment `e2e/anchor.ts` theo cách làm mới.
- **DR6-130, test hở `notes-core`** (`tools/notes-core.test.mjs`):
  - ghi chú nêu thư mục `e2e/perf/`, đích đúng thư mục đó → "Trong vùng", không vào "Trùng file" (T61f);
  - `targetPatterns(['packages/{db,domain}/src/{a,b}.ts'])` → 4 đường dẫn, mỗi đường dẫn kèm file test (T61k).
- Gộp từ sổ ghi chú (mục dưới): `notes-core` đọc mục chứa U+2028 / U+2029; đường dẫn rút gọn khớp nhiều file lọc theo package của mục; vế "đọc đủ trang" của cổng tested base.
  - `openNotes`: package để lọc lấy từ đường dẫn chỉ đúng một file / thư mục của mục và mục cha. Đường dẫn rút gọn khớp nhiều file đi qua cùng luật với tên trần (`narrow`, tách từ `filesNamed`): file cùng package của mục; không có thì giữ cả khi ≤ 3 nơi, quá thì bỏ.
  - Trên sổ thật (`e32dca3`) `openNotes` cũ / mới cho cùng đường dẫn ở cả 159 mục.
  - `targetPatterns` (đích của Issue) giữ nguyên: đích rộng hơn chỉ làm hiện thêm ghi chú, không làm sót.
- Cỡ: 36 file, +167 / −52. `tools/` +25 / −11 (+41 test). Fixture và test của nó +46. Phần còn lại là dòng import của 28 spec, hai `test.use`, `seedDuration` và comment.

#### Ngoài ngoặc của Issue (P-2)

Mọi file đều trong danh sách được phép (`e2e/**`, `tools/notes-core.*`, `.claude/rules/ci.md`, câu tested base của `CLAUDE.md`). Ngoặc của `e2e/**` ghi "fixture đồng hồ chung, dòng import của các spec, `anchor.ts`"; PR sửa thêm trong `e2e/**`:

- `e2e/seeded-snapshot.ts`, `seed-timing.spec.ts`, `seeded-snapshot.spec.ts`: hai spec này đọc entry `performance`, mà đồng hồ trang làm mất. Không có `machineClock` thì một ca đỏ, một ca xanh suông.
- `appointment-outcome.spec.ts`, `customer-policies.spec.ts`: bỏ lời gọi `page.clock.install` mà fixture làm thừa.
- `e2e/fixtures.spec.ts` (mới): test của fixture và test chặn spec không dùng fixture.

#### Test chấp nhận

- [x] `full-cycle.spec.ts` xanh khi bắt đầu lúc 23:59:50 giờ của trình duyệt, `retries: 0`; đối chứng vẫn xanh.
  - Probe như k3b của CL3-F1: config ngoài repo, chỉ `full-cycle.spec.ts`, `retries: 0`, bản dựng e2e của `e2e/serve.mjs`. Trình duyệt (`use.timezoneId`) và tiến trình test (`TZ`) cùng một múi, chạy đúng lúc máy ở múi đó là 23:59:45, như một máy ở múi đó chạy lúc ấy.
  - Trước khi sửa (`full-cycle.spec.ts` còn import `@playwright/test`), America/Noronha, test bắt đầu 23:59:46: **đỏ** ở `full-cycle.spec.ts:105`, bước "the data shows the same as before the export", nhận `Đang xem: Tháng 09/2026MTD 01/09 – 16/09/2026 · Team (4 team)`. Trùng từng chữ CL3-F1 và flaky của cổng lượt 3.
  - Sau khi sửa, America/St_Johns, test bắt đầu 23:59:46, xong 00:00:02: **xanh** 15,3 s. Cộng thời lượng các bước: reload xong ≈ 23:59:59, bước so sánh cuối bắt đầu ≈ 00:00:00,6. Đây đúng là khoảng bản cũ đỏ (bản cũ: reload xong 23:59:58, bước cuối bắt đầu 23:59:59,7).
  - Đối chứng Asia/Ho_Chi_Minh, 09:22: xanh 15,2 s.
- [x] Cả bộ e2e xanh: `pnpm e2e` 249 passed, 3,0 phút (`main` trước PR, cùng máy: 247 passed, 3,6 phút). Các test vốn dùng `page.clock` đều xanh: qua nửa đêm của `period-picker`, `demo-data`; TR-5 của `trash`; giao thừa của `appointment-outcome`, `customer-policies`.
  - Đột biến e2e, chạy từng spec, đều đỏ:
    - bỏ `machineClock` ở `seeded-snapshot` hay `seed-timing` → `seedDuration` báo lỗi;
    - fixture không cài đồng hồ → "a page starts on the anchor morning" đỏ;
    - `setFixedTime` thay `install` → "… and its clock runs on" đỏ.
  - Lúc `full-cycle.spec.ts` còn import cũ (để chạy probe trước khi sửa), ca "every spec takes its test from fixtures.ts" đỏ và nêu đúng `full-cycle.spec.ts`.
- [x] Comment `e2e/anchor.ts` khớp cách làm mới.
- [x] Đột biến T61f, T61k có test đỏ: áp từng đột biến vào `notes-core.mjs` rồi chạy `notes-core.test.mjs`, mỗi đột biến bị đúng test của nó giết. Thêm 4 đột biến cho phần sửa (bỏ cờ `s`; bỏ lọc đường dẫn rút gọn; lấy package từ mọi đường dẫn; bỏ ưu tiên file ở gốc repo): 6 / 6 bị giết.
- [x] Mục OPEN chứa U+2028 / U+2029 hiện trong `notes-for`; đường dẫn rút gọn khớp nhiều file chỉ ra các file cùng package của mục (test).

#### Ghi chú OPEN liên quan

- L22 (#163: 6a badge, 6h "Các lần hẹn trước", e2e "Xem tất cả" > 5 lịch): để lại. PR chỉ đổi dòng import của `appointments.spec.ts`.
- L77 (`customer-forms.spec.ts:245`, số RF / KYC của 5f dạng `\d+`): để lại. PR chỉ đổi dòng import.
- L115 (NIT `SettingsTrash.tsx:166`, `useCallback(…, [today])`): để lại. PR không sửa `SettingsTrash.tsx`, chỉ đổi dòng import của `trash.spec.ts`.
- L146 (Chỉ ghi lại: PR #669 sửa `navigation.spec.ts` ngoài ngoặc của Issue #654): để lại. Chỉ ghi lại; PR này chỉ đổi dòng import.
- L152 (`notes-core.mjs:105`, đường dẫn rút gọn khớp mọi file kết thúc bằng nó): đã sửa. Khớp hơn một file thì lọc theo package của mục như tên trần.
- L164 (Mùi: `aboutTheKh` chia câu hai lần; khối "Hiện thêm" chép ở `customer-ai-web.spec.ts` / `customer-ai.spec.ts`): để lại. Phần `mock-adapter.ts` ngoài phạm vi (T-276); khối e2e ghi chú hẹn tới "khi có nơi thứ ba", PR không thêm nơi nào, chỉ đổi dòng import.
- L171 (`openNotes`, `.` không khớp U+2028 / U+2029): đã sửa. Regex mục có cờ `s`, kèm test.
- L174 (`.claude/rules/ci.md:12`, `CLAUDE.md` bước 5: danh sách commit của `main` sau bản đã test đọc đủ trang): đã sửa. Thêm vế này ở cả hai nơi.
- L205 (`trash.spec.ts` chưa có test giao diện nhánh `refused`): để lại. Đã gộp vào #725 (T-274); PR này chỉ đổi dòng import.

#### Chỉ ghi lại (không chặn)

- `ANCHOR_MORNING` là 09:30 theo múi giờ của tiến trình test. Cấu hình nào đặt `use.timezoneId` khác múi của máy thì đồng hồ trang bắt đầu ở giờ khác trong ngày. Ví dụ máy UTC+7, trình duyệt UTC−2:30: trang bắt đầu lúc 00:00. `playwright.config.ts` không đặt `timezoneId`. Config chụp ảnh hướng dẫn (`playwright.guide.config.ts`) đặt `Asia/Ho_Chi_Minh`, trùng múi máy của anh. Probe như trên phải đặt `TZ` cùng múi với trình duyệt.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (3 163 test)
- [x] `pnpm e2e` toàn bộ xanh ở local (249 test)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-268 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #678, #686, #689 — T-268 (#719, PR #736, `REVIEW: PASS` @`582e822`):
  - #678, `tools/notes-core.mjs:105` (`pathsNamed`): đường dẫn rút gọn khớp nhiều file nay qua cùng luật với tên trần (`narrow`): giữ file cùng package của mục / mục cha; không có thì giữ khi ≤ `MAX_PLACES` nơi, quá thì bỏ. Package để lọc chỉ lấy từ đường dẫn chỉ đúng một file / thư mục. Test ở `tools/notes-core.test.mjs`.
  - #686, `tools/notes-core.mjs:135` (`openNotes`): regex mục có cờ `s`, nên mục chứa U+2028 / U+2029 hiện trong `notes-for`; có test.
  - #689, `.claude/rules/ci.md:12`, `CLAUDE.md` bước 5: thêm vế danh sách commit của `main` sau bản đã test đọc đủ trang; đọc ít hơn `total_commits`, hoặc GitHub không trả số này, thì chặn (khớp `tools/pr-core.mjs:178`).

---

# Issue #720 — T-269: Khôi phục theo E7, mốc thời gian dạng app ghi, một hàm nhóm của ngày (DR6-104…106, 126, 134)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **Khôi phục đi đường E7 dù KH tới nhóm sau vào ngày sau (DR6-104):** ở nhánh khôi phục "KH đã ở nhóm sau cuộc gặp" (`move.to === null`), chuyển nhóm sống mới nhất mang ngày **sau** ngày cuộc hẹn → từ chối `TRANSITION_BEFORE_LATEST {date}` như E6, đúng TR-3 / bảng E7. Hiện code chỉ kiểm `isStageOfDay`. Dòng Thùng rác (`listTrash`) theo cùng luật.
2. **Mốc thời gian dạng app ghi (DR6-105, phần còn của DR6-69):** luật nhập chỉ nhận mốc thời gian đúng dạng app ghi (`toISOString()`, 3 chữ số phần nghìn giây, `Z`), vd. `z.iso.datetime({ precision: 3 })`.
   - Đóng hai chỗ so chữ: `transitionWithdrawnAt` ghép mốc xóa bằng `eq(deletedAt, at)`, và Thùng rác xếp "mới xóa nhất trên" bằng so chữ.
   - Đúng lời hứa của #652 mục 2 ("đúng cả khi … file có mốc không phần nghìn giây").
3. **"R rồi X cùng ngày" (DR6-106), Q1 (a) Owner 21/10:** giữ hành vi. Thêm vào TR-3 câu: "chuyển nhóm được đưa lại khi khôi phục giữ chỗ của nó trong thứ tự ghi; khôi phục theo thứ tự đã ghi thì được, ngược lại bị chặn như E20". Test ghim cả hai thứ tự.
4. **Luật "nhóm của ngày" một nơi (DR6-134):** "trước ngày tạo KH, nhóm của ngày = nhóm tạo KH" (DR-43, K22) hiện viết ba lần: SQL `stageOnDay`, `isStageOfDay`, `outcome-form.ts:106`. Gộp thành một hàm thuần dùng cho lệnh, luật nhập 4 và hộp 6c / 6f, như `meetingKeepingMove` của DR6-103.
5. **Test hở (DR6-126 a, b, d):**
   - nhánh "nhóm tạo KH" khi KH đã đổi nhóm sau ngày tạo (V68e);
   - `latest.seq < withdrawn.seq` của `reinstateTransition` (S05, chuỗi `p07`);
   - `ORDER BY date` của `liveAppointmentsOf` (`la-no-order`).

##### Bối cảnh

Deep review Phase 1–6 lượt 3 (T-267 #714), nhóm **L3-A**; Owner 19/10 sửa hết, 21/10 đồng ý Q1 (a). DR6-69 là DR6 duy nhất của bảng R lượt 3 chấm SỬA MỘT PHẦN (tổng hợp §3.1). Dữ liệu giả lập: luật nhập siết thì nạp lại (K1, quy tắc R2-02); app luôn ghi mốc dạng `toISOString()` nên dữ liệu tải / seed không đổi.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §3.1 (DR6-69), §6.1 (DR6-104…106), §6.7 (DR6-126), §6.8 (DR6-134), §8.2 L3-A, §9 Q1
- `docs/reviews/raw/2026-10-21/claude/A.md` CL3-A2, A13, A14, A19, A20, A21, A26, A28; `docs/reviews/raw/2026-10-21/codex/A.md` kịch bản 11
- `docs/design/phase-6-hoan-thien.md` §4.2 (TR-3, bảng E5–E8, E18–E20)
- `docs/design/phase-3-du-lieu.md` §6 (luật nhập 4, 10)
- `packages/db/src/appointments.ts` (`restoreAppointment`, `checkRestoreAppointment`, `restoreStageMove` :275-335)
- `packages/db/src/customers.ts` (`stageOnDay`, `isStageOfDay` :326-365; `liveAppointmentsOf`, `meetingKeepingMove` :395-455; `transitionWithdrawnAt`, `reinstateTransition` :455-505)
- `packages/db/src/backup-validation.ts` (`timestamp` :30, luật 4 :211-245), `packages/db/src/trash.ts` (`listTrash` :176-190)
- `apps/desktop/src/routes/appointments/outcome-form.ts` (`meetingDay`, `editedDay`, `outcomeLock`)

##### File / thư mục được phép sửa

- `packages/db/src/{appointments,customers,backup-validation,trash,index}.ts` và test cạnh chúng (`appointments.test.ts`, `customers.test.ts`, `trash.test.ts`, `backup-invariants.test.ts`, `backup.test.ts`)
- `apps/desktop/src/routes/appointments/{outcome-form.ts,outcome-form.test.ts}`
- `docs/design/phase-6-hoan-thien.md` (câu TR-3 của Q1 a), `docs/design/phase-3-du-lieu.md` §6 (dòng luật mốc thời gian, nếu chữ đổi)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `98d0016`):

- L136 `customers.ts:438` (`liveAppointmentsOf` đọc mọi lịch sống mỗi lần rút chuyển nhóm): để lại, rẻ (+0,08 ms, tổng hợp §7.2); task chỉ thêm test thứ tự.
- L138, L139 (chỗ đặt luật D7, phần chữ chung của 6f / 6g): để lại, chỉ ghi lại.
- L10 (`kyc_versions.hash` khi nhập), L42 (`isoDate` lặp `validDate`), L64 (phạm vi export), L74 (`trash.ts` `refs` đọc cả bảng), L126 (`createCustomer` kiểm nhóm hai lần), L169 (`optionalText`): để lại, ngoài phạm vi.
- L201 (`keptRecords`, nêu `trash.ts`): làm ở T-271.
- L219 (DR6-25 `zod`), L221 (DR6-66): để lại, hoãn sau v1.0.

##### Interface / hợp đồng

- Mã lỗi giữ nguyên (`TRANSITION_BEFORE_LATEST`, `STAGE_NOT_ON_DAY`, `BACKUP_INVALID`). Không đổi schema, không migration.
- Hàm "nhóm của ngày" export qua `@p2c/db` nếu màn dùng; bản SQL `stageOnDay` có thể thay bằng đọc chuyển nhóm + hàm thuần.

##### Test chấp nhận

- [ ] Ca A của CL3-A2 (KH N2 01/10 → chuyển tay N3 05/10 → cuộc gặp 05/10 N3 → N2 → xóa → chuyển tay N3 → N2 07/10): khôi phục bị từ chối `TRANSITION_BEFORE_LATEST {07/10/2026}`, dòng Thùng rác `blocked` cùng lý do. Ca B (nhóm sau tới giữa ngày rồi rời) cũng vậy. E7 đúng spec (chuyển tay cùng ngày cuộc hẹn) vẫn khôi phục được.
- [ ] File có mốc `created_at` / `updated_at` / `deleted_at` không đúng dạng app ghi (không phần nghìn giây, hoặc hai mốc xóa cùng thời điểm khác dạng như CL3-A28) → `BACKUP_INVALID`; file do app xuất vẫn nhập được; hash `tables` của dữ liệu tải không đổi.
- [ ] Chuỗi "R rồi X cùng ngày" (CL3-A19): khôi phục R rồi X được; X rồi R bị chặn như E20 (test ghim); câu TR-3 mới có trong spec.
- [ ] Một hàm "nhóm của ngày" cho lệnh, luật nhập 4, hộp 6c / 6f; ca KH tạo N3 10/09, chuyển tay N2 12/09, lịch 05/09: ghi bù giữ N3 được, N2 vẫn D10, khôi phục và nhập lại được (đột biến V68e có test đỏ).
- [ ] Chuỗi `p07` của CL3-A14 (đột biến S05 có test đỏ); cuộc gặp giữ nhóm ghi trước mà ngày sau → câu chặn nêu ngày sớm hơn (`la-no-order` có test đỏ).

Ước lượng: ≈ 15–30 dòng SP + ≈ 150 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med

##### Bị chặn bởi

Không

## PR #740 — fix: restore by E7 only from the meeting day, stamps as the app writes them (T-269)

Trạng thái: MERGED · merge 2026-10-21T07:06:02Z · commit `33b6c33aab719f56d9d84298960c2da7a89c2722` · nhánh `task/T-269-restore-e7-stage-of-day` · nhãn: type:task, risk:med

Closes #720

#### Thay đổi

- **DR6-104, khôi phục theo E7** (`checkRestoreAppointment`, `packages/db/src/appointments.ts`): nhánh "KH đã ở nhóm sau cuộc gặp" (`move.to === null`) nay xét thêm ngày của chuyển nhóm sống mới nhất. Ngày đó sau ngày cuộc hẹn → `TRANSITION_BEFORE_LATEST {ngày đó}` như E6, kể cả khi nhóm sau cũng là nhóm đầu ngày cuộc hẹn hoặc nhóm KH tới rồi rời ngay trong ngày (ca A / B của CL3-A2).
  - Qua bước này thì nhóm cuối ngày cuộc hẹn chính là nhóm hiện tại (= nhóm sau), nên nhánh E7 không còn ra `STAGE_NOT_ON_DAY`. Biểu thức `move ? … : …` cũ bỏ đi: `STAGE_NOT_ON_DAY` chỉ còn ở cuộc gặp giữ nhóm.
  - Dòng Thùng rác theo cùng luật vì `listTrash` gọi đúng hàm này. Câu của màn không đổi: lý do E7 luôn mang ngày sau ngày lịch, nên vẫn là câu "sau ngày cuộc hẹn này" (ghi chú sổ về `reasonSentence` vẫn đúng).
- **DR6-105, mốc thời gian dạng app ghi** (`packages/db/src/backup-validation.ts`): `created_at` / `updated_at` / `deleted_at` chỉ nhận `z.iso.datetime({ precision: 3 })`, tức đúng 3 chữ số phần nghìn giây và `Z` như `toISOString()`. Đã thử: `…01Z`, `.5Z`, `.123456Z`, `+07:00` đều bị từ chối.
  - Một thời điểm luôn là một chuỗi, nên hai chỗ so chữ đúng mà không phải sửa: `transitionWithdrawnAt` (`eq(deletedAt, at)`) và thứ tự "mới xóa nhất trên" của `listTrash`. Doc comment ở hai chỗ nêu lý do.
  - `exportedAt` của phong bì giữ `z.iso.datetime()`: không chỗ nào so sánh nó, và `backup.ts` ngoài danh sách file của Issue.
- **DR6-106, "R rồi X cùng ngày" (Q1 a, Owner 21/10)**: giữ hành vi. Câu TR-3 mới ở spec Phase 6, ngay sau câu "Sau lúc xóa" của E20. Hai test ghim hai thứ tự: theo thứ tự đã ghi thì khôi phục được, kết quả như khi ghi R rồi X và không xóa gì; ngược lại bị chặn như E20.
- **DR6-134, một hàm "nhóm của ngày"**: `stagesOfDay(transitions, date)` (`packages/db/src/customers.ts`, export qua `@p2c/db`) trả các nhóm KH có trong ngày, theo thứ tự: nhóm đầu ngày, rồi nhóm sau mỗi chuyển nhóm của ngày. Luật DR-43 ("tới ngày tạo KH, nhóm đầu ngày là nhóm tạo KH") chỉ còn viết ở đây. Ba bản cũ bị thay:
  - `stageOnDay` (SQL, bỏ): `applyOutcome` dùng `stagesOfDay(listStageTransitions(…), date).at(-1)`;
  - `isStageOfDay` (bỏ): khôi phục, `meetingKeepingMove` và luật nhập 4 dùng `.includes(stage)`;
  - `meetingDay` của hộp 6c / 6f (`apps/desktop/src/routes/appointments/outcome-form.ts`): `stagesOfDay(own, day).at(-1)` thay `stageOn(…) ?? own[0]?.to`.
- **DR6-126 (a, b, d), test hở**:
  - (a) Ca DR6-68 chạy thêm biến thể "KH tạo N3 10/09, chuyển tay N2 12/09, lịch 05/09": ghi bù giữ N3 được, N2 vẫn D10 `{12/09/2026}`, khôi phục và nhập lại được.
  - (b) Chuỗi `p07` của CL3-A14: khôi phục ghi chuyển nhóm mới sau hai chuyển tay 04/10, và `validateBackupInvariants` nhận dữ liệu đó.
  - (d) Cuộc gặp giữ nhóm ngày 14/01 được đặt và ghi trước cuộc gặp ngày 12/01: câu chặn nêu ngày 12/01.
- **Spec Phase 3 §6** (`docs/design/phase-3-du-lieu.md`): dòng mốc thời gian ghi đúng dạng `toISOString()` và lý do; luật 4 đổi tên hàm sang `stagesOfDay`; dòng tên / ghi chú KYC ghi đủ ký tự vô hình như §4, có ký tự điều khiển (ghi chú L218).
- Cỡ: 14 file, +262 / −97. Code sản phẩm +52 / −60, test +205 / −32, spec +4 / −4. `packages/db/CLAUDE.md` do `pnpm codemap` sinh.

#### Test chấp nhận

- [x] Ca A của CL3-A2 (KH N2, chuyển tay N3 ngày 05/10, cuộc gặp 05/10 N3 → N2, xóa, chuyển tay N2 ngày 07/10): khôi phục bị từ chối `TRANSITION_BEFORE_LATEST {07/10/2026}`, dòng Thùng rác `blocked` cùng lý do. Ca B (KH tới N2 giữa ngày 05/10 rồi rời) cũng vậy. E7 đúng spec (chuyển tay cùng ngày cuộc hẹn) vẫn khôi phục được (test cũ).
- [x] Mốc không đúng dạng app ghi (không phần nghìn giây, 1 chữ số, 6 chữ số, có offset) ở cả ba cột → `BACKUP_INVALID`. Ca CL3-A28 (chuyển nhóm cuộc gặp đã rút, mốc xóa viết lại 6 chữ số, cùng thời điểm) → `BACKUP_INVALID`. File do app xuất vẫn nhập được (mọi test nhập hiện có, dữ liệu demo và dữ liệu tải). Hash `tables` của dữ liệu tải không đổi (mục dưới).
- [x] Chuỗi "R rồi X cùng ngày" (CL3-A19): khôi phục R rồi X được; X rồi R bị chặn như E20 (`TRANSITION_BEFORE_LATEST {05/10/2026}`). Câu TR-3 mới có trong spec.
- [x] Một hàm "nhóm của ngày" cho lệnh, luật nhập 4 và hộp 6c / 6f, có unit test riêng. Ca KH tạo N3 10/09, chuyển tay N2 12/09, lịch 05/09: ghi bù giữ N3 được, N2 vẫn D10, khôi phục và nhập lại được.
- [x] Đột biến có test đỏ: em áp từng đột biến vào file thật, chạy file test của nó, rồi trả lại.
  - V68e (nhóm đầu ngày trước ngày tạo lấy chuyển nhóm cuối): 9 test đỏ, gồm biến thể mới của ca DR6-68.
  - S05 (bỏ `latest.seq < withdrawn.seq`): test `p07` đỏ.
  - `la-no-order` (bỏ `ORDER BY date`): test 12/01 đỏ.
  - Gỡ phần sửa: bỏ kiểm ngày của nhánh E7 (3 đỏ, gồm ca 10/10 cũ, vì nhánh đó nay ra `STAGE_NOT_ON_DAY`); bỏ `precision: 3` (4 đỏ); bỏ DR-43 trong `stagesOfDay` (4 đỏ, ở lệnh, luật nhập và hộp 6c).

#### Dữ liệu tải

`node tools/load-data.mjs` (neo 2026-10-12, seed 6): `tables` sha256 trước và sau PR đều là `1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f`, bằng mốc của PR #738. File sinh ra có 78 947 mốc, tất cả đúng dạng `toISOString()`, và nhập lại được bằng luật nhập mới (`importBackup`, ≈ 1,0 s trong Node; Thùng rác 113 dòng). `DEMO_HASH` của seed demo không đổi (`seed.test.ts`).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `4b22b25`), 14 mục "Trùng file":

- L10 (`kyc_versions.hash` sai vẫn nhập được): để lại, ngoài phạm vi. PR chỉ đổi luật mốc thời gian và tên hàm của luật 4.
- L41 (`isoDate` của `ai` lặp `validDate`): để lại, ngoài phạm vi (chạm `packages/ai/src/schema.ts`, `period.ts`).
- L63 (phạm vi export của `run.ts` qua `index.ts` của `@p2c/ai`): để lại, ngoài phạm vi. PR chỉ thêm `stagesOfDay` vào `index.ts` của `@p2c/db`.
- L73 (`refs` của `trash.ts` đọc cả ba bảng): để lại, ngoài phạm vi. PR chỉ thêm comment ở phần sắp xếp.
- L125 (`createCustomer` kiểm nhóm hai lần): để lại, ngoài phạm vi.
- L135 (`liveAppointmentsOf` đọc mọi lịch sống): để lại, chi phí nhỏ (+0,08 ms, tổng hợp §7.2). PR chỉ thêm test thứ tự (`la-no-order`).
- L137 (luật D7 của lệnh nằm ở `withdrawAppointmentTransition`): để lại, chỉ ghi lại.
- L138 (khung "Khi lưu" của 6f dùng chung chữ với 6g): để lại, chỉ ghi lại.
- L164 (`optionalText` không gỡ ký tự vô hình): để lại, ngoài phạm vi (`common.ts` ngoài danh sách file).
- L166 (`randomText` lặp ở `backup.test.ts` / `text.test.ts`): để lại, chỉ ghi lại. Hai package khác nhau; PR không chạm `randomText`.
- L191 (`KEPT_APPOINTMENTS` quét mọi lịch hẹn mỗi lần `listTrash`): để lại, làm ở T-271 (#722, `purge.ts`).
- L218 (tài liệu chưa theo K25 mới): sửa phần `phase-3-du-lieu.md:218`. Dòng §6 nay nêu đủ ký tự vô hình như §4, có ký tự điều khiển. Phần `phase-5-prompts.md:594` (G5) và doc comment `visible` của `packages/ai/src/schema.ts` để lại, vì ngoài danh sách file (hợp với PR docs G5 §12 của #728).
- L223 (DR6-25, `zod/mini`): để lại, hoãn sau v1.0.
- L225 (DR6-66, hàm chỉ test dùng): để lại, hoãn sau v1.0.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (coverage: lệnh 99,06 %, nhánh 97,05 %)
- [x] `pnpm e2e` xanh ở local: 251 passed, 3,2 phút
- [x] Không thêm dependency
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Màn không đổi chữ, không đổi bố cục: hộp 6c / 6f đọc nhóm của ngày bằng hàm mới với cùng kết quả, Thùng rác chỉ chặn thêm ca của DR6-104. E2E phủ các màn này nên em không chụp ảnh.

Rủi ro: `risk:med` (G2: câu TR-3 Owner duyệt 21/10, Q1 (a)). Không cần `build-exe` (không chạm `src-tauri`, Cargo, `package.json`, cấu hình build).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-269 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #738 — T-269 (#720, PR #740, `REVIEW: PASS` @`1c2ad22`):
  - #738, `docs/design/phase-3-du-lieu.md:218` (§6, dòng tên / ghi chú KYC; phần này của mục "Tài liệu chưa theo tập K25 mới"): nay nêu đủ ký tự vô hình như §4 (ký tự định dạng, `Default_Ignorable_Code_Point`, U+2800, ký tự điều khiển không phải khoảng trắng). Hai phần còn lại của mục vẫn OPEN.

---

# Issue #721 — T-270: Chữ và tiền: U+FEFF, nửa surrogate, hộp gửi chữ gốc, ký tự điều khiển (DR6-107…112, 126)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **U+FEFF đầu chuỗi khi nhập backup (DR6-107):** `valueOf` từ chối chuỗi bắt đầu bằng U+FEFF (`BACKUP_INVALID`, cùng lý do NUL / nửa surrogate: sql.js bỏ BOM đầu chuỗi khi đọc nhưng byte ở lại). Không đặt vào `isStorableText`: lệnh vẫn bỏ U+FEFF như K25. `storedRawOutput` bỏ U+FEFF đầu chuỗi, không để thành chuỗi rỗng (CHECK độ dài 1..20 000).
2. **Nửa surrogate lẻ trong `raw_output` (DR6-108):** `storedRawOutput` thay mọi `\p{Cs}` bằng U+FFFD trước khi cắt, như NUL.
3. **Hộp gửi chữ gốc (DR6-109):** 5a / 5c / 7a gửi lệnh chữ người dùng gõ; `normalizeText` / `normalizeNote` chỉ để kiểm rỗng, như hộp team / nhân sự và spec Phase 3 §6 dòng 175.
4. **Ô tiền / ngày đọc chữ đã chuẩn hóa (DR6-110):** `parseVnd`, `parseQuickDate` (và ngày sinh) đọc trên `normalizeText(text)`, một chỗ ở `domain`. Số / ngày dán kèm ký tự vô hình hay U+0085 đọc như dòng đọc lại tiền KYC (DR6-101).
5. **Ký tự điều khiển C0 / C1 (DR6-111), Q2 (a) Owner 21/10:** `normalizeText` bỏ mọi `\p{Cc}` còn lại (không phải White_Space; tab, xuống dòng vẫn gộp như nay). Lệnh, nhập backup, UI cùng hàm; V3–V6 (G5 §11.2) nhận luôn. Spec Phase 3 §6 dòng 175 ghi luật K25 đủ (gộp ghi chú OPEN L172).
6. **`byName` (DR6-112):** hai tên khác nhau không bao giờ bằng nhau ("Team 01" / "Team 1", chữ số toàn khổ): phân xử hòa bằng so mã; doc comment khớp.
7. **Test hở chữ / tiền (DR6-126 e, f):** CR đứng một mình, NFC chứ không NFKC, thứ tự "kiểm storable trước, chuẩn hóa sau"; `parseVnd` gom khoảng trắng; `normalizeKycValue` chỉ nhận chữ toàn chữ số.

##### Bối cảnh

Deep review Phase 1–6 lượt 3 (T-267 #714), nhóm **L3-B**; Owner 19/10 sửa hết, 21/10 đồng ý Q2 (a), tức mở rộng K25 (G2 đã duyệt ở câu trả lời). Dữ liệu giả lập: luật siết thì nạp lại (K1, quy tắc R2-02); nếu hash `tables` của dữ liệu tải đổi, ghi hash mới vào PR.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §6.2 (DR6-107…112), §6.7 (DR6-126), §8.2 L3-B, §9 Q2
- `docs/reviews/raw/2026-10-21/claude/A.md` CL3-A4…A8, A16, A17, A24 (probe `r-repro\bom-check`, `p24`, `v-A6-refute\p1-web-path`, `f-text\t03`–`t05`)
- `docs/design/phase-3-du-lieu.md` §6 dòng 175 (K20 / K25); quyết định K25 (`docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §9 Q4)
- `packages/domain/src/{text,money,period,name-order}.ts` và test
- `packages/db/src/backup.ts` (`valueOf` :184-197), `packages/db/src/ai-analyses.ts` (`storedRawOutput` :178-185), `packages/db/src/common.ts` (`cleanText`, `cleanNote`)
- `apps/desktop/src/routes/customers/CustomerDialogs.tsx:220-245`, `KycDialogs.tsx:248-268`, `customers-view.ts` (ngày ghi, ngày sinh)

##### File / thư mục được phép sửa

- `packages/domain/src/{text,money,period,name-order}.ts` và test cạnh chúng
- `packages/db/src/{backup,ai-analyses,common}.ts` và test cạnh chúng (`backup.test.ts`, `ai-analyses.test.ts`, `common.test.ts`, `backup-invariants.test.ts`, test lệnh có tên / KYC)
- `apps/desktop/src/routes/customers/{CustomerDialogs.tsx,KycDialogs.tsx,customers-view.ts,customers-view.test.ts}`
- `e2e/customer-forms.spec.ts`, `e2e/customer-kyc.spec.ts` (ca hộp gửi chữ gốc)
- `docs/design/phase-3-du-lieu.md` §6 dòng 175

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `98d0016`):

- L172 `docs/design/phase-3-du-lieu.md:175` (còn luật K20 cũ): **gộp** (mục tiêu 5).
- L17 `backup.ts` `load` (statement `prepare` không `free()`): **gộp**, một dòng.
- L125 `text.ts:24` (bỏ ZWJ / ZWNJ tách emoji ghép): để lại, đúng luật Owner (K20 / K25).
- L169 `common.ts:59` (`optionalText` chỉ `trim`): để lại; ghi chú lịch hẹn ngoài tập tên / KYC của K25, đổi cần Owner.
- L170 `text.ts:39` (VT, FF không tách dòng): để lại, Q2 (a) giữ khoảng trắng như nay.
- L171 (`randomText` lặp ở hai test, hai package): để lại, chỉ ghi lại.
- L195 (G5 §11.8, `output_json` nhập backup): để lại, cần G2.
- L205 (`rowsOf` lặp `selectRows`): làm ở T-271.
- L14 (`valueOf` chỉ cột integer / text), L24 (5d), L37, L41, L42 (`period.ts`), L47 (3f), L113 (test migration `ai_analyses`): để lại, ngoài phạm vi.
- L219 (DR6-25), L221 (DR6-66): để lại, hoãn sau v1.0.

##### Interface / hợp đồng

- Không mã lỗi mới, không đổi schema, không migration. `parseVnd` / `parseQuickDate` giữ chữ ký.

##### Test chấp nhận

- [ ] Nhập backup có U+FEFF đầu chuỗi ở cột chữ (tên team, ghi chú KYC, ngày lịch hẹn, id) → `BACKUP_INVALID`; U+FEFF giữa / cuối chuỗi như nay; lệnh vẫn bỏ U+FEFF.
- [ ] `recordAiAnalysis` với `rawOutput` có nửa surrogate lẻ (đầu, cuối, sát 20 000 ký tự) → đọc lại đúng chữ đã lưu (U+FFFD); xuất → nhập lại được.
- [ ] Hộp 5a / 7a: tên / ghi chú `"\uD83D​\uDE00 Lan"` → lỗi `INVALID_TEXT` như hộp team (e2e); tên thường vẫn lưu như cũ.
- [ ] `"500tr​"`, `"500\^E000\^E000"`, `"5⠀tr"`, `"1tr⁠5"` ở ô FYP / case size đọc được; `"12/10​"` ở ô ngày đọc được; cùng kết quả dòng đọc lại tiền KYC.
- [ ] Q2 (a): "Sao Mai" + U+0007 trùng "Sao Mai" (`TEAM_NAME_TAKEN`); tên / giá trị KYC chỉ gồm ký tự điều khiển → rỗng; luật nhập cùng hàm; spec Phase 3 dòng 175 ghi luật mới.
- [ ] `byName('Team 01', 'Team 1') !== 0`, thứ tự ổn định khi hòa theo collator.
- [ ] Đột biến `nn-crlf-only`, `nn-no-cr`, `x-nfkc`, T7, T8, MO8, KF3 của CL3-A16, A17 có test đỏ.

Ước lượng: ≈ 15–30 dòng SP + ≈ 120 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med

##### Bị chặn bởi

#719 (fixture đồng hồ e2e)

## PR #738 — fix: store and read text as the screens show it (T-270)

Trạng thái: MERGED · merge 2026-10-21T05:10:48Z · commit `d3e51d039a1da1f5fcf894797b554b3ad3277608` · nhánh `task/T-270-text-money` · nhãn: type:task, risk:med

Closes #721

#### Thay đổi

- **DR6-107, U+FEFF đầu chuỗi khi nhập backup** (`packages/db/src/backup.ts`): `valueOf` từ chối chữ bắt đầu bằng U+FEFF (`BACKUP_INVALID`), cùng chỗ và cùng lý do với NUL / nửa surrogate lẻ (sql.js đọc lại bỏ U+FEFF đầu chuỗi, SQLite giữ byte cho chỉ mục duy nhất và phép so SQL).
  - Không đặt vào `isStorableText`: lệnh vẫn bỏ U+FEFF như K25 (test ghim cả hai).
  - U+FEFF giữa / cuối chuỗi như nay: đọc lại đủ, nên không chặn ở `valueOf` (test ghi chú lịch hẹn mang U+FEFF giữa và cuối vẫn nhập được, đọc lại nguyên).
  - `storedRawOutput` (`packages/db/src/ai-analyses.ts`) bỏ dãy U+FEFF ở đầu chuỗi. Bỏ cả dãy vì mỗi lần đọc sql.js chỉ bỏ một U+FEFF, chuỗi bắt đầu bằng hai U+FEFF sẽ còn một và bị luật nhập từ chối. Không còn gì thì lưu một U+FFFD: CHECK độ dài 1..20 000, REJECTED không bao giờ rỗng. `EMPTY_RAW_OUTPUT` nằm ở `packages/ai/src/run.ts`, `db` không import được (`db-only-on-domain-and-ai-schema`).
- **DR6-108, nửa surrogate lẻ trong `raw_output`**: `storedRawOutput` thay mọi `\p{Cs}` bằng U+FFFD trước khi cắt 20 000 code point, như NUL. Một regex cho NUL và `\p{Cs}` (lib ES2023, không dùng `toWellFormed`).
- **DR6-109, hộp 5a / 5c / 7a gửi chữ gốc** (`CustomerDialogs.tsx`, `KycDialogs.tsx`): `normalizeText` / `normalizeNote` chỉ còn để kiểm rỗng, như hộp team / nhân sự và spec Phase 3 dòng 175. Lệnh nhận chữ người dùng gõ, kiểm lưu được trước rồi mới chuẩn hóa, nên hai nửa của emoji bị U+200B tách ra → `INVALID_TEXT`, không ghép thành 😀.
- **DR6-110, ô tiền / ngày đọc chữ đã chuẩn hóa**: `parseVnd`, `parseQuickDate` đọc trên `normalizeText(text)`, một chỗ ở `domain`; `parseBirthDate` (`customers-view.ts`) cũng vậy. Chữ ký giữ nguyên.
  - `parseVnd` bỏ bước `replace(/\s+/g, ' ')`: `normalizeText` đã gộp mọi chuỗi `\p{White_Space}`, và `\s` của JS không có gì ngoài tập đó (trừ U+FEFF, đã bị bỏ). Ca DR-38 (20 000 dấu cách) vẫn nhanh như cũ.
  - Số / ngày dán kèm ký tự vô hình hay U+0085 nay đọc như dòng đọc lại tiền KYC (DR6-101). `kyc-view.ts:129` (`parseVnd(normalizeText(text))`) nay chuẩn hóa hai lần, kết quả như nhau (hàm lũy đẳng); file ngoài danh sách của Issue nên để nguyên.
- **DR6-111, ký tự điều khiển C0 / C1 (Q2 a, Owner 21/10)**: `normalizeText` bỏ mọi `\p{Cc}` không phải `White_Space`: đúng 58 ký tự CL3-A8 đếm (U+0001–0008, U+000E–001F, U+007F–0084, U+0086–009F). Tab, xuống dòng, U+0085 vẫn gộp thành dấu cách như nay.
  - NUL giữ lại để `isStorableText` từ chối (`INVALID_TEXT`). Nếu bỏ NUL, hộp KH sẽ báo "Chưa nhập tên" cho tên chỉ có NUL trong khi lệnh trả `INVALID_TEXT`; giữ lại thì màn nói đúng như lệnh (spec: "UI kiểm rỗng bằng cùng hàm"). Test ghim.
  - Lệnh, nhập backup, UI cùng hàm. Trong `packages/ai`, V3–V6 (`text-match.ts`, G5 §11.2) và phần thấy được của V1 (`visible` ở `schema.ts`, G5 §11.5) cũng đọc qua `normalizeText` nên nhận luật mới (Q2 (a) đã nêu); test `packages/ai` (gồm 1 085 chuỗi eval và chuỗi `vi.ts`) xanh không đổi.
  - Biểu thức bỏ ký tự đặt thành hằng `INVISIBLE` có doc comment (thêm nhánh `(?![\0\p{White_Space}])\p{Cc}`).
  - `docs/design/phase-5-prompts.md` §11.2 dòng 594 liệt kê tập K20 lúc đó (chưa có ký tự điều khiển); dòng 596 đã ghi "đổi tập ở K20 thì V3–V6 đổi theo". File G5 ngoài danh sách của Issue nên không sửa; đề nghị PR sổ ghi một ghi chú để thêm vế "ký tự điều khiển" khi chạm file (vd. PR docs G5 §12 của #728).
- **DR6-112, `byName`**: hòa theo collator (số 0 đầu, chữ số toàn khổ) thì phân xử bằng so code unit, nên chỉ hai tên giống hệt mới hòa; doc comment nói rõ.
- **DR6-126 (e, f), test hở**: CR đứng một mình là xuống dòng; NFC chứ không NFKC ("m²", chữ toàn khổ, "ﬁ" giữ như gõ); thứ tự "kiểm storable trước" của `cleanText` / `cleanNote`; `parseVnd` gom khoảng trắng (NBSP, U+202F, hai dấu cách, tab); trường số của KYC chỉ nhận chữ toàn chữ số (`'2.0'`, `'1e1'`, `'0x10'`, `'+2'` → `INVALID_KYC_VALUE`, ở test lệnh `packages/db/src/kyc.test.ts` vì `kyc-fact.test.ts` ngoài danh sách file).
  - Bể ký tự ngẫu nhiên: `text.test.ts` thêm U+00B2, U+0007, U+009F, U+DC00 và kiểm thêm "không còn `\p{Cc}`"; `backup.test.ts` thêm U+FEFF, U+0007, U+DC00.
- **Spec Phase 3 dòng 175** (`docs/design/phase-3-du-lieu.md`): luật K25 đủ (ký tự định dạng, `Default_Ignorable_Code_Point`, U+2800, ký tự điều khiển; mọi `White_Space`; NFC không NFKC; các dấu xuống dòng của ghi chú), thứ tự "kiểm lưu được trước", UI gửi chữ gốc, và luật nhập từ chối chữ bắt đầu bằng U+FEFF. Dòng 218 (§6) dẫn chiếu "như lệnh lưu (§4)" nên không sửa.
- Gộp L17: `load` (`backup.ts`) gọi `insert.free()` trong `finally`.
- Cỡ: 22 file, +364 / −54. Code sản phẩm +78 / −44, phần lớn là doc comment và vòng lặp của `load` thụt thêm một mức trong `try`. Test + e2e +285 / −9, spec +1 / −1.

#### Test chấp nhận

- [x] Nhập backup có U+FEFF đầu chuỗi ở cột chữ → `BACKUP_INVALID`: tên team, ghi chú KYC, ngày lịch hẹn, `created_at`, id KH (đổi ở mọi dòng trỏ tới, để khóa ngoại vẫn khớp). U+FEFF giữa / cuối chuỗi như nay. Lệnh vẫn bỏ U+FEFF (`requireName`, `isStorableText`).
- [x] `recordAiAnalysis` với `rawOutput` có nửa surrogate lẻ (đầu, cuối, giữa, sát 20 000 ký tự, cả khi bị cắt) → đọc lại đúng chữ đã lưu (U+FFFD); xuất → nhập lại được và đọc ra như cũ. Cùng kiểu cho U+FEFF đầu chuỗi.
- [x] Hộp 5a / 7a (e2e): tên / ghi chú gồm nửa cao, U+200B, nửa thấp, " Lan" → khung lỗi `INVALID_TEXT`, hộp vẫn mở; tên thường gõ kèm dấu cách thừa và U+200B vẫn lưu, hồ sơ mở theo tên đã chuẩn hóa. Unit: `cleanText` / `cleanNote` cùng chuỗi → `INVALID_TEXT`.
- [x] `"500tr" + U+200B`, `"500" + U+0085 + "000" + U+0085 + "000"`, `"5" + U+2800 + "tr"`, `"1tr" + U+2060 + "5"` (thêm U+FEFF đầu, U+0007) ở `parseVnd` đọc được, bằng `parseVnd(normalizeText(text))` của dòng đọc lại tiền KYC; `"12/10" + U+200B` / U+0085 / U+2800 ở `parseQuickDate`, `parseRecordDate`, `parseBirthDate` đọc được; chỉ ký tự vô hình → `empty`.
- [x] Q2 (a): "Sao Mai" + U+0007 trùng "Sao Mai" (`TEAM_NAME_TAKEN`); tên team / nhân sự / giá trị KYC chỉ gồm ký tự điều khiển → `NAME_REQUIRED` / `INVALID_KYC_VALUE` (cổng KYC không đổi); luật nhập cùng hàm (`teams.name`, `kyc_notes.text` có ký tự điều khiển → `BACKUP_INVALID`); spec dòng 175 ghi luật mới.
- [x] `byName('Team 01', 'Team 1') !== 0` (cả "KH 007" / "KH 7", "Team ２" / "Team 2"), phản xứng, thứ tự sắp không phụ thuộc thứ tự đầu vào.
- [x] Đột biến có test đỏ: áp từng đột biến vào file thật, chạy file test của nó, rồi trả lại.
  - Của Issue: `nn-crlf-only`, `nn-no-cr`, `x-nfkc` (`text.test.ts`), T7, T8 (`common.test.ts`), MO8 (bỏ gom khoảng trắng: 11 test đỏ), KF3 (`kyc.test.ts`): 7 / 7 bị giết.
  - Của code mới: `valueOf` nhận U+FEFF đầu (5 đỏ), `raw_output` giữ nửa lẻ / giữ U+FEFF đầu / chỉ bỏ một U+FEFF / được rỗng, `normalizeText` bỏ cả NUL / bỏ cả tab và xuống dòng, `byName` không phân xử hòa, `parseQuickDate` / `parseBirthDate` chỉ `trim`, `parseVnd` bản trước PR: 11 / 11 bị giết.
- [x] Hai ca e2e mới đỏ trên hộp thoại cũ: `pnpm e2e -g "broken in a paste"` với `CustomerDialogs.tsx` / `KycDialogs.tsx` của `main` → 2 failed. Hộp đóng vì đã lưu: ảnh trạng thái có KH "😀 Lan" (5a) và ghi chú KYC "😀 Lan" trên Dòng thời gian (7a). Trên bản sửa cả hai xanh.

#### Dữ liệu tải

`node tools/load-data.mjs` (neo 2026-10-12, seed 6): `tables` sha256 trước và sau PR đều `1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f`, bằng mốc lượt 3 (`119e2e4`). Seed không sinh ký tự điều khiển / U+FEFF, nên không có hash mới. File sinh ra nhập lại được bằng luật nhập mới (`importBackup`, ≈ 1,0 s trong Node).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `6c422cc`), 16 mục "Trùng file":

- L14 (`backup.ts` #184: `valueOf` chỉ nhận cột integer / text, `ORDER BY` theo khóa chính, hai khối `try/catch` của `database.ts`): để lại, ngoài phạm vi. PR chỉ thêm vế U+FEFF vào nhánh text của `valueOf`. Hai ca "only meets integer and text columns" / "only meets data tables with a primary key" của `backup.test.ts` đã có từ trước, PR sổ có thể xét lại vế đó.
- L17 (`backup.ts` `load`: statement `prepare` không `free()`): đã sửa, `try … finally insert.free()`.
- L24 (#141: dòng "Sau khi lưu" của 5d, cảnh báo RF, `INVALID_TRANSITION`, `CLOSED_STAGES.includes`, badge lặp): để lại, ngoài phạm vi. PR chỉ sửa `save` của 5a / 5c.
- L37 (R3: API `nextKycVersion`, gợi ý năm trước cho ngày nhanh đầu năm): để lại, ngoài phạm vi. PR chỉ đổi cách `parseQuickDate` đọc chữ, không đổi luật năm.
- L41 (`dayAndTime` của `ai-panel-view.ts`, hàm `dd/mm HH:MM` ở `period.ts`): để lại, ngoài phạm vi (`ai-panel-view.ts` ngoài danh sách file).
- L42 (`isIsoDate` dùng chung cho `ai` / `db`): để lại, ngoài phạm vi (chạm `packages/ai/src/schema.ts`, `backup-validation.ts`).
- L47 (`ConfirmFactDialog` 3f báo `refused` muộn): để lại, ngoài phạm vi. PR chỉ sửa `save` của 7a.
- L77 (`customer-forms.spec.ts:245`, số RF / KYC của 5f dạng `\d+`): để lại, ngoài phạm vi. PR chỉ thêm ca 5a.
- L113 (test migration `ai_analyses` gỡ ngược bằng `DROP INDEX`): để lại, ngoài phạm vi. PR chỉ thêm ca `raw_output`.
- L125 (bỏ ZWJ / ZWNJ làm rời emoji ghép): để lại, đúng luật Owner (K20 / K25, Issue #604); Q2 (a) không đổi phần này.
- L166 (VT / FF của `normalizeNote` thành dấu cách, không tách dòng): để lại. Q2 (a) giữ khoảng trắng như nay; doc comment nêu đúng các ký tự tách dòng.
- L167 (`randomText` lặp ở `backup.test.ts` / `text.test.ts`): để lại, chỉ ghi lại. Hai package khác nhau; PR chỉ thêm ký tự vào hai bể.
- L168 (spec Phase 3 dòng 175 còn luật K20 cũ): đã sửa. Dòng 175 ghi luật K25 đủ, kèm ký tự điều khiển của Q2 (a).
- L187 (G5 §11.8: `output_json` lưu nguyên chuỗi của backup): để lại, cần G2 (luật nhập mới §7.3).
- L218 (DR6-25, `zod/mini`): để lại, hoãn sau v1.0.
- L220 (DR6-66, hàm chỉ test dùng, gồm `monthToDate` của `period.ts`): để lại, hoãn sau v1.0.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (118 file test, 3 196 test; coverage domain như cũ)
- [x] `pnpm e2e` xanh ở local: 251 passed, 2,9 phút
- [x] Không thêm dependency
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` (G2 K25 mở rộng: Owner duyệt 21/10, Q2 (a)). Không cần `build-exe` (không chạm `src-tauri`, Cargo, `package.json`, cấu hình build).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-270 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #386, #686 — T-270 (#721, PR #738, `REVIEW: PASS` @`a1a6931`):
  - #386, `packages/db/src/backup.ts` `load`: statement `prepare` của mỗi bảng nay `try { … } finally { insert.free(); }` (`backup.ts:150-163`).
  - #686, `docs/design/phase-3-du-lieu.md:175` (dòng "Mọi lệnh có tên / chữ KYC"): nay ghi luật K25 đủ: DI, U+2800, U+0085 và các dấu xuống dòng của ghi chú KYC (U+0085 / U+2028 / U+2029).

---

# Issue #722 — T-271: Dọn sạch: REPLACE không lách trigger, cột trỏ tới nhân sự một nơi, test tập giữ lại (DR6-113, 114, 125, 126, 132)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **REPLACE không lách được trigger chỉ thêm (DR6-113):**
   - Hiện `INSERT OR REPLACE` / `REPLACE INTO` sửa được ghi chú KYC / dữ kiện / phân tích AI của KH đang dùng, vì `recursive_triggers` tắt nên REPLACE không chạy trigger BEFORE DELETE.
   - Bật `PRAGMA recursive_triggers = ON` cạnh `foreign_keys` mỗi lần mở / sau `export` (mọi trigger chỉ `RAISE`, không gây đệ quy), hoặc cách tương đương. D11 thêm ca REPLACE.
2. **Cột trỏ tới nhân sự một danh sách (DR6-114):** `USAGE`, `IN_TRASH`, `KEPT_PEOPLE` (và luật nhập 5) lấy các cột trỏ tới nhân sự (`re_id` của lịch / HĐ / KH, `outcome_reviewer_id`, `appointment_coordinators`) từ một nơi.
   - Bỏ nhánh `outcome_reviewer_id` không thể xảy ra của `KEPT_PEOPLE`: lịch giữ lại luôn là Dời lịch, CHECK chỉ cho người đánh giá ở lịch Đã gặp.
   - TR-12 ghi "RE / người phối hợp".
3. **Test hở Dọn sạch (DR6-125):**
   - tập giữ lại nhiều tầng: chuỗi hai Dời lịch đã xóa, chuỗi đã xóa hết, lịch đang dùng giữa chuỗi, nhân sự ở hai lịch giữ lại, team có hai người giữ lại;
   - D3 so cả chuyển nhóm đã rút của cuộc gặp còn dùng (cuộc gặp sửa kết quả ở 6f);
   - D11 thử KH đang dùng khi Thùng rác có KH;
   - 11b / 5f và 11i đếm cùng ghi chú SYSTEM.
4. **Test hở `updatePerson` (DR6-126 c):** RE rời vai trò khi còn lịch hẹn quá khứ (sau bàn giao) → `PERSON_IN_USE`.
5. **Tài liệu trong package (DR6-132 b):**
   - `packages/db/CLAUDE.md` nói trigger 0011 đọc bảng `customers`, nên migration "dựng lại bảng" `customers` phải DROP rồi tạo lại ba trigger trong cùng transaction.
   - Chú thích `schema.ts` (`:237`, `:257`, `:326`) nêu ngoại lệ Dọn sạch (TR-11, phụ lục ADR-0008).
6. Gộp các ghi chú OPEN của #709 và `team.ts` cùng file (dưới), gồm CL3-A29: chi phí ≈ 4,5 ms mỗi lần `listTrash` là bước gốc của `KEPT_APPOINTMENTS`, không phải `KEPT_PEOPLE` / `KEPT_TEAMS`.

##### Bối cảnh

Deep review Phase 1–6 lượt 3 (T-267 #714), nhóm **L3-C**; Owner 19/10: sửa hết. Lệnh Dọn sạch (#709) không có lỗi dữ liệu ở mọi đường lượt 3 đã thử. Điểm yếu là test hở: 13 đột biến sống của tập giữ lại, D3, D11; và lưới an toàn append-only có lỗ REPLACE từ 0003.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §6.3 (DR6-113, 114), §6.7 (DR6-125, 126), §6.8 (DR6-132), §8.2 L3-C, §8.4 (CL3-A29)
- `docs/reviews/raw/2026-10-21/claude/A.md` CL3-A9, A10, A11, A12, A15, A18, A22, A23, A25, A27, A29 (đột biến ở `wf1\mutants.md`, mục 9.2)
- `docs/design/phase-6-hoan-thien.md` §4.2 TR-11, TR-12, D1–D13; phụ lục dọn Thùng rác của ADR-0008
- `packages/db/src/purge.ts` (đủ), `packages/db/src/team.ts:74-112`, `:196-299`, `packages/db/src/counts.ts`, `packages/db/src/database.ts` (`enableForeignKeys` :196, `migrate`)
- `packages/db/src/backup-validation.ts` luật 5 (:256-280), `packages/db/migrations/0003_kyc_append_only.sql`, `0008_…`, `0011_trash_purge.sql`
- `packages/db/CLAUDE.md`

##### File / thư mục được phép sửa

- `packages/db/src/{database,purge,team,counts,schema,backup-validation}.ts` và test cạnh chúng (`database.test.ts`, `purge.test.ts`, `team.test.ts`, `counts.test.ts`, `backup-invariants.test.ts`)
- `packages/db/CLAUDE.md` (câu về trigger 0011; khối codemap sinh lại nếu export đổi)
- `docs/design/phase-6-hoan-thien.md` (chữ TR-12)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `98d0016`):

- L201 `purge.ts:185` (`keptRecords` luôn chạy `KEPT_PEOPLE` / `KEPT_TEAMS`): **gộp** theo số đo của CL3-A29: phần tốn là `KEPT_APPOINTMENTS`; bỏ qua CTE khi không có lịch đã xóa, hoặc ghi lý do để lại.
- L202 `purge.ts:167` (nhánh `VACUUM` lỗi chưa có test): **gộp**.
- L203 `purge.ts:171` (lần lưu sau `VACUUM` dựa vào transaction rỗng): **gộp**.
- L204 `purge.ts:154` (`now` là kế hoạch dọn): **gộp**.
- L205 `purge.ts:204` (`rowsOf` lặp `selectRows`): **gộp**.
- L77 (e2e 5f chỉ kiểm `\d+`, số chính xác ở `counts.test.ts`): **gộp** phần `counts.test.ts` (ca ghi chú SYSTEM, mục tiêu 3).
- L142 (`customers + appointments + policies > 0` lặp ở `team.ts`, `team-view.ts`, `PersonDialogs.tsx`): **gộp** phần `team.ts` (`ownsRecords` cạnh `isPersonInUse`); `team-view.ts` dùng lại khi chạm (T-272).
- L143 (`updatePerson` / `softDeletePerson` luôn chạy `IN_TRASH`): **gộp** nếu tách phần đếm vừa cỡ, không thì để lại (rẻ, 1,5–9 ms).
- L151 `database.test.ts:194` (không kiểm kết quả `findIndex`): **gộp**, một dòng.
- L150 (đoạn lật byte chép ở `app-data.test.ts`): để lại, file ngoài danh sách.
- L144 (`inTrash` chỉ nêu tên), L78 (`rf` đếm chuyển nhóm): để lại, chỉ ghi lại.
- L10, L14, L42, L60, L61, L169: để lại, ngoài phạm vi.
- L219 (DR6-25): để lại, hoãn sau v1.0.

##### Interface / hợp đồng

- Không đổi schema, không migration (nếu buộc phải thêm trigger, dùng migration tự viết và ghi lý do ở PR).
- Lệnh Dọn sạch giữ nguyên kết quả (`PurgePlan`, D1–D13).

##### Test chấp nhận

- [ ] `INSERT OR REPLACE` / `REPLACE INTO` cùng id trên `kyc_notes`, `kyc_facts`, `ai_analyses` của KH đang dùng → `append-only` (cả sau một lần `exportBytes`); dòng của KH đã xóa mềm vẫn dọn được; D1–D13 xanh.
- [ ] Các cột trỏ tới nhân sự của `USAGE`, `IN_TRASH`, `KEPT_PEOPLE`, luật 5 lấy từ một nơi; hành vi giữ nguyên (9b ↔ lệnh 0 lệch trên dữ liệu tải); không còn nhánh người đánh giá; TR-12 sửa chữ.
- [ ] Mọi đột biến sống của DR6-125 có test đỏ: 13 đột biến `KEPT_*` / `firstOfEach` của CL3-A10, `p-st-withdrawn-any` / M26 (A11), M10 / M12 của 0011 (A12), C1b / P104 (A18).
- [ ] Đột biến `up-no-appt` (CL3-A15) có test đỏ.
- [ ] `packages/db/CLAUDE.md` và chú thích `schema.ts` theo mục tiêu 5.
- [ ] Nhánh `VACUUM` lỗi có test; `listTrash` khi Thùng rác trống không chạy bước gốc của `KEPT_APPOINTMENTS` (hoặc PR ghi lý do để lại, kèm số đo).

Ước lượng: ≈ 15–35 dòng SP + ≈ 200–250 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med

##### Bị chặn bởi

#720 (cùng `backup-validation.ts`, `phase-6-hoan-thien.md`)

## PR #742 — fix: REPLACE no longer edits the append-only history, one list of what points to a person (T-271)

Trạng thái: MERGED · merge 2026-10-21T13:14:43Z · commit `213a13edfdedd30e1e4d5d884be0108b629dbbcc` · nhánh `task/T-271-purge-safety-net` · nhãn: type:task, risk:med

Closes #722

#### Thay đổi

- **REPLACE không lách trigger chỉ thêm (DR6-113).** `openDatabase` bật `PRAGMA recursive_triggers = ON` cạnh `foreign_keys` mỗi lần mở và sau `export` (`enableConnectionPragmas`, `database.ts`). Mọi trigger (0003, 0006, 0008, 0011) chỉ `RAISE` nên không đệ quy. `INSERT OR REPLACE` / `REPLACE INTO` trên ghi chú KYC / dữ kiện / phân tích AI của KH đang dùng nay bị `append-only`; dòng của KH đã xóa mềm vẫn dọn được (D1–D13 xanh). Không đổi schema, không migration.
  - Dòng của KH đã xóa mềm vẫn REPLACE được: REPLACE là xóa + chèn, cả hai đã được phép với dòng đó (D11), nên không thêm khả năng nào.
- **Cột trỏ tới nhân sự ở một nơi (DR6-114).** `PERSON_REFERENCES` (`schema.ts`) là quan hệ SQL một dòng mỗi tham chiếu (`kind`, `person_id`, `appointment_id`, `customer_id`, `live`): RE của KH / lịch / HĐ, người phối hợp, người đánh giá. `USAGE`, `IN_TRASH` (`team.ts`), `KEPT_PEOPLE` (`purge.ts`) và luật nhập 5 (`backup-validation.ts`) đều đọc từ đó.
  - `KEPT_PEOPLE` hết nhánh `outcome_reviewer_id` riêng: lịch giữ lại luôn là Dời lịch, CHECK chỉ cho người đánh giá ở lịch Đã gặp. TR-12 (spec Phase 6) ghi "RE / người phối hợp".
  - Test mới `has a reference for each column of the schema that points to a person` đỏ khi schema thêm cột trỏ tới `people` mà danh sách chưa có.
- **`team.ts`:** `ownsRecords(usage)` cạnh `isPersonInUse` (export qua `index.ts` để T-272 #723 dùng ở `team-view.ts`); `usageCounts` là phần đếm không có `IN_TRASH`, `updatePerson` / `softDeletePerson` dùng nó.
- **`purge.ts`:** `keptRecords` trả `[]` ngay khi không có lịch đã xóa (không chạy CTE); `rowsOf` → `selectRows`; `now` → `plan` / `purged`; comment ở `Database.transaction` rằng transaction rỗng vẫn lưu.
- **Tài liệu:** `packages/db/CLAUDE.md` (trigger 0011 đọc `customers` nên migration dựng lại bảng `customers` phải DROP / tạo lại ba trigger; `recursive_triggers`; `PERSON_REFERENCES`; chỉ Dọn sạch xóa hẳn); chú thích `schema.ts` của `kycNotes`, `kycFacts`, `aiAnalyses` nêu ngoại lệ Dọn sạch (TR-11, phụ lục ADR-0008); TR-12.
- **Ngoài danh sách file của Issue, mỗi chỗ một dòng:** `common.ts` (nới kiểu tham số `selectRows` thành `BindParams`, ghi chú L195 yêu cầu), `index.ts` (export `ownsRecords`).

##### Đã đo (dữ liệu tải 1 496 KH, 10 414 lịch, 54 nhân sự; sinh lại bằng `main`)

- **Kết quả không đổi:** `personUsage` của cả 54 người, `previewPurge` và `listTrash` giống hệt trước / sau (băm trùng: usage `928077347dafae80`, plan `0bfbf5f9be93519c`, trash `3d750dec8d66836b`). Tức 9b ↔ lệnh lệch 0.
- **Thời gian:** `personUsage` 1,9 → 4,1 ms (một lần mỗi lần mở hộp 9b; hai lệnh chỉ đếm, ≈ 2,3 ms); mọi luật nhập 154 → 168 ms trên ≈ 1 s nhập (luật 5 dùng bảng dẫn xuất, +13 ms); `listTrash` 28,0 → 28,7 ms (nhiễu); `keptRecords` khi Thùng rác không có lịch đã xóa không còn chạy CTE.

##### Đột biến (chạy từng bản trên bộ test `packages/db`): 46 / 46 bị giết

| Nhóm | Đột biến | Test giết |
|---|---|---|
| CL3-A10 tập giữ lại (13) | `k-no-recursion`, `k-base-f-live-too`, `k-base-c-deleted-too`, `k-base-a-deleted-too`, `k-rec-live-too`, `kp-no-first-of-each`, `kp-latest`, `kp-no-order`, `kt-last-person`, `kt-live-too`, `kt-no-first-of-each`, `kt-no-order`, `foe-last` | nhóm `the records the purge keeps` |
| CL3-A11 | `p-st-withdrawn-any` | D3 (KH có cuộc gặp sửa kết quả 6f) |
| CL3-A12 | M10, M12 của 0011 (cả ai) | D11 (thử xóa khi Thùng rác có KH) |
| CL3-A18 | C1b (`counts.ts`), P104 (`purge.ts`) | đếm ghi chú SYSTEM, `counts.test.ts` |
| CL3-A15 | `up-no-appt` (và `-cust`, `-pol`) | `updatePerson` RE rời vai trò |
| DR6-113 | bỏ `recursive_triggers`; không bật lại sau `export` | REPLACE ở D11; `database.test.ts` |
| `PERSON_REFERENCES` (13) | bỏ từng nhánh / `live` luôn 1 / cột `appointment_id`, `customer_id` null; `IN_TRASH`, `USAGE` bỏ `live` | `team.test.ts`, `purge.test.ts`, `trash.test.ts` |
| Luật nhập 5 (5) | bỏ policy / reviewer / coordinator, bỏ `live`, tắt "RE phối hợp lịch của mình" | `backup-invariants.test.ts` (thêm ca lịch đã xóa) |
| Code mới | không bỏ qua CTE; luôn rỗng; VACUUM ném lại; bỏ lần lưu rỗng | test bỏ qua CTE, VACUUM lỗi, "gives the file back the room" |

Ca cuối của luật 5 sống ở lần chạy đầu (`5: the RE of an appointment also coordinating it` vẫn đỏ nhờ vế vai trò hỗ trợ), nên thêm ca `5: the RE of a deleted appointment also coordinating it`; đột biến đó bị giết.

#### Test chấp nhận

- [x] `INSERT OR REPLACE` / `REPLACE INTO` cùng id trên `kyc_notes`, `kyc_facts`, `ai_analyses` của KH đang dùng → `append-only`, cả sau một lần `export`; dòng của KH đã xóa mềm vẫn dọn được; D1–D13 xanh
- [x] Cột trỏ tới nhân sự của `USAGE`, `IN_TRASH`, `KEPT_PEOPLE`, luật 5 lấy từ một nơi; hành vi giữ nguyên (băm trùng trên dữ liệu tải); hết nhánh người đánh giá; TR-12 sửa chữ
- [x] Mọi đột biến sống của DR6-125 có test đỏ (13 đột biến `KEPT_*` / `firstOfEach`, `p-st-withdrawn-any` / M26, M10 / M12 của 0011, C1b / P104)
- [x] Đột biến `up-no-appt` có test đỏ
- [x] `packages/db/CLAUDE.md` và chú thích `schema.ts` theo mục tiêu 5
- [x] Nhánh `VACUUM` lỗi có test; `listTrash` khi Thùng rác không có lịch đã xóa không chạy bước gốc của `KEPT_APPOINTMENTS`

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `85ac286`, 21 mục "Trùng file"):

- L10 (`backup-validation.ts`, hash `kyc_versions` khi nhập): để lại, ngoài phạm vi.
- L14 (`database.ts`, `valueOf` / `ORDER BY` của `backup.ts`): để lại, ngoài phạm vi (PR chỉ chạm pragma của `database.ts`).
- L41 (`validDate` trùng `isoDate` của `@p2c/ai`): để lại, ngoài phạm vi.
- L59 (tập "provider không có model", `schema.ts`): để lại, ngoài phạm vi.
- L60 (hai hằng giới hạn 20 000, `schema.ts`): để lại, ngoài phạm vi.
- L63 (phạm vi export của `@p2c/ai`): không liên quan, là `index.ts` của `@p2c/ai`.
- L76 (e2e 5f chỉ kiểm `\d+`): đã sửa phần `counts.test.ts` (ca ghi chú SYSTEM ghim số chính xác); e2e để nguyên, ngoài danh sách file.
- L138 (khung "Khi lưu" 6f / 6g): không liên quan, trùng tên `index.ts`.
- L141 (`customers + appointments + policies > 0` lặp): đã sửa phần `team.ts` (`ownsRecords`); `team-view.ts` / `PersonDialogs.tsx` dùng lại ở T-272.
- L142 (`updatePerson` / `softDeletePerson` luôn chạy `IN_TRASH`): đã sửa, tách `usageCounts`.
- L143 (`inTrash` chỉ nêu tên): để lại, chỉ ghi lại.
- L147 (đoạn lật byte chép ở `app-data.test.ts`): để lại, file ngoài danh sách.
- L148 (`findIndex` không kiểm kết quả): đã sửa, `expect(at).toBeGreaterThan(-1)`.
- L164 (`optionalText` chỉ `trim()`): để lại, ngoài phạm vi (PR chỉ nới kiểu `selectRows` ở `common.ts`).
- L191 (CTE `KEPT_APPOINTMENTS` quét mọi lịch hẹn): đã sửa phần Thùng rác không có lịch đã xóa (bớt ≈ 4,4 ms mỗi `listTrash`); khi có lịch đã xóa CTE vẫn quét, bớt thêm cần chỉ mục từng phần (migration), để lại.
- L192 (nhánh `VACUUM` lỗi chưa có test): đã sửa.
- L193 (lần lưu sau `VACUUM` dựa vào transaction rỗng): đã sửa bằng comment ở `Database.transaction` và `purgeTrash`; đột biến bỏ lần lưu rỗng bị giết.
- L194 (`now` là kế hoạch dọn): đã sửa, `plan` / `purged`.
- L195 (`rowsOf` lặp `selectRows`): đã sửa.
- L224 (chữ TR-3 dòng E7): để lại, ngoài phạm vi (PR chỉ sửa chữ TR-12).
- L227 (DR6-25, `zod/mini`): để lại, hoãn sau v1.0.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (3 227 test; `packages/db/src` 99,65 % câu lệnh, 97,9 % nhánh)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-271 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #669, #674, #709 — T-271 (#722, PR #742, `REVIEW: PASS` @`85ac286`):
  - #669, `packages/db/src/team.ts` (`updatePerson` / `softDeletePerson` luôn chạy `IN_TRASH`): hai lệnh nay gọi `usageCounts`, phần đếm không có `IN_TRASH`.
  - #669, `packages/db/src/team.ts` (phần `team.ts` của mục tổng `customers + appointments + policies > 0`): nay là `ownsRecords(usage)` cạnh `isPersonInUse`, export qua `@p2c/db`. Phần `team-view.ts` / `PersonDialogs.tsx` vẫn OPEN.
  - #674, `packages/db/src/database.test.ts` (`findIndex` không kiểm kết quả): thêm `expect(at).toBeGreaterThan(-1)`.
  - #709, `packages/db/src/purge.ts` (`KEPT_APPOINTMENTS` chạy cả khi Thùng rác trống): `keptRecords` trả `[]` trước CTE khi không có lịch đã xóa, có test. Phần "có lịch đã xóa" vẫn OPEN.
  - #709, `packages/db/src/purge.ts` (nhánh `VACUUM` lỗi chưa có test): test spy `run` ném ở `VACUUM`, kiểm kết quả, dữ liệu đã dọn và `persist` một lần.
  - #709, `packages/db/src/purge.ts`, `packages/db/src/database.ts` (lần lưu sau `VACUUM` dựa vào transaction rỗng): doc comment của `Database.transaction` nói transaction rỗng vẫn lưu; đột biến bỏ lần lưu bị test "gives the file back the room" giết.
  - #709, `packages/db/src/purge.ts` (*Mysterious Name* `now`): nay là `plan` / `purged`.
  - #709, `packages/db/src/purge.ts`, `packages/db/src/common.ts` (*Duplicated Code* `rowsOf`): `selectRows` nhận `BindParams`, `rowsOf` đã bỏ.

---

# Issue #723 — T-272: Câu Thùng rác của hộp 9b, focus màn Team & nhân sự (DR6-115, 116)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **Câu Thùng rác của hộp 9b nói đúng việc gỡ được (DR6-115), Q3 (a) Owner 21/10:** chỉ sửa chữ, câu luôn đúng; đưa "dọn sạch Thùng rác" lên trước, nói rõ phạm vi của vế khôi phục.
   - RE (`person.inUseTrash`): "…; khôi phục KH rồi chuyển sang RE khác chỉ chuyển được lịch Dự kiến".
   - Người hỗ trợ (`person.inUseSupportTrash`): "…; khôi phục KH thì sửa được lịch đã có kết quả (Sửa kết quả), lịch Dự kiến / Dời lịch chỉ dọn sạch mới gỡ".
   - Chữ cuối do phiên làm task viết theo ý trên; NT-TM-16 và hướng dẫn `08-team.md` sửa theo.
2. **Focus màn Team & nhân sự không rơi về `body` (DR6-116):** đặt đích focus dự phòng (`DialogFocusFallback`) cho các hộp của `TeamScreen`, vd. tiêu đề thẻ thành viên / "Người hỗ trợ" / "Danh sách team" (`tabIndex={-1}`, mẫu `CustomerKyc.tsx:138`). Khóa `Members` theo team (`key`) để nút "Xóa team" không bị dùng lại cho team khác.

##### Bối cảnh

Deep review Phase 1–6 lượt 3 (T-267 #714), nhóm **L3-D**; Owner 19/10 sửa hết, 21/10 đồng ý Q3 (a). Câu Thùng rác của 9b có từ #669 / #710: làm theo vế "khôi phục KH" thì nhân sự vẫn không xóa được, còn KH quay lại danh sách và chỉ số. Lý do: bàn giao chỉ chuyển lịch Dự kiến (K19), và người phối hợp của lịch Dự kiến / Dời lịch không đổi được (DR6-80). Màn Team không có trong Issue #655 (DR6-83), nên focus sau các hộp của nó chưa có đích.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §6.4 (DR6-115, 116), §8.2 L3-D, §9 Q3
- `docs/reviews/raw/2026-10-21/claude/A.md` CL3-A3 (ca C1–C8); `docs/reviews/raw/2026-10-21/claude/D.md` CL3-D1, CL3-D2 (kịch bản K1–K3); `docs/reviews/raw/2026-10-21/codex/D.md` CX3-D1
- K19, K26 (`docs/reviews/raw/2026-10-21/common-known.md` phần 2)
- `apps/desktop/src/i18n/vi.ts:1194-1218` (khóa `person.*`), `apps/desktop/src/routes/team/team-view.ts` (`inUseHelp`), `TeamScreen.tsx`, `PersonDialogs.tsx`, `TeamDialogs.tsx`
- `packages/ui/src/components/{Dialog.tsx,dialog-focus.ts}`; mẫu đặt đích: `apps/desktop/src/routes/customers/CustomerProfile.tsx:232`, `:275`, `CustomerKyc.tsx:138`
- `docs/testing/nghiem-thu-v1.md` NT-TM-15, NT-TM-16; `docs/user-guide/08-team.md:76`

##### File / thư mục được phép sửa

- `apps/desktop/src/i18n/vi.ts` (khóa `person.inUseTrash`, `person.inUseSupportTrash`, khóa mới nếu cần)
- `apps/desktop/src/routes/team/{team-view.ts,team-view.test.ts,TeamScreen.tsx,PersonDialogs.tsx,TeamDialogs.tsx}`
- `e2e/team.spec.ts`
- `docs/testing/nghiem-thu-v1.md` (NT-TM-16), `docs/user-guide/08-team.md`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `98d0016`):

- L142 (tổng `customers + appointments + policies > 0` lặp ở `team-view.ts:114`): dùng `ownsRecords` nếu T-271 đã merge; không thì để lại.
- L50 (`KycExtraction.tsx:96`), L81 (`trash.customer.with`), L100 (`close.unsavedBody`, làm ở T-275), L172 (spec Phase 3 dòng 175, làm ở T-270): để lại, ngoài phạm vi của task này.

##### Interface / hợp đồng

- Không đổi lệnh `db`; `personUsage` giữ nguyên (Q3 a: chỉ sửa chữ).

##### Test chấp nhận

- [ ] `team-view.test.ts`: câu Thùng rác mới cho RE và cho người hỗ trợ; câu đúng ở các ca C1–C8 của CL3-A3 và ca NT-TM-16 (lịch Dự kiến ngày mai, IS phối hợp).
- [ ] e2e `team.spec.ts` (ca 9b + Thùng rác hiện có) chờ câu mới.
- [ ] e2e bàn phím màn Team: sau Xóa nhân sự (9b), Lưu đổi vai trò làm người rời bảng / rời "Người hỗ trợ", Lưu ở "+ Thêm TL", xóa TL, Xóa team: `document.activeElement` không phải `BODY`; sau Xóa team, focus không nằm trên nút của team khác.
- [ ] NT-TM-16 và `08-team.md` khớp câu mới.

Ước lượng: ≈ 10–25 dòng SP + ≈ 60 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

#719 (fixture đồng hồ e2e)

## PR #744 — fix: 9b trash sentence says what restoring can do, Team screen keeps the focus (T-272)

Trạng thái: MERGED · merge 2026-10-21T15:07:01Z · commit `e63270f8911673db0ec09525803c0e6d26f94c57` · nhánh `task/T-272-team-trash-sentence-focus` · nhãn: type:task, risk:low

Closes #723

#### Thay đổi

- **Câu Thùng rác của hộp 9b nói đúng việc gỡ được (DR6-115, Q3 a).** Chỉ sửa chữ (`person.inUseTrash`, `person.inUseSupportTrash` ở `vi.ts`); `personUsage` và lệnh `db` giữ nguyên. "Dọn sạch Thùng rác" đứng trước vì luôn gỡ được (xóa hẳn dữ liệu của KH đã xóa, TR-11; KH đã xóa chỉ được dữ liệu của chính nó dùng tới, TR-12); vế khôi phục nói rõ phạm vi:
  - RE: "Dọn sạch Thùng rác (Cài đặt → Thùng rác) xóa hẳn dữ liệu đó; khôi phục KH rồi chuyển sang RE khác chỉ chuyển được lịch Dự kiến." Bàn giao chỉ chuyển lịch Dự kiến (K19, `customerForm.handover`); cuộc gặp đã có kết quả, lịch đã qua chưa ghi kết quả và HĐ giữ RE đã ghi.
  - Người hỗ trợ: "Dọn sạch Thùng rác (Cài đặt → Thùng rác) xóa hẳn các lịch đó; khôi phục KH thì sửa được lịch đã có kết quả (Sửa kết quả), còn lịch Dự kiến / Dời lịch chỉ dọn sạch mới gỡ." Người phối hợp của lịch Dự kiến / Dời lịch không đổi được (DR6-80), 6f chỉ có ở lịch đã có kết quả.
  - Câu cuối do phiên task viết theo ý của Q3 (a) (Issue: "chữ cuối do phiên làm task viết"); hai khuôn câu giữ nguyên chỗ điền `{customer}` nên tên KH và "và n KH khác" không đổi.
  - NT-TM-16 chép câu mới; `docs/user-guide/08-team.md` nêu hai cách gỡ (dọn sạch, khôi phục) và phạm vi của vế khôi phục cho RE và người hỗ trợ.
- **Focus màn Team & nhân sự không rơi về `body` (DR6-116).** `TeamScreen` đặt đích dự phòng cho mọi hộp của nó:
  - Ba tiêu đề thẻ ("Team", "Team <tên>" của thẻ thành viên, "Người hỗ trợ") thành đích focus (`id` + `tabIndex={-1}`, mẫu `CustomerKyc.tsx:138`); các hộp bọc trong `DialogFocusFallback` với `cardTitleOf(editing)`: Xóa team → "Team"; sửa / xóa người của "Người hỗ trợ" → "Người hỗ trợ"; còn lại (người của bảng thành viên, + Thêm TL, xóa TL) → thẻ thành viên.
  - `Members` khóa theo team (`key`): nút "Xóa team" không còn được dùng lại cho team hiện ra kế tiếp, nên sau Xóa team focus không nằm trên nút của team khác.
  - Nút mở hộp còn trên trang (+ Team, + Nhân sự, Đổi tên team, Hủy / Đóng 9b) vẫn nhận focus lại như trước; đích dự phòng chỉ dùng khi nút đã mất.
- **`inUseHelp` dùng `ownsRecords(usage)`** của `@p2c/db` (T-271) thay tổng `customers + appointments + policies > 0` lặp ở `team-view.ts`; không đổi hành vi.

#### Test chấp nhận

- [x] `team-view.test.ts`: câu Thùng rác mới cho RE và cho người hỗ trợ (tên KH, "và n KH khác" giữ nguyên); câu giống hệt với mọi loại bản ghi giữ người đó (các hình dạng của ca C1–C4 và ca NT-TM-16: IS phối hợp lịch Dự kiến ngày mai + đánh giá cuộc gặp), không hứa khôi phục gỡ hết. Đỏ trước khi sửa `vi.ts` (nhận câu cũ), xanh sau.
- [x] e2e `team.spec.ts` ca 9b + Thùng rác hiện có chờ câu mới.
- [x] e2e bàn phím màn Team (3 ca, đỏ trước khi sửa: focus không ở tiêu đề thẻ; ca Xóa team vẫn đỏ khi mới có `DialogFocusFallback`, xanh khi thêm `key`):
  - xóa người của bảng thành viên (9b), Lưu đổi vai trò RE → IS làm người rời bảng, Lưu đổi IS → RE làm người rời "Người hỗ trợ", xóa người của "Người hỗ trợ": focus ở tiêu đề thẻ họ rời;
  - Lưu ở "+ Thêm TL" (nút mất theo), xóa TL: focus ở tiêu đề thẻ thành viên;
  - Xóa team: focus ở tiêu đề "Team" của danh sách, không ở "Xóa team" của team kế tiếp.
- [x] NT-TM-16 và `08-team.md` khớp câu mới.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `27fab2e`, 4 mục "Trùng file"):

- L49 (`KycExtraction.tsx:96`, khuôn câu "AI đề xuất" trong `vi.ts`): để lại, ngoài phạm vi (PR chỉ đổi hai khóa `person.*`).
- L80 (`trash.customer.with`, slot `{count}`): để lại, ngoài phạm vi.
- L99 (`close.unsavedBody`): để lại, làm ở T-275 (#726).
- L141 (`customers + appointments + policies > 0` lặp): đã sửa phần `team-view.ts` (`inUseHelp` dùng `ownsRecords`); phần `PersonDialogs.tsx:183-186` để lại: điều kiện ở đó (`appointments + policies > 0`) chỉ quyết định có hiện dòng "n lịch hẹn, m HĐ ghi cho RE này", không phải câu "người này sở hữu bản ghi"; thay bằng `ownsRecords` thì RE chỉ có KH sẽ hiện dòng "0 lịch hẹn, 0 HĐ".
- (Không trùng file nhưng cùng nhóm, ghi lại cho PR sổ:) L22 (`PersonDialogs.tsx`): nửa đầu (`role === 'RE' || role === 'TL'` lặp) đã hết từ trước nhờ `needsTeam`; nửa sau ("Xóa nhân sự" trong hộp Sửa bỏ thay đổi chưa lưu mà không báo) đổi hành vi hộp, ngoài phạm vi, để lại.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (118 file, 3 228 test)
- [x] e2e ở local: `team.spec.ts` + `dialog-keyboard.spec.ts` 30 / 30 (gồm ba ca focus mới và hai câu 9b mới)
- [x] Xem trên bản web: hộp 9b của RE có KH trong Thùng rác hiện câu mới, xuống ba dòng gọn trong hộp; Escape trả focus về nút "Sửa" như trước; tiêu đề thẻ nhận focus có viền
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [x] Chỉ sửa các file được phép trong Issue (7 file). Diff 208 + / 58 −; bỏ qua khoảng trắng (`git diff -w`) 168 + / 18 −, phần chênh là thụt lề của các hộp trong `TeamScreen.tsx` khi bọc `DialogFocusFallback`. Code sản phẩm ≈ 52 dòng (`vi.ts` 8, `TeamScreen.tsx` 40, `team-view.ts` 4), còn lại test, e2e, tài liệu
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.ai/code)

## Nhóm RESOLVED của sổ gắn T-272 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #669 — T-272 (#723, PR #744, `REVIEW: PASS` @`65d2d73`):
  - #669, `apps/desktop/src/routes/team/team-view.ts` (phần còn lại của mục tổng `customers + appointments + policies > 0`): `inUseHelp` nay dùng `ownsRecords(usage)` của `@p2c/db`. Phần `apps/desktop/src/routes/team/PersonDialogs.tsx:183-186` không cùng nghĩa nên không sửa: `appointments + policies > 0` chỉ quyết định có hiện dòng "n lịch hẹn, m HĐ ghi cho RE này"; thay bằng `ownsRecords` thì RE chỉ còn KH sẽ hiện "0 lịch hẹn, 0 HĐ" (thân PR #744, review đã kiểm trên code).

---

# Issue #724 — T-273: Chuỗi liền dài không tràn khung, panel AI vừa khung (DR6-117, 118, 127)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **Chuỗi liền dài không tràn khung ở chỗ #669 chưa phủ (DR6-117):**
   - thẻ "Lịch hẹn" của hồ sơ, khi ghi chú cuộc gặp là một link dài: ô Ghi chú co theo thẻ (vd. `max-w-0 w-full truncate`, hoặc bảng `table-fixed`);
   - dòng dữ kiện đang soạn của 7a, dòng "Đang có" của 7c, lựa chọn của 7d: giá trị xuống dòng (`min-w-0 wrap-anywhere`), badge và nút Bỏ ở trong hộp;
   - tiêu đề hồ sơ: tên KH liền dài co / xuống dòng, bốn nút không ra ngoài cửa sổ.
2. **Panel AI không tràn (DR6-118):**
   - bảng "Lịch sử phân tích" vừa khung panel ở cửa sổ mặc định 1 440 (3 cột) cả khi có hàng ChatGPT web: ô Prompt xuống dòng, badge không co;
   - `Item` của panel và của khối AI chi tiết lịch hẹn ngắt chuỗi liền (`min-w-0 wrap-anywhere`, như #669 làm ở `KycExtraction.tsx`).
3. **Test hở DR6-82 (DR6-127):** e2e giữ dòng cuộc gặp của Dòng thời gian (`wrap-anywhere`).

##### Bối cảnh

Deep review Phase 1–6 lượt 3 (T-267 #714), nhóm **L3-E**; Owner 19/10: sửa hết. #669 sửa DR6-82 cho chữ ghi chú KYC và dòng dữ kiện. Cùng loại lỗi còn ở các chỗ trên. Hai bên review cùng thấy ở hộp 7a; Codex thêm ca tên KH; Claude thêm thẻ Lịch hẹn và panel AI. Chỉ sai hiển thị, nhưng ca (a) của panel xảy ra với dữ liệu thường: một lần lưu từ ChatGPT web ở cửa sổ mặc định.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §6.4 (DR6-117, 118), §6.7 (DR6-127), §8.2 L3-E
- `docs/reviews/raw/2026-10-21/claude/C.md` CL3-C1 (kịch bản K12, số đo `p10*`); `docs/reviews/raw/2026-10-21/claude/D.md` CL3-D3, CL3-D4 (kịch bản K4, K5); `docs/reviews/raw/2026-10-21/codex/D.md` CX3-D2, CX3-D3
- `e2e/customer-kyc.spec.ts:44-89` (ca DR6-82, hàm đo `past()`), `e2e/customer-ai-web.spec.ts`
- `apps/desktop/src/routes/customers/{CustomerAppointments.tsx:95-110,KycDialogs.tsx:119-131,:322-330,:437-447,CustomerProfile.tsx:139-156,KycHistory.tsx:45-100,KycIntelligence.tsx:155-180}`, `apps/desktop/src/routes/appointments/AppointmentAi.tsx`
- Mockup `docs/design/mockups/customer.html` (khối 2j), `ai.html` (2j, 4i)

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/customers/{CustomerAppointments,KycDialogs,CustomerProfile,KycHistory,KycIntelligence}.tsx`
- `apps/desktop/src/routes/appointments/AppointmentAi.tsx`
- `e2e/{customer-kyc,customer-ai-web,customer-appointments}.spec.ts`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `98d0016`):

- L119 NIT `KycIntelligence.tsx:210` (khoảng trắng thừa cuối class): **gộp**, vô hại, bỏ khi chạm file.
- L21 (`CustomerAppointments.tsx`: mockup tô "RF" màu accent), L24 (dòng "Sau khi lưu" của 5d), L47 (3f preview), L48 (markup lặp đang chạy / lỗi), L110 (`opened` / `setWeb`), L118 (khung mờ), L131 (`stageSince`), L183 (`scrollIntoView` của "Xem tất cả"), L186 (đích focus 7d lấy bằng `getElementById`), L166 (helper e2e tìm KH seed): để lại, ngoài phạm vi.

##### Interface / hợp đồng

- Chỉ đổi class / markup; không đổi chữ, không đổi luật.

##### Test chấp nhận

- [ ] e2e (mở rộng ca DR6-82): link 108 ký tự ở ghi chú + việc tiếp theo của một cuộc gặp Đã gặp. Ở 1 440 và 1 100: chữ thẻ Lịch hẹn và Dòng thời gian không vượt mép thẻ, trang không cuộn ngang. Đột biến R82e (bỏ `wrap-anywhere` dòng cuộc gặp) có test đỏ.
- [ ] e2e hộp 7a / 7c / 7d với cùng link: hộp không cuộn ngang, nút Bỏ và badge trong hộp.
- [ ] e2e tên KH "D" + 80 chữ "x" liền: các nút của hồ sơ trong cửa sổ ở 1 100 và 1 440.
- [ ] e2e panel AI ở 1 440 × 900 sau một lần lưu từ ChatGPT web: badge CURRENT trong khung panel. Chữ AI có chuỗi liền (mã "F1/F2/…/F20", email 70 ký tự) không làm trang cuộn ngang, ở cả panel lẫn khối AI chi tiết lịch hẹn.

Ước lượng: ≈ 10–20 dòng SP + ≈ 60–80 dòng e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

#719 (fixture đồng hồ e2e), #721 (cùng `KycDialogs.tsx`)

## PR #746 — fix: long words break inside their cards, the AI panel fits its frame (T-273)

Trạng thái: MERGED · merge 2026-10-21T16:09:39Z · commit `3fcdd4d0e59c5132bbdf70d7a982fbbe3ca07355` · nhánh `task/T-273-long-strings-ai-panel` · nhãn: type:task, risk:low

Closes #724

#### Thay đổi

Chỉ đổi class (không đổi chữ, không đổi luật). Mỗi chỗ tràn dưới đây có một ca e2e giữ.

- **Thẻ "Lịch hẹn" của hồ sơ (DR6-117 a).** Ô Ghi chú (`line-clamp-1`) thêm `wrap-anywhere` (`CustomerAppointments.tsx`). Trước đó bề rộng tối thiểu của ô là cả link nên bảng rộng hơn thẻ; nay ghi chú cắt một dòng có dấu "…" như mockup ("ghi chú dài cắt 1 dòng"). Với ghi chú thường (8 KH của seed, 1 440 và 1 100) bề rộng bốn cột đo trên bản dựng **không đổi** khi có hay không có class: chỉ chuỗi liền khác đi.
- **Hộp 7a / 7c / 7d (DR6-117 b)**, `KycDialogs.tsx`:
  - 7a: giá trị của dữ kiện đang soạn `min-w-0 flex-1 wrap-anywhere`, nên badge và nút Bỏ nằm trong hộp.
  - 7c: dòng "Đang có" `wrap-anywhere`.
  - 7d: nhãn của lựa chọn `min-w-0 wrap-anywhere`.
- **Tiêu đề hồ sơ (DR6-117 c).** Tên KH `min-w-0 wrap-anywhere` (`CustomerProfile.tsx`): tên "D" + 80 chữ "x" liền xuống dòng ngay trong tiêu đề, bốn nút còn trong cửa sổ ở 1 100 và 1 440.
- **Panel AI (DR6-118).**
  - Lịch sử phân tích (`KycHistory.tsx`): ô Prompt `wrap-anywhere`, badge ChatGPT web / Mock `whitespace-nowrap`; bảng vừa khung panel 376 px ở 1 440 (CURRENT không tràn nữa, badge không gãy dòng).
  - `Item` (`KycIntelligence.tsx`, dùng chung cho panel và khối AI chi tiết lịch hẹn): `wrap-anywhere` (như #669 ở `KycExtraction.tsx`); mã "F1/F2/…/F20", email 70 ký tự xuống dòng trong khung, trang không cuộn ngang.
- **Test hở DR6-127.** Ca DR6-82 giữ cả dòng cuộc gặp của Dòng thời gian (đột biến R82e đỏ).
- **Ngoài các gạch đầu dòng của Issue (cần nói rõ):** dòng "Mức bằng chứng: …" trong `Item` bỏ `whitespace-nowrap`. Đổi này chạm mọi mục của panel và của khối AI chi tiết lịch hẹn, không chỉ ca chuỗi liền. Lý do: (1) e2e đo được dòng này vượt viền ô `Item` 3 px ở khối chi tiết lịch hẹn (302 px) dù chữ AI ngắn; (2) mockup `ai.html` đặt `.ev` là flex-wrap, không `nowrap`. Ở panel 3 cột, dòng mức "trung bình" (dài hơn "thấp") nay xuống hai dòng khi không đủ chỗ.
- **Gộp NIT L118:** `Analysis` không còn khoảng trắng thừa cuối class khi không mờ.

##### Lệch mockup 2j / 4i

Ở panel 3 cột, ô Prompt của bảng Lịch sử phân tích ngắt giữa chữ (`discove` / `ry@3+` / `web@1`): bảng 5 cột chỉ còn 342 px, cột Ngày và Prompt chịu phần co. Đúng cách sửa Issue chọn ("ô Prompt xuống dòng, badge không co"); mockup vẽ ô Prompt một dòng và không ghi bề rộng panel. Gọn hơn (gộp KYC · Prompt · Provider vào một ô, đề xuất của review) là đổi hình thức → G3, không làm ở đây.

#### Test chấp nhận

- [x] e2e mở rộng ca DR6-82 (`customer-kyc.spec.ts`): link 108 ký tự làm ghi chú và việc tiếp theo của một cuộc gặp Đã gặp (ghi ở màn Lịch hẹn, 6c). Ở 1 440 và 1 100, chữ của thẻ Lịch hẹn và Dòng thời gian (hai chỗ: ghi chú KYC, dòng cuộc gặp) không vượt mép thẻ, trang không cuộn ngang. R82e (bỏ `wrap-anywhere` dòng cuộc gặp, `CustomerKyc.tsx:274`) → đỏ.
- [x] e2e hộp 7a / 7c / 7d với cùng link (ca mới, `customer-kyc.spec.ts`): chữ link trong hộp, hộp không cuộn ngang, badge và nút Bỏ của 7a trong hộp.
- [x] e2e tên KH "D" + 80 chữ "x" liền (ca mới, `customer-kyc.spec.ts`): bốn nút của hồ sơ trong cửa sổ ở 1 100 và 1 440, trang không cuộn ngang.
- [x] e2e panel AI ở 1 440 × 900 sau một lần lưu từ ChatGPT web (ca mới, `customer-ai-web.spec.ts`): badge CURRENT trong khung panel, badge ChatGPT web một dòng; chữ AI có chuỗi liền (mã "F1/…/F20", email 70 ký tự) không làm panel, khối AI chi tiết lịch hẹn và trang cuộn ngang.

Cả bốn ca **đỏ trên mã chưa sửa** (5 file TSX về `main`), đúng số của review: thẻ Lịch hẹn vượt mép 341,6 px ở 1 440; 7a vượt 161 px; nút "Sửa hồ sơ" ở x = 1 261,8 trong cửa sổ 1 100; badge CURRENT vượt phần nội dung của panel (1 434 so với 1 400).

##### Đột biến (12; 11 bị giết)

| Đột biến | Kết quả |
|---|---|
| R82e: dòng cuộc gặp của Dòng thời gian bỏ `wrap-anywhere` | giết (ca DR6-82) |
| Ô Ghi chú của thẻ Lịch hẹn bỏ `wrap-anywhere` | giết (ca DR6-82) |
| 7a: giá trị bỏ `min-w-0 wrap-anywhere` / chỉ bỏ `wrap-anywhere` | giết, giết (ca 7a / 7c / 7d) |
| 7c: dòng "Đang có" bỏ `wrap-anywhere` | giết |
| 7d: nhãn lựa chọn bỏ `min-w-0 wrap-anywhere` | giết |
| Tên KH bỏ `min-w-0 wrap-anywhere` | giết (ca tên dài) |
| `Item` bỏ `wrap-anywhere` | giết (ca panel AI) |
| Ô Prompt của lịch sử bỏ `wrap-anywhere` | giết |
| Badge nguồn bỏ `whitespace-nowrap` | giết (badge gãy hai dòng, cao hơn badge CURRENT) |
| Dòng "Mức bằng chứng" thêm lại `whitespace-nowrap` | giết (vượt 3 px) |
| 7a: badge bỏ `whitespace-nowrap` | **sống** → bỏ luôn class đó khỏi mã. Hai ô anh em `flex-1` có basis 0 nên badge không bao giờ bị ép; không có gì để test |

Ghi nhận: với tên 81 chữ ở cửa sổ nhỏ nhất (1 100), dòng "từ 15/09/2026" cạnh badge nhóm xuống hai dòng vì tên chiếm phần co. Chỉ là hình thức, không có test giữ; không thêm class cho chỗ này.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `aa7aaf3`, 12 mục "Trùng file"):

- L20 (`CustomerAppointments.tsx`, mockup tô "RF" accent, năm khác xuống dòng giờ): để lại, ngoài phạm vi (hình thức của ngày / kết quả, không phải chuỗi liền; đổi hình thức → G3).
- L23 (`CustomerProfile.tsx`, #141: dòng "Sau khi lưu" của 5d, cảnh báo RF, mã lỗi, `badge` lặp): để lại, ngoài phạm vi (chữ / luật của hộp 5d và code lặp; PR này chỉ đổi class).
- L46 (`KycDialogs.tsx`, 3f: preview `refused` báo lý do ngay): để lại, ngoài phạm vi (hành vi của hộp 3f).
- L47 (khối đang chạy / lỗi lặp giữa `KycExtraction.tsx` và panel): để lại, vượt phạm vi (gộp thành một `AiJobStatus` là refactor riêng).
- L109 (`opened` / `setWeb` ở `KycIntelligence.tsx`): để lại, ngoài phạm vi (đổi tên state).
- L117 (khung mờ hai lớp viền đứt): để lại, cần G3 (đổi hình thức); PR không đổi viền.
- L118 (NIT khoảng trắng thừa cuối class của `Analysis`): **đã sửa** (`flex flex-col text-sm` khi không mờ).
- L130 (`stageSince` chỉ giữ bằng đọc code và e2e): để lại, chỉ ghi lại (vitest có DOM là G4); PR không đổi hành vi.
- L158 (`aboutTheKh` lặp ở `mock-adapter.ts`; khối tìm KH seed qua "Hiện thêm" ở `customer-ai-web.spec.ts:249-253`): để lại, `mock-adapter.ts` ngoài file được phép; helper e2e chờ nơi thứ ba, PR này không thêm nơi nào chép khối đó.
- L172 (`scrollIntoView` của "Xem tất cả" đưa đích xuống dưới thanh): để lại, thuộc #735 / T-280 (`scroll-padding-top`).
- L175 (NIT `getElementById('kyc-facts')` của đích focus 7d): để lại, dùng ref phải sửa `CustomerKyc.tsx`, ngoài file được phép.
- L213 (khối "đặt value như dán" viết 3 lần ở e2e): để lại, helper nằm ở `e2e/fixtures.ts`, ngoài file được phép; PR này không chạm các khối đó và không chép thêm.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (bản cuối `80fa075`)
- [x] e2e ở local: toàn bộ 257 / 257 (trước commit cuối bỏ `min-w-0` thừa của `Item`; sau đó chạy lại 8 ca panel AI / lịch hẹn / lịch sử: xanh)
- [x] Xem trên bản web dựng (ảnh chụp từ Playwright, không chỉ số đo): panel ở 1 440 (chuỗi dài xuống dòng, lịch sử vừa khung), khối AI chi tiết lịch hẹn, hộp 7a / 7c / 7d, thẻ Lịch hẹn ở 1 440 và 1 100, tiêu đề tên dài ở 1 100 và 1 440
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [x] Chỉ sửa file được phép trong Issue (7 file): 5 file TSX (13 + / 10 − dòng, code sản phẩm), 2 file e2e (256 + / 32 −)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-273 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #632 — T-273 (#724, PR #746, `REVIEW: PASS` @`80fa075`):
  - #632, NIT `apps/desktop/src/routes/customers/KycIntelligence.tsx:210` (`Analysis`, khoảng trắng thừa cuối class khi không mờ): nay mỗi nhánh một chuỗi class, khi không mờ là `'flex flex-col text-sm'`.

---

# Issue #725 — T-274: Tên nút Hợp đồng / Thùng rác phân biệt được, e2e hộp Dọn sạch và 6f (DR6-119, 128)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **Tên nút phân biệt được cho trình đọc màn hình (DR6-119):**
   - thẻ Hợp đồng: `policies.issueLabel` / `policies.editLabel` thêm FYP như `trash.restoreLabel.policy` ("Phát hành HĐ nộp {date} · {fyp}");
   - Thùng rác: tên nút khôi phục của lịch hẹn có trạng thái ("… 10:00 · Hủy của KH …"), của HĐ có trạng thái phát hành, như ô "Bản ghi".
2. **Test hở màn Dọn sạch (DR6-128 a):** e2e giữ bốn luật của spec:
   - câu nhắc và nút Dọn sạch tính trên mọi bản ghi, không theo bộ lọc / ô tìm (TR-11, TR-13);
   - nút xác nhận chỉ bật khi gõ đúng DỌN SẠCH: chữ thường hay thừa dấu cách thì tắt, bản NFD của IME thì bật (D1, review R4);
   - đang dọn thì Escape không đóng hộp;
   - đang dọn thì Hủy tắt.
3. **Test hở chỗ nối hộp 6f ↔ `editedDay` (DR6-128 b, biến thể của DR6-91):** e2e ca E19 — cuộc gặp hôm nay giữ nhóm, rồi chuyển tay cùng ngày → mở 6f: nhóm sau khóa ở nhóm đã giữ, có dòng khóa, không có dòng "→ <nhóm khác>".

##### Bối cảnh

Deep review Phase 1–6 lượt 3 (T-267 #714), nhóm **L3-F**; Owner 19/10: sửa hết. #667 thêm FYP vào tên nút khôi phục HĐ (DR6-99) nhưng không chạm thẻ Hợp đồng. Cả hai bên review thấy hai HĐ cùng ngày cho hai cặp nút cùng tên.

Hộp Dọn sạch chép khung hộp Nạp lại (KNOWN #710) mà không chép e2e của nó (`e2e/dialog-keyboard.spec.ts:135`): 6 đột biến sống cả e2e. R04g của lượt 2 nay ở `editedDay` có unit test, nhưng lời gọi từ hộp thì chưa test nào giữ.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §3.1 (DR6-91), §6.4 (DR6-119), §6.7 (DR6-128), §8.2 L3-F
- `docs/reviews/raw/2026-10-21/claude/E.md` CL3-E1…E4 (kịch bản K2–K5, đột biến R84e–j, R04g-tsx); `docs/reviews/raw/2026-10-21/codex/E.md` CX3-E1
- `docs/design/phase-6-hoan-thien.md` §4.2 (TR-11, TR-13, D1, E19)
- `apps/desktop/src/routes/customers/CustomerPolicies.tsx:85-110`, `apps/desktop/src/i18n/vi.ts` (`policies.*`, `trash.restoreLabel.*`), `apps/desktop/src/routes/trash-view.ts` (`restoreLabel`, `recordTitle`)
- `apps/desktop/src/routes/SettingsTrash.tsx` (`PurgeDialog` :195-240), `e2e/trash.spec.ts:19-29`, `:443`, `:495`, `e2e/dialog-keyboard.spec.ts:135`
- `apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:80-95`, `outcome-form.ts` (`editedDay`)

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/customers/CustomerPolicies.tsx`
- `apps/desktop/src/routes/{trash-view.ts,trash-view.test.ts}`
- `apps/desktop/src/i18n/vi.ts` (khóa `policies.issueLabel`, `policies.editLabel`, `trash.restoreLabel.*`)
- `e2e/{trash,customer-policies,appointment-outcome,full-cycle,dialog-keyboard}.spec.ts` (gồm chỗ gọi nút theo tên cũ)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `98d0016`):

- L116 NIT `trash-view.ts:167`, `:172` (`restoreLabel`: `?? ''` cho tên "… của KH " khi thiếu): **gộp**, cùng hàm.
- L209 (`e2e/trash.spec.ts` chưa có test giao diện cho nhánh `notice.kind === 'refused'`): **gộp**, cùng file e2e.
- L134, L135 (`trash-view.ts`: cờ cùng ngày của E20 nếu luật đổi): để lại, luật không đổi.
- L210 NIT (`purgedNotice` nối câu bằng `.join(' ')`): để lại, chỉ ghi lại.
- L80 (`plain` lặp, họ DR6-67), L115 (`SettingsTrash.tsx` `useCallback`): để lại.
- L50, L81, L100 (`vi.ts`; L100 làm ở T-275): để lại, ngoài phạm vi.

##### Interface / hợp đồng

- Không đổi lệnh; chỉ chữ / nhãn và test.

##### Test chấp nhận

- [ ] Hai HĐ chưa phát hành của cùng KH nộp cùng ngày, FYP 24 tr và 48 tr: bốn nút Phát hành / Sửa có bốn tên khác nhau (e2e `getByRole` đếm 1 mỗi tên).
- [ ] `trash-view.test.ts`: hai lịch cùng ngày giờ khác trạng thái, hai HĐ cùng ngày cùng FYP khác trạng thái phát hành → tên nút khôi phục khác nhau.
- [ ] e2e hộp dọn sạch: bộ lọc "Lịch hẹn" + ô tìm không khớp → câu nhắc vẫn hiện, nút bật, hộp đếm mọi loại; "dọn sạch", "DỌN SẠCH " giữ nút tắt, bản NFD bật; bản exe giả với backup giữ (`holdBackup`): Escape ×3 hộp ở lại, Hủy tắt. Đột biến R84e–j có test đỏ.
- [ ] e2e 6f ca E19: nhóm sau khóa ở nhóm đã giữ, không có chuyển nhóm giả; đột biến R04g-tsx có test đỏ.
- [ ] e2e nhánh `refused` của thông báo Thùng rác (L209).

Ước lượng: ≈ 5–10 dòng SP + ≈ 120 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

#719 (fixture đồng hồ e2e)

## PR #748 — fix: tell same-day policies and appointments apart by button name, e2e for the purge dialog and 6f (T-274)

Trạng thái: MERGED · merge 2026-10-21T17:10:22Z · commit `efbfa88127e2a1a6721aaa5699a831ec32b3a33e` · nhánh `task/T-274-button-names-purge-e2e` · nhãn: type:task, risk:low

Closes #725

#### Thay đổi

Không đổi lệnh, schema hay giao diện nhìn thấy: chỉ đổi tên trợ năng (`aria-label`) của các nút và thêm test.

- **Tên nút phân biệt được cho trình đọc màn hình (DR6-119).**
  - Thẻ Hợp đồng (`CustomerPolicies.tsx`, `vi.ts`): `policies.issueLabel` / `editLabel` thêm FYP: "Phát hành HĐ nộp 10/09/2026 · 24.000.000 ₫", "Sửa HĐ nộp 10/09/2026 · 24.000.000 ₫". Dùng `formatVnd` như `trash.restoreLabel.policy`, không dùng dạng rút gọn "24 tr" của dòng hiển thị: dạng rút gọn làm tròn tới 10.000 ₫, nên hai FYP gần nhau (vd. 24.000.000 và 24.004.000 ₫) vẫn hiện cùng "24 tr" và cùng tên.
  - Thùng rác (`trash-view.ts`, `vi.ts`): tên nút khôi phục của lịch hẹn có trạng thái ("Khôi phục lịch hẹn 14/09/2026 10:00 · Hủy của KH …"), của HĐ có trạng thái nộp / phát hành ("Khôi phục HĐ nộp 10/09/2026 · 24.000.000 ₫ · Đã phát hành của KH …"), cùng chữ với ô "Bản ghi".
  - **Gộp NIT L115:** `restoreLabel` không để "của KH " treo khi dòng không có KH: vế "của KH {name}" tách thành khóa `trash.restoreLabel.ofCustomer`, hàm `ofCustomer`.
- **Test hở (DR6-128), chỉ test, hành vi không đổi:**
  - Hộp Dọn sạch (`e2e/trash.spec.ts`): bộ lọc + ô tìm, chữ xác nhận, đang dọn, nhánh `refused` (chi tiết ở "Test chấp nhận").
  - 6f ca E19 (`e2e/appointment-outcome.spec.ts`): chỗ nối hộp ↔ `editedDay`.
- **Ca cũ gọi nút theo tên cũ.** Bốn chỗ gọi nút khôi phục của Thùng rác trong `e2e/trash.spec.ts` đổi sang tên mới, vì trạng thái nằm giữa tên. Các ca gọi nút Phát hành / Sửa của thẻ Hợp đồng (`customer-policies`, `dialog-keyboard`, `full-cycle`) giữ nguyên: Playwright so chuỗi con và FYP nằm cuối tên, nên tên cũ vẫn khớp đúng một nút.

Cỡ: +271 / −38 dòng (7 file); sản phẩm ≈ 58 dòng đổi, gồm chú thích (`vi.ts` 5 / 4, `CustomerPolicies.tsx` 8 / 3, `trash-view.ts` 27 / 11); còn lại là test.

##### Còn một ca ngoài Issue

Ở thẻ Hợp đồng, một HĐ đã nộp và một HĐ đã phát hành cùng ngày nộp, cùng FYP nộp vẫn cho hai nút "Sửa" cùng tên: Issue chỉ đòi thêm FYP ở thẻ này (Thùng rác mới thêm cả trạng thái, theo mục tiêu 1). Nút "Phát hành" không trùng, vì chỉ HĐ chưa phát hành có nút đó, và hai HĐ như vậy giống nhau cả trên màn. Không sửa ở PR này; nếu cần: thêm `· {status}` vào `policies.editLabel` (≈ 2 dòng + 1 ca).

#### Test chấp nhận

- [x] **Bốn nút, bốn tên** (`e2e/customer-policies.spec.ts`, ca mới): KH mới, hai HĐ nộp 10/09 với FYP 24 tr và 48 tr → `getByRole('button', { name, exact: true })` đếm đúng 1 cho mỗi tên trong bốn tên Phát hành / Sửa.
- [x] **`trash-view.test.ts`**: hai ca cũ của `restoreLabel` đổi theo chữ mới; ba ca mới: hai lịch cùng ngày giờ (Không đến / Hủy), hai HĐ cùng ngày cùng FYP (đã nộp / đã phát hành) → tên khác nhau, và dòng không có KH → không có "của KH".
- [x] **Hộp Dọn sạch** (`e2e/trash.spec.ts`):
  - Ca D12 (1 000 bản ghi): chọn bộ lọc "Lịch hẹn" + ô tìm không khớp (bảng trống) → câu nhắc vẫn hiện, nút Dọn sạch vẫn bật, hộp đếm mọi loại ("1.000 bản ghi · mọi loại, không theo bộ lọc", "HĐ 999"); dọn xong còn 1 bản ghi giữ lại dù bộ lọc đang chỉ "Lịch hẹn".
  - `confirmPurge` (dùng ở hai ca): "DỌN", "dọn sạch", "DỌN SẠCH ", " DỌN SẠCH", "DỌN  SẠCH" giữ nút tắt; bản NFD của "DỌN SẠCH" (IME) bật nút.
  - Ca mới, bản exe giả với `holdBackup`: bấm "Backup rồi dọn sạch" → "Đang dọn…", Hủy và ô chữ tắt; Escape ×3 hộp ở lại và còn `:modal`; thả backup → hộp đóng, thông báo "Đã dọn sạch Thùng rác" + "Backup: …" nhận focus.
- [x] **6f ca E19** (`e2e/appointment-outcome.spec.ts`, ca mới): cuộc gặp hôm nay giữ N3, chuyển tay N3 → N2 cùng ngày → mở 6f: có dòng khóa "Nhóm sau cuộc gặp khóa ở nhóm của KH ngày 15/09/2026" và dòng "Nhóm của KH đã đổi tiếp …", không có nhóm sau chọn được, không có "không tính RF" / "Khi lưu"; Lưu không đổi gì (Giữ N3, KH vẫn N2).
- [x] **Nhánh `refused`** (`e2e/trash.spec.ts`, ca mới, D7): bản exe giả với `failSaves` → dọn bị từ chối, thẻ Thùng rác có `role="alert"` ("Chưa dọn: lần lưu gần nhất bị lỗi …", "Dữ liệu không bị đổi."), bảng và số bản ghi nguyên, focus về nút Dọn sạch.

##### Đột biến (7; 7 bị giết)

Áp từng đột biến lên bản đã commit `d457b7b` (script tạm ngoài repo; mỗi lần chạy e2e đích rồi `git checkout` lại, cây sạch sau cùng). Hai commit sau chỉ đổi chú thích và tên biến, không chạm file bị đột biến.

| Đột biến | Test đỏ | Đỏ vì |
|---|---|---|
| R84e `SettingsTrash.tsx`: `purgeReminder(shown.length)` | D12 "reminds from 1 000 records…" | câu nhắc mất khi bảng trống do bộ lọc + ô tìm |
| R84f `canPurge(shown)` | cùng ca | nút Dọn sạch tắt khi bảng không còn dòng |
| R84g xác nhận theo `trim().toUpperCase()` | "purges the trash for good…" (`confirmPurge`) | "dọn sạch" / "DỌN SẠCH " bật nút (kỳ vọng tắt) |
| R84h xác nhận `word === confirmWord` (bỏ NFC) | cùng ca | bản NFD không bật nút (kỳ vọng bật) |
| R84i `onClose={() => onClose()}` (Escape đóng khi đang dọn) | "the dialog of a purge that runs stays…" | hộp biến mất sau Escape |
| R84j Hủy bỏ `disabled={running}` | cùng ca | Hủy còn bật khi đang dọn |
| R04g-tsx `EditOutcomeDialog.tsx`: `editedDay(…, { ...a, status: 'CANCELLED' }, day)` | E19 | 6f hiện lại ô chọn nhóm và dòng giả "N2 → N3 ngày 15/09/2026 · không tính RF" thay cho dòng khóa |

Ghi chú về lần chạy: lần chạy đầu của R84g, R84h không chạy test nào (cmd.exe tách `-g` ở dấu `|`); chạy lại với một ca duy nhất, kết quả như bảng. Năm đột biến còn lại chạy với bộ lọc file rộng hơn dự định (đối số `-g` không được bọc nháy), nhưng chỉ ca dự kiến đỏ (R84i, R84j: 1 đỏ / 221 xanh).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `0967183`, 11 mục "Trùng file"; số dòng của Issue L116 / L209 nay là L115 / L191):

- L49 (`vi.ts`, NIT dấu `:` của "AI đề xuất" ở `KycExtraction.tsx:96`): để lại, ngoài phạm vi (khóa `kyc.*`, `KycExtraction.tsx`; PR không chạm).
- L79 (`trash-view.ts`, `plain` lặp `appointment-form.ts:112`): để lại, vượt phạm vi (họ DR6-67, hoãn sau v1.0; gom phải sửa file ngoài danh sách).
- L80 (`vi.ts`, slot `{count}` của `trash.customer.with`): để lại, cần thêm slot vào `COUNT_SLOTS` ở `i18n/index.ts`, ngoài file được phép.
- L99 (`vi.ts`, `close.unsavedBody`): để lại, làm ở #726 (T-275).
- L114 (`SettingsTrash.tsx:166`, `useCallback` + `eslint-disable`; nhắc ca TR-5 của `e2e/trash.spec.ts`): để lại, PR không đổi `SettingsTrash.tsx`; ca TR-5 vẫn giữ và xanh.
- L115 (`restoreLabel`, `?? ''` cho tên nút "… của KH " khi thiếu KH): **đã sửa** (`ofCustomer` + ca mới ở `trash-view.test.ts`).
- L132, L133 (`trash-view.ts`, cờ cùng ngày của E20 nếu luật đổi): để lại, luật không đổi; PR không chạm `reasonSentence`.
- L191 (chưa có e2e cho nhánh `notice.kind === 'refused'`): **đã sửa** phần giao diện qua D7 (ca mới ở `e2e/trash.spec.ts`). D8 / D9 đi qua cùng nhánh `Refused`, chỉ khác chữ tiêu đề (đã có unit test của `purgeFailure`); bản exe giả không làm `db_backup` lỗi được và `e2e/support.ts` ngoài file được phép.
- L192 (`purgedNotice`, nối câu bằng `.join(' ')`): để lại, chỉ ghi lại; PR không chạm `purgedNotice`.
- L204 (`toNewYearsEve`, khoảng nhảy tính từ `ANCHOR_MORNING`): để lại, hàm nằm ở `e2e/anchor.ts`, ngoài file được phép; hai spec chỉ gọi hàm, không đổi cách gọi.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (bản `0967183`: 118 file, 3.231 test); commit sau đó chỉ sửa một chú thích trong `e2e/trash.spec.ts` (prettier và eslint sạch), CI kiểm head
- [x] e2e ở local: toàn bộ 261 / 261 (257 cũ + 4 ca mới); ba spec đổi (`trash`, `appointment-outcome`, `customer-policies`) chạy thêm `--repeat-each=4`: 141 / 141, không ca nào chập chờn
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [x] Chỉ sửa file được phép trong Issue (7 file); không đụng `src-tauri`, Cargo, `package.json` → không cần nhãn `build-exe`
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-274 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #630, #710 — T-274 (#725, PR #748, `REVIEW: PASS` @`5a4d656`):
  - #630, NIT `apps/desktop/src/routes/trash-view.ts:167`, `:172` (`restoreLabel`, `?? ''` cho tên nút "… của KH " khi thiếu KH): vế "của KH {name}" nay là khóa riêng `trash.restoreLabel.ofCustomer`, qua hàm `ofCustomer`; dòng không có KH giữ nhãn không có vế đó (ca mới ở `apps/desktop/src/routes/trash-view.test.ts`).
  - #710, test giao diện nhánh `notice.kind === 'refused'` (`Refused` ở `apps/desktop/src/routes/SettingsTrash.tsx`): ca D7 mới ở `e2e/trash.spec.ts` (bản exe giả với `failSaves`) kiểm `role="alert"` của thẻ Thùng rác có câu D7, không có thông báo `status`, bảng và số bản ghi nguyên, focus về nút Dọn sạch. D8 / D9 đi qua cùng `Refused`, chỉ khác chữ (`purgeFailure` có unit test ở `apps/desktop/src/routes/trash-view.test.ts`); bản exe giả không làm `db_backup` lỗi được nên không có ca e2e riêng.

---

# Issue #726 — T-275: Lưu file: nhận ra mất quyền ghi lúc mở, câu lỗi file chỉ đọc (DR6-120)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **Mất quyền ghi được nhận ra lúc mở (DR6-120):** hiện `open` chỉ xét **thuộc tính** chỉ đọc (#674). Lúc mở, thử mở `project2c.db` với quyền ghi + xóa (vd. `OpenOptionsExt::access_mode`, không cắt file) → `ACCESS_DENIED` cả khi ACL của file cấm ghi / xóa mà vẫn cho đọc. Trang lỗi khởi động như DR6-74.
2. **Câu lỗi lưu đúng nguyên nhân (DR6-120):** khi lần lưu lỗi `PermissionDenied` mà file mang thuộc tính chỉ đọc (bật giữa phiên) hoặc không có quyền ghi / xóa, `save` trả mã riêng. Dải lưu (`SaveFailed`) và hộp đóng app nói "file dữ liệu đang chỉ đọc / không ghi được" thay "chương trình khác". File bị chương trình khác giữ vẫn ra câu cũ.
3. Gộp ghi chú OPEN L100: hộp đóng app (`close.unsavedBody`) chọn câu theo `saveError()` như `SaveFailed`; đĩa đầy thì không nói "chương trình khác".

##### Bối cảnh

Deep review Phase 1–6 lượt 3 (T-267 #714), nhóm **L3-G**; Owner 19/10: sửa hết. Claude B dựng trên exe hai đường cho đúng triệu chứng DR6-74 trước #674: ACL cấm ghi / xóa, và thuộc tính chỉ đọc bật giữa phiên. App mở bình thường, mọi lần lưu lỗi, người dùng bị bảo đóng một chương trình không có, Thử lại không bao giờ được. Đối chứng: chương trình khác giữ file không cho chia sẻ xóa cũng ra `os error 5`, và với ca đó câu "chương trình khác" đúng, nên phải phân biệt theo nguyên nhân. **PR cần nhãn `build-exe`.**

##### Tài liệu cần đọc

- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §6.5 (DR6-120), §8.2 L3-G
- `docs/reviews/raw/2026-10-21/claude/B.md` CL3-B1, kịch bản K12–K14 (`rsprobe acldeny`, `romid`, `heldshared`)
- ADR-0016; `docs/design/phase-6-hoan-thien.md` §4.1 (S-2); PR #674 (DR6-74)
- `apps/desktop/src-tauri/src/storage.rs` (`open` :100-160, `save` / `save_with` :205-235, `disk_full`, test `open_reports_a_read_only_database_file_as_access_denied`)
- `apps/desktop/src/data/tauri-storage.ts`, `apps/desktop/src/shell/{SaveWarning.tsx,CloseGuard.tsx,close-guard.ts}`, `apps/desktop/src/i18n/vi.ts` (`storage.*`, `close.*`)

##### File / thư mục được phép sửa

- `apps/desktop/src-tauri/src/storage.rs` (gồm test trong file)
- `apps/desktop/src/data/{tauri-storage.ts,tauri-storage.test.ts,tauri-contract.test.ts}`
- `apps/desktop/src/shell/{SaveWarning.tsx,SaveWarning.test.tsx,CloseGuard.tsx,close-guard.ts,close-guard.test.ts}`
- `apps/desktop/src/i18n/vi.ts` (khóa `storage.*`, `close.*`)
- `docs/user-guide/10-su-co.md` (nếu câu lỗi được trích)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `98d0016`):

- L100 `vi.ts` `close.unsavedBody` (vẫn nói "chương trình khác" khi đĩa đầy): **gộp** (mục tiêu 3).
- L13 `storage.rs` `explorer_arg` (không `#[cfg(any(windows, test))]`, build ngoài Windows báo `dead_code`): **gộp**, một dòng.
- L26 (#96: sau một lần lưu lỗi, "Nạp lại" bị từ chối mà không có cách thử lưu lại): để lại; Owner 21/10 Q5 (a) giữ mục OPEN, thêm đường vào Dọn sạch vào ghi chú sổ.
- L102 (`remove_interrupted_backups` lặp `remove_interrupted_exports`), L222 (DR6-67): để lại, hoãn / chỉ ghi lại.
- L50, L58, L81, L172: để lại, ngoài phạm vi.

##### Interface / hợp đồng

- Mã lỗi mới của lần lưu (vd. `READ_ONLY`, tên do phiên chọn) đi qua cùng đường với `DISK_FULL` (`saveError()`), có câu `vi.ts` riêng. Không thêm crate (G4); ACL trong test Rust dựng bằng `icacls` của Windows hoặc API có sẵn.

##### Test chấp nhận

- [ ] Test Rust: `project2c.db` có ACL cấm ghi / xóa cho tài khoản chạy test (cho đọc) → `open` trả `ACCESS_DENIED`, file không đổi, không backup; ACL gỡ sau test.
- [ ] Test Rust: thuộc tính chỉ đọc bật sau `open` → `save` trả mã chỉ đọc mới; chương trình khác giữ file không chia sẻ xóa → vẫn lỗi cũ.
- [ ] Unit app: dải lưu và hộp đóng app chọn câu theo lỗi (chỉ đọc, đầy đĩa, còn lại).
- [ ] Exe: tái hiện K12 / K13 của CL3-B1 ra trang lỗi khởi động / câu chỉ đọc (ghi trong PR).

Ước lượng: ≈ 20–40 dòng SP (Rust + TS) + ≈ 60 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh, `pnpm verify:rust` xanh
- [ ] CI xanh (gồm build exe, nhãn `build-exe`)
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med

##### Bị chặn bởi

Không

## PR #750 — fix: tell a data file the app may not replace from one a program holds, at startup and on every save (T-275)

Trạng thái: MERGED · merge 2026-10-21T19:45:43Z · commit `b91cc738d182ea33931be28b63f88d1a078067a9` · nhánh `task/T-275-readonly-save` · nhãn: type:task, risk:med, build-exe

Closes #726

#### Thay đổi

T-275, nhóm L3-G của deep review Phase 1–6 lượt 3: DR6-120 (CL3-B1) và gộp ghi chú OPEN L99 / L13.

- **Lúc mở (`storage::open`).** Thay bước chỉ xét thuộc tính chỉ đọc (#674) bằng `replace_refused`: file mang thuộc tính chỉ đọc, **hoặc** Windows từ chối app quyền xóa file (thử mở `project2c.db` chỉ với quyền `DELETE`, không cắt file) → `ACCESS_DENIED`, trang lỗi khởi động như DR6-74. Bước kiểm vẫn nằm sau bước kiểm đầu file SQLite.
- **Lúc lưu (`storage::save`).** Lần lưu lỗi `PermissionDenied` mà `replace_refused` đúng → mã mới `READ_ONLY`. File bị chương trình khác giữ (lỗi sharing violation khi thử mở) giữ nguyên lỗi của Windows, tức câu "chương trình khác" như cũ.
- **Dải lưu và hộp đóng app chọn câu theo `saveError()`** qua `saveFailure()` ở `tauri-storage.ts` (`diskFull` / `readOnly` / `other`). Ba câu mới trong `vi.ts`: `storage.saveReadOnly`, `close.unsavedBodyDiskFull`, `close.unsavedBodyReadOnly`. `close.unsavedBody` giữ cho "còn lại". Đĩa đầy không còn bảo "chương trình khác" ở hộp đóng app (**L99**).
- `explorer_arg` có `#[cfg(any(windows, test))]` (**L13**, một dòng).
- Hướng dẫn sử dụng: câu dải mới và bảng "câu nào, nghĩa gì, làm gì" (`01-bat-dau.md`, `10-su-co.md`).

Cỡ: ≈ 115 dòng sản phẩm (gần nửa là doc comment), ≈ 250 dòng test, 16 dòng tài liệu.

##### Lệch so với Issue

**1. Thử mở chỉ với quyền `DELETE`, không phải "ghi + xóa".** Một lần lưu = ghi `.tmp` rồi đổi tên đè lên file; quyền ghi vào chính `project2c.db` không bao giờ được hỏi, còn quyền xóa thì có. Đo trên Windows 11 (std, `icacls` theo SID `*S-1-1-0`, script ở phiên này): thử mở với `DELETE` (cộng kiểm thuộc tính chỉ đọc) **lỗi đúng khi lần lưu lỗi, ở mọi dòng**, và mã lỗi tách được nguyên nhân (5 = Windows từ chối quyền, 32 = chương trình khác đang giữ). Thử mở với `DELETE | FILE_WRITE_DATA` (đọc đúng chữ Issue) chặn nhầm ba dòng đậm ở bảng đầu và một dòng ở bảng thứ hai, tức file lưu được mà app lại không mở.

Thư mục giữ quyền xóa con (`FILE_DELETE_CHILD`, mặc định ở thư mục của chính người dùng):

| Tình huống trên `project2c.db` | thử `DELETE` | thử `DELETE\|WRITE` | lưu (đổi tên đè) |
|---|---|---|---|
| bình thường | Ok | Ok | Ok |
| thuộc tính chỉ đọc | **Ok** (nên vẫn cần kiểm thuộc tính) | 5 | 5 |
| cấm `(WD,AD,WA,WEA)` (ghi, còn xóa) | Ok | **5** | **Ok** |
| cấm `(DE)` | Ok | Ok | Ok |
| cấm `(WD,AD,WA,WEA,DE)` | Ok | **5** | **Ok** |
| chương trình khác giữ, chia sẻ 1 (đọc) | 32 | 32 | 5 |
| giữ, chia sẻ 3 (đọc + ghi) | 32 | 32 | 5 |
| giữ, chia sẻ 5 (đọc + xóa) | Ok | **32** | **Ok** |
| giữ, chia sẻ 7 | Ok | Ok | Ok |

Thư mục cấm `(DC)` (không còn quyền xóa con):

| Tình huống | thử `DELETE` | thử `DELETE\|WRITE` | lưu |
|---|---|---|---|
| chỉ cấm `(DC)` ở thư mục | Ok | Ok | Ok |
| + file cấm `(DE)` | 5 | 5 | 5 |
| + file cấm `(WD,AD,WA,WEA,DE)` | 5 | 5 | 5 |
| + file cấm `(WD,AD,WA,WEA)` | Ok | **5** | **Ok** |

**2. Test chấp nhận 1 dựng thêm `(DC)` ở thư mục.** Ở thư mục mà tài khoản có `FILE_DELETE_CHILD`, một dòng cấm trên file một mình **không** chặn được lần lưu (Windows lấy quyền của thư mục thay cho quyền xóa của file; dòng "cấm `(DE)`" ở bảng đầu): lưu vẫn được nên `open` nhận file là đúng. Lượt 3 thấy `(DE)` một mình đã chặn được, có lẽ vì thư mục của họ (dưới `C:\workspace\…`) không cho tài khoản quyền xóa con. Test của PR vì vậy cấm `(DC)` ở thư mục **và** `(WD,AD,WA,WEA,DE)` ở file, để không phụ thuộc ACL của máy chạy test, và đòi thêm điều kiện đầu: file đọc được, không chỉ đọc, `save` bị `PermissionDenied`. Test `an_access_list_that_only_refuses_writing_into_the_file_does_not_stop_the_app` giữ chiều ngược lại (cấm ghi mà còn xóa thì vẫn mở và lưu được); đột biến M4 làm nó đỏ.

**3. K14 giữ nguyên lúc mở.** Chương trình giữ file mà không chia sẻ xóa vẫn **không** chặn khởi động (chỉ lỗi `PermissionDenied` của lần thử mới là từ chối; sharing violation 32 thì không): chương trình đó có thể buông, và lần lưu sau / Thử lại lo việc còn lại. Giữ bằng `open_opens_a_file_another_program_holds_without_sharing_delete`; đột biến M5 làm nó đỏ.

**4. File ngoài danh sách của Issue.**
- `docs/user-guide/01-bat-dau.md`: các câu dải và hộp đóng app được trích ở đây (`10-su-co.md` chỉ trỏ tới). `10-su-co.md` thêm bảng nguyên nhân và dòng `ACCESS_DENIED` nói "ghi hay xóa file".
- `storage.accessDeniedHelp` đổi "được quyền ghi vào đó" → "được quyền ghi và xóa file trong đó" (trang này nay còn là đích của ca mất quyền xóa), kèm một chuỗi trong `startup-error.test.ts`. Không còn nơi nào khác trích câu cũ (`NT-DB-18` / `NT-DB-20` chỉ trích đầu câu, vẫn đúng).
- `CloseGuard.test.tsx` mới; `CloseDialog` được export (như `SaveFailed`) để kiểm câu theo lỗi bằng `renderToStaticMarkup`.

**5. Không có unit test:** bước đưa `saveError()` vào `CloseDialog` (`useSyncExternalStore` trong `CloseGuard`, không có DOM để dựng cửa sổ đóng). Đã kiểm trên exe (dưới).

**6. Hệ quả nhỏ:** thư mục mang tên `project2c.db` giữa phiên nay ra `READ_ONLY` thay vì lỗi trần của Windows (thử mở `DELETE` trên thư mục trả 5, đã đo). Cùng họ với ca thư mục đã ghi ở L101 (`open` đã từ chối ca này bằng `ACCESS_DENIED` từ trước).

#### Test chấp nhận

- [x] Test Rust: ACL cấm ghi / xóa (file) + `(DC)` (thư mục), file đọc được → `open` trả `ACCESS_DENIED`, file không đổi, không `backups\`, gỡ ACL thì mở được (`open_reports_a_database_file_its_access_list_does_not_let_the_app_replace_as_access_denied`). `Denied` gỡ ACL trong `Drop`, cả khi test đỏ.
- [x] Test Rust: thuộc tính chỉ đọc bật sau `open` → `save` trả `READ_ONLY`, file không đổi, không `.tmp` (`a_save_after_the_file_turned_read_only_is_reported_as_read_only`); ACL đổi giữa phiên → `READ_ONLY` (`a_save_the_access_list_refuses_is_reported_as_read_only`); chương trình khác giữ file không chia sẻ xóa (chia sẻ 0 như NT-DB-09, và 1 | 2 như SQLite browser) → lỗi của Windows như cũ (`a_save_a_program_holding_the_file_refuses_keeps_the_error_of_windows`).
- [x] Unit app: `saveFailure` (`tauri-storage.test.ts`), dải lưu (`SaveWarning.test.tsx`), hộp đóng app (`CloseGuard.test.tsx`) chọn câu theo lỗi: chỉ đọc, đầy đĩa, còn lại; hằng `READ_ONLY` khớp Rust (`tauri-contract.test.ts`).
- [x] Exe release build từ nhánh này (sau đó chỉ đổi một comment Rust và tài liệu), mỗi ca một thư mục riêng, WebView2 nối cổng debug, không mạng, `project2c.db` lấy từ `load.db` của lượt 3:

| Ca | Kết quả |
|---|---|
| **K12** ACL file + thư mục, đọc được | Trang lỗi "App không có quyền ghi vào thư mục dữ liệu" kèm câu mới ("…quyền ghi và xóa file trong đó…"); hash `project2c.db` không đổi; không có `backups\` |
| **K13** thuộc tính chỉ đọc bật giữa phiên | Tạo team → dải "…file Project2C-data\project2c.db đang ở chế độ chỉ đọc…"; bấm X → hộp với câu chỉ đọc; Thử lại khi còn chỉ đọc → hộp hiện lại, file không đổi; bỏ chỉ đọc → Thử lại → thoát 0, file đã đổi, có backup |
| ACL đổi giữa phiên | Như K13 (cùng hai câu, cùng diễn biến) |
| **K14** chương trình khác giữ file (đọc + ghi, không xóa) giữa phiên | Dải và hộp vẫn ghi "…chương trình khác…" như cũ; thả file → Thử lại lưu được |
| K14 lúc mở | App mở bình thường, không trang lỗi |

- [x] Mỗi đột biến có test đỏ. Đã áp tạm từng cái, chạy, rồi trả file nguyên byte (kiểm hash):
  - M1 `open` chỉ xét thuộc tính (như #674) → `open_reports_a_database_file_its_access_list_…` đỏ.
  - M2 bỏ ánh xạ `READ_ONLY` ở `save` → hai test `a_save_…_read_only` đỏ.
  - M3 mọi `PermissionDenied` thành `READ_ONLY` → `a_save_a_program_holding_the_file_refuses_…` đỏ.
  - M4 thử `DELETE | FILE_WRITE_DATA` → `an_access_list_that_only_refuses_writing_…` đỏ.
  - M5 thử mở lỗi gì cũng là từ chối → `open_opens_a_file_another_program_holds_…` và `a_save_a_program_holding_…` đỏ.
  - M6 bỏ kiểm thuộc tính chỉ đọc → `open_reports_a_read_only_database_file_as_access_denied` và `a_save_after_the_file_turned_read_only_…` đỏ.
  - T1 `saveFailure` coi `READ_ONLY` là `other` → 3 test đỏ; T2 hộp đóng app một câu cố định → 2 đỏ; T3 dải một câu cố định → 2 đỏ; T4 hằng `READ_ONLY` lệch Rust → test hợp đồng đỏ.
- [x] `pnpm verify` xanh; `pnpm verify:rust` xanh (fmt, clippy `-D warnings`, 110 test).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `1ccfd5a`), 11 mục "Trùng file":

- L13 `storage.rs` `explorer_arg` không `#[cfg(any(windows, test))]`: **đã sửa phần `explorer_arg`**. Hai ý còn lại của mục (`open_lock_file` dùng `Some(32)`; closure `map_err` ngoài Windows) để lại: Issue chỉ gộp một dòng.
- L24 `CloseGuard.tsx` (#125, bấm X lúc seed; không có dấu "đang lưu"): để lại, ngoài phạm vi.
- L25 Cài đặt (#96, #87; sau một lần lưu lỗi "Nạp lại" bị từ chối): để lại; Owner 21/10 Q5 (a) giữ mục OPEN.
- L49 `vi.ts` (khuôn câu "AI đề xuất" ở `KycExtraction.tsx`): để lại, ngoài phạm vi.
- L57 `tauri-storage.ts` (`newPage` ≈ `newSessionId` của `packages/ai`): để lại, chỉ ghi lại; hai package không dùng chung code (ADR-0005).
- L80 `vi.ts` (`trash.customer.with`): để lại, ngoài phạm vi.
- L99 `vi.ts` `close.unsavedBody` nói "chương trình khác" cả khi đĩa đầy: **đã sửa** (hộp đóng app chọn câu theo `saveError()`).
- L101 `storage.rs` (`remove_interrupted_backups` lặp vòng; `saveError` ở `AppData` nên `SaveWarning` đọc hai store; `ACCESS_DENIED` gom mọi `PermissionDenied`): để lại. `CloseGuard` nay đọc `saveError` giống `SaveWarning`; đưa lỗi cuối vào `PersistQueue` cần sửa `persist-queue.ts`, ngoài danh sách file.
- L144 `tauri-contract.test.ts:294` (regex semver): để lại, ngoài phạm vi.
- L232 `vi.ts` (`policies.editLabel`, DR6-119): để lại, ngoài phạm vi.
- L240 `storage.rs` (DR6-67, mã lặp): để lại, hoãn sau v1.0.

Việc chuyển L13 (một phần) và L99 sang RESOLVED làm ở PR sổ sau review.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] `pnpm verify:rust` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (không thêm crate; ACL trong test dựng bằng `icacls`)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Chưa chạy `pnpm e2e` ở local: thay đổi không chạm bản web (dải lưu và hộp đóng app chỉ có ở exe); CI chạy. Test Rust dùng `icacls` lần đầu chạy trên runner của CI ở job build exe.

Rủi ro: `risk:med` (nhãn `build-exe`: sửa `src-tauri`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-275 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #196, #192, #620 — T-275 (#726, PR #750, `REVIEW: PASS` @`0733cc4`):
  - #196, #192, `apps/desktop/src-tauri/src/storage.rs` `explorer_arg`: nay có `#[cfg(any(windows, test))]`, build ngoài Windows không còn báo `dead_code`. Hai ý còn lại của mục (`open_lock_file` dùng `Some(32)`; closure `map_err` ngoài Windows) vẫn OPEN.
  - #620, `apps/desktop/src/i18n/vi.ts` `close.unsavedBody` (hộp đóng app nói "chương trình khác" cả khi đĩa đầy): hộp chọn câu theo `saveError()` qua `saveFailure` (`apps/desktop/src/data/tauri-storage.ts`), như dải lưu. Đĩa đầy → `close.unsavedBodyDiskFull`; file không thay được (chỉ đọc / ACL, mã `READ_ONLY`) → `close.unsavedBodyReadOnly`; còn lại giữ `close.unsavedBody`. Ca ở `apps/desktop/src/shell/CloseGuard.test.tsx`.

---

# Issue #727 — T-276: Mock trích xuất bớt đề xuất sai, gộp ghi chú OPEN của Mock (DR6-121)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **Mock trích xuất bớt đề xuất sai (DR6-121):** bỏ cụm khi trong cùng câu có (kể cả **sau** cụm):
   - "chưa / không" của câu hỏi, hoặc dấu "?" ("Lần gặp sau hỏi KH đã kết hôn chưa.", "Cần hỏi lại KH có 2 con không?");
   - từ phỏng đoán ("có lẽ", "hình như", "nghe nói", "chắc là");
   - "của <người khác>" ngay sau "<n> con / cháu" ("2 con của anh trai");
   - "ly hôn" sau "đã kết hôn";
   - "người" trước "đã kết hôn / độc thân" ("gói cho người đã kết hôn");
   - "con" là loại từ của đồ vật ngoài danh sách ("3 con Lexus", "2 con robot").

   Giữ "Narrow on purpose": không thêm đề xuất nào mà bản hiện tại không có.
2. **Gộp các ghi chú OPEN của Mock (#628 / #682) cùng file** (dưới): đề xuất sai / sót còn lại, test hở, hai mùi code.

##### Bối cảnh

Deep review Phase 1–6 lượt 3 (T-267 #714), nhóm **L3-H**; Owner 19/10: sửa hết. #682 sửa DR6-78 / DR6-79: chủ thể, giả định, phủ định đứng **trước** cụm, đọc một lượt. Các dạng câu trên nằm ngoài danh sách đó và ngoài ghi chú "chỉ ghi lại" của #682; kết quả giống hệt `4217ed4`. Mock là provider mặc định khi chưa có key, trên bản web và khi nghiệm thu; đề xuất không tự lưu.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §6.6 (DR6-121), §8.2 L3-H
- `docs/reviews/raw/2026-10-21/claude/C.md` CL3-C2 (kịch bản K5, K6; probe `p03-mock-extraction`)
- `docs/state/review-notes.md` các mục OPEN của `packages/ai/src/mock-adapter.ts` (review #628, #682)
- `docs/design/phase-5-ai.md` §8 (AI trích xuất), prompt `extraction@1` quy tắc 1 (`docs/design/phase-5-prompts.md` §4.2)
- `packages/ai/src/mock-adapter.ts` (đủ), `packages/ai/src/mock-adapter.test.ts`

##### File / thư mục được phép sửa

- `packages/ai/src/{mock-adapter.ts,mock-adapter.test.ts}`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `98d0016`), **gộp hết** các mục của `mock-adapter.ts`:

- L107 ("con" / "cháu" / "bạn" trước cụm làm rơi dữ kiện của KH);
- L160 ("vợ" / "chồng" đứng riêng);
- L161 (từ thân tộc trong từ ghép: "Ghi chú:", "đàn ông", "cô dâu"…);
- L162 (`NOT_SO` ước muốn làm rơi dữ kiện thật);
- L163 (cờ `giu` làm "Con" viết hoa thành số con);
- L164 (test hở: "má", "thím|dượng", "giả sử", "hy vọng", trần 20…);
- L165 ("chỉ ghi lại": "Ba ruột / Ba nuôi…", thú cưng, "giả thử", "khi … thì", "sắp / sẽ", "…");
- L166 (`aboutTheKh` chia câu hai lần);
- L167 (`found` hai nghĩa).

Để lại: L222 (DR6-67, hoãn sau v1.0).

##### Interface / hợp đồng

- Chữ ký adapter giữ nguyên; chỉ Mock, OpenCode không bị ảnh hưởng.

##### Test chấp nhận

- [ ] Các câu của CL3-C2 (10 câu) và các câu "chỉ ghi lại" của L165 → 0 đề xuất sai; câu đúng về KH ("KH đã kết hôn, có 2 con.", "KH đã có vợ và 2 con.") giữ đề xuất.
- [ ] Mọi ghi chú RE của dữ liệu tải + seed ở 3 ngày neo: đề xuất như bản trước (đo như K5 của CL3-C2: 0 / 3 551 khác), trừ các ca chủ định ghi trong PR.
- [ ] Ghi chú một dòng 36 000 ký tự vẫn < 50 ms (test DR6-79 xanh).
- [ ] Mỗi mục test hở của L164 có test đỏ khi gỡ.

Ước lượng: ≈ 20–40 dòng SP + ≈ 80 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #753 — fix: read what a Mock extraction note says around a phrase, and clear its review notes (T-276)

Trạng thái: MERGED · merge 2026-10-22T11:35:55Z · commit `cbdb590cb4a5cf7e6cb8fd81070ccea2d7961f76` · nhánh `task/T-276-mock-extraction` · nhãn: type:task, risk:low

Closes #727

#### Thay đổi

T-276, nhóm L3-H của deep review Phase 1–6 lượt 3: DR6-121 (CL3-C2) và gộp 9 ghi chú OPEN của `packages/ai/src/mock-adapter.ts` (review PR #628, #682). Chỉ sửa hai file được phép (`mock-adapter.ts`, `mock-adapter.test.ts`); OpenCode và chữ ký adapter không đổi.

##### Vòng sửa 2 (`REVIEW: CHANGES` @ `0c9d986`, sửa ở `08adb3d`)

Mục chặn của review: "Ba em bé đã kết hôn." thành đề xuất sai mới. Vòng 1 bỏ "em" khỏi danh sách chữ đứng sau "ba" trong khi PR miễn "em bé", nên "ba em bé" không còn chữ nào là người khác; câu "bỏ không đổi hành vi" của Lệch 4 sai. Đã sửa, cùng các câu cùng cơ chế mà review chưa nêu. Tái hiện trên ba bản (`main` @ `f981ddc` → `0c9d986` → `08adb3d`):

| Câu | main | `0c9d986` | `08adb3d` |
|---|---|---|---|
| Ba em bé đã kết hôn. / Ba em bé có 2 con riêng. / KH có em bé, ba em bé đã có 2 con riêng. (review, chặn) | — | đề xuất | — |
| KH có ba em bé, đã kết hôn. ("ba" là số; review: lại như `main`, hợp CX-A4) | — | Đã kết hôn | — |
| Anh em bé đã kết hôn. / Chị em bé đã có 2 con. / Anh chị em bé đều đã kết hôn. (cùng cơ chế, review không nêu) | — | đề xuất | — |
| Em béo của KH đã kết hôn. (review, không chặn) | — | Đã kết hôn | — |
| KH đi đám cưới bạn / đi ăn cưới đồng nghiệp / dự tiệc cưới / nhận thiệp cưới / dự lễ cưới / đi mừng cưới / đi cưới bạn … đã có 2 con. (review nêu "đám / ăn / tiệc / thiệp", không chặn; 7 câu) | — | Số con 2 | — |
| KH đi đám cưới chồng cũ đã có 2 con. (cùng họ, thấy khi sửa) | — | Số con 2 | — |
| KH có em bé, đã kết hôn, có 2 con. / KH cưới người quen năm 2015, có 2 con. / KH cưới vợ năm 2015, có 2 con. (ca chủ định) | — | đề xuất | như `0c9d986` |

1. **"em" trở lại danh sách sau "ba"** như `main` (`ba(?= (?:của|kh|anh|chị|em|ấy|ruột|nuôi)…)`), và **"anh em", "chị em" thành từ chỉ người riêng**. "em bé" không là người khác, nên "ba / anh / chị" đứng ngay trước nó (ba chữ này không tự là người khác) phải được đọc cùng "em". Các từ thân tộc khác trước "em bé" ("bố", "mẹ", "cô", "chú"…) tự là người khác.
2. **"em bé" chỉ được miễn khi "bé" trọn chữ** (`em(?! bé(?!\p{L}))`): "em béo" là người khác như `main`.
3. **"cưới" của đám cưới không làm người đứng sau thành vợ / chồng / bạn mà KH cưới** (`MARRYING`): không miễn khi trước "cưới" là "đám / ăn / tiệc / thiệp / lễ / mừng / đi". Áp cho cả danh sách "bạn / đồng nghiệp / người quen…" lẫn "vợ / chồng" (`OWN_SPOUSE`). "KH cưới người quen…", "KH cưới vợ…" giữ đề xuất.
4. **Rút gọn theo review:** `AFTER_CHO` thành chuỗi `'cho '`, kiểm bằng `note.endsWith(unwishedAfter, match.index)` (tương đương regex sticky cũ: cùng phân biệt hoa thường, cùng không đọc đầu từ). Bỏ `matchesAt` và trạng thái `lastIndex` dùng chung; `unwishedAt?: RegExp` thành `unwishedAfter?: string`.

So với `0c9d986`, bản sửa chỉ bớt đề xuất, không thêm (fuzz ở "Test chấp nhận"). 85 câu của hai vòng review trước và của các bảng trong thân PR cho đúng kết quả như `0c9d986`.

Review ghi không chặn, **không sửa ở vòng này** (ghi sổ sau review):

- "Em Bé" viết hoa (tên gọi "Bé") vẫn được miễn như "em bé". `SOMEONE_ELSE` có cờ `i`; muốn đọc riêng hoa thường của một chữ thì cần modifier `(?-i:…)` (ES2025, nếu WebView2 cũ không nhận thì regex lỗi khi nạp module) hoặc tách lần kiểm khỏi regex, không đáng cho một tên gọi hiếm gặp.
- "chú thích" / "bác bỏ" cũng đọc được là "chú / bác + động từ" ("Chú thích sống độc thân."): cùng mục sổ "đàn ông / cô dâu" của vòng 1.
- "cho" ngay trước số tha cả con chưa sinh ("cho 2 con sắp sinh", "cho 2 con tương lai"): giới hạn đã nêu ở Lệch 7.
- "KH là người độc thân…" không ra đề xuất (âm tính giả mới, hợp CX-A4). Không miễn "là người" vì khi đó "gói dành cho khách là người độc thân" lại thành đề xuất sai.
- "của ba KH" / "của Anh trai", "chưa" giữa vế của câu hỏi: giống `main`, cùng mục sổ của vòng 1. *Data Clumps* `(part, start)` vẫn còn.

##### Vòng sửa 1 (`REVIEW: CHANGES` @ `84c9522`, sửa ở `0c9d986`)

Ba mục chặn của review đều là đề xuất sai mới (`main` không đề xuất, bản trước vòng sửa đề xuất). Đã sửa cả ba; tái hiện từng câu của review trên ba bản (`main` @ `f981ddc` → `84c9522` → `0c9d986`):

| Câu | main | `84c9522` | `0c9d986` |
|---|---|---|---|
| KH dự định 2 năm nữa sinh thêm 1 con. / KH muốn trong 5 năm tới có 2 con. / KH mong muốn sớm có được 2 con. (8 câu của review) | — | Số con | — |
| KH muốn đợi đến khi đã kết hôn rồi mới mua bảo hiểm. / KH dự định mua nhà sau khi đã kết hôn. / KH muốn trước 30 tuổi đã kết hôn. (4 câu) | — | Đã kết hôn | — |
| Anh chị em của KH đều đã kết hôn. / Ba anh em KH đều đã kết hôn. / KH có ba anh em, cả ba đã kết hôn. / Anh em KH đều có 2 con. / Chị Thanh em KH đã kết hôn. (9 câu) | — | đề xuất | — |
| Muốn có thêm 2 con. / Dự định có 3 con. / Mong có 2 con. / Hy vọng sinh 2 con. (từ ước muốn viết hoa mở câu; review không nêu, thấy khi sửa) | — | Số con | — |
| KH sẽ cho 2 con đi học thêm. | Số con 2 | — | Số con 2 |
| KH muốn đầu tư cho 2 con. | — | Số con 2 | Số con 2 |

1. **Từ ước muốn chặn theo vế, không theo cửa sổ hai chữ.** `muốn / mong / dự định / hy vọng / hi vọng` chặn mọi cụm đứng sau chúng trong vế, như `NOT_SO` của `main`, cho cả "<n> con", "đã kết hôn" và "độc thân" (bản trước không đọc chúng trước "đã kết hôn" và chỉ đọc hai chữ trước hai cụm kia). Chỉ cụm "<n> con" có **"cho" ngay trước** được tha: "KH muốn đầu tư cho 2 con." vẫn ra Số con 2 (L151); "muốn nhận nuôi 2 con", "muốn có đủ 2 con", "muốn sinh cho đủ 2 con" không đề xuất. Từ ước muốn viết hoa mở câu ("Muốn có thêm 2 con.") cũng chặn: cửa sổ cũ nằm trong mẫu số con, không có cờ `i`, nên bỏ sót (bốn câu như vậy ra Số con ở `84c9522`). "sắp / sẽ" (thêm ở PR này, `main` không đọc) giữ cửa sổ hai chữ, nay **bắt buộc** "có / sinh / đẻ / nhận nuôi [thêm / được]" ngay trước số con (cửa sổ cũ chặn cả "KH sẽ cho 2 con đi học thêm.", câu `main` đề xuất đúng).
2. **"anh em / chị em / anh chị em / ba anh em" là người khác.** Chúng là anh chị em của KH, chủ ngữ của cụm sau; ngoại lệ "em" sau "anh / chị" (đọc cả "Thanh", "Quỳnh Anh" như "anh") và ngoại lệ "ba anh em" bỏ. Giữ các ngoại lệ thật sự không chỉ ai: "ghi chú", "chú thích", "chú trọng", "bác bỏ", "em bé", "đàn ông", "cô dâu".
3. **Mục "mùi" của review.** `PEOPLE`, `PLANNING`, `NOT_OF_ANYONE` đọc **một dấu cách**: một ghi chú có cụm đứng sau 36 000 dấu cách mất ≈ 1 s ở `84c9522` ("KH" + dấu cách + "độc thân"; "… em đã kết hôn"; "KH có" + dấu cách + "vợ và 2 con"), nay ≈ 1 ms như `main`; ba dòng test mới trong bài DR6-79. Đặt tên lại: lookbehind phủ định `WISHED` → `PLANNING` / `NOT_PLANNED` / `NOT_PLANNED_CHILDREN`, `ANYONE` → `NOT_OF_ANYONE`, thêm `AFTER_CHO`; `WISHED` nay là regex của vế như `NEGATED`; `s` / `c` → `inSentence` / `inClause`.

Review ghi không chặn, **không sửa ở vòng này** (đều giống `main` hoặc ngoài danh sách Issue; để ghi sổ sau review): "đàn ông" / "cô dâu" làm chủ ngữ (Issue nêu tên hai từ này); vợ / chồng / bạn của KH làm chủ ngữ của vị ngữ ngay sau trong cùng vế ("KH lấy chồng đã có 2 con riêng."); "của <họ hàng viết hoa>" ("KH nuôi 2 con của Anh trai."); câu hỏi có tiểu từ / "hay" và phỏng đoán ngoài bốn từ của Issue; mùi *Data Clumps* `(part, start)`.

##### DR6-121: Mock bớt đề xuất sai

Không đề xuất cụm khi, trong câu hay vế của nó:

- là câu hỏi: có "?" trong câu, hoặc một vế kết thúc bằng "chưa" / "không";
- có từ phỏng đoán, trước hay sau cụm: "có lẽ", "hình như", "nghe nói", "chắc là";
- "<n> con / cháu" đi với "của <người khác>" ("2 con của anh trai");
- "đã kết hôn" mà sau đó trong câu có "ly hôn";
- "người" đứng ngay trước cụm ("gói cho người đã kết hôn");
- cụm nằm giữa "khi … thì";
- "con" là tên, thương hiệu hay đồ vật ngoài danh sách ("3 con Lexus", "2 con robot"; chữ hoa sau "con" là tên).

Cũ → mới trên các câu của CL3-C2 và các câu "chỉ ghi lại" (script đo ở phiên đầu, không commit; qua adapter, V1 / V7 chạy sau như app):

| Câu | Trước | Sau |
|---|---|---|
| Lần gặp sau hỏi KH đã kết hôn chưa. | Đã kết hôn | — |
| Cần hỏi lại KH có 2 con không? | Số con 2 | — |
| Có lẽ KH đã kết hôn. / Hình như KH có 2 con. / Nghe nói KH đã kết hôn. | đề xuất | — |
| KH đang nuôi 2 con của anh trai đã mất. / KH chăm 3 cháu của chị gái. | Số con 2 / 3 | — |
| KH đã kết hôn nhưng đã ly hôn năm 2020. | Đã kết hôn | — |
| KH hỏi về gói cho người đã kết hôn. / Gói này dành cho người độc thân. | đề xuất | — |
| KH sở hữu 3 con Lexus. / KH mua 2 con robot hút bụi. | Số con 3 / 2 | — |
| Ba ruột (nuôi) của KH có 5 con. | Số con 5 | — |
| KH nuôi 2 con vẹt / 3 con cún / 2 con thú cưng / 3 con vật nuôi. | Số con | — |
| Giả thử KH đã kết hôn… / Khi KH đã kết hôn thì cần… | Đã kết hôn | — |
| KH sắp có 2 con. / KH sẽ có 2 con. | Số con 2 | — |
| Chưa rõ KH đã kết hôn. / Không biết KH đã kết hôn chưa. | — | — |
| KH đã kết hôn, có 2 con. | 2 đề xuất | 2 đề xuất |

**Gộp ghi chú OPEN của Mock** (chi tiết ở mục "Ghi chú OPEN liên quan"):

- Vợ / chồng / bạn của chính KH không còn làm rơi dữ kiện của KH: "KH đã có vợ và 2 con." → Số con 2 (trước: không có gì); "KH đã kết hôn với bạn học cũ, có 2 con." → cả hai. "cưới" của đám cưới không tính: "KH đi ăn cưới đồng nghiệp đã có 2 con." không đề xuất (vòng sửa 2).
- Từ ghép chứa từ thân tộc nhưng không chỉ ai ("Ghi chú:", "chú thích", "đàn ông", "em bé", "bác bỏ", "cô dâu") không còn chặn. "anh em", "chị em", "ba anh em" vẫn là người khác (vòng sửa 1); "ba / anh / chị" ngay trước "em bé" là người thân của em bé, "em béo" là người khác (vòng sửa 2).
- Từ ước muốn chặn theo vế như trước PR; chỉ "KH muốn đầu tư cho 2 con." (có "cho" ngay trước số) → Số con 2. "muốn có", "mong rất sớm sinh", "dự định sống độc thân", "dự định 2 năm nữa sinh thêm 1 con" không đề xuất.
- "Con" viết hoa không còn bị đọc thành số con ("KH có 2 Con." → không đề xuất): chỗ duy nhất bản sau #682 đề xuất nhiều hơn bản trước.
- Mỗi lựa chọn trong regex có test đỏ khi gỡ (kiểm đột biến ở dưới); trần 20 đếm trong các cụm về KH.
- Mỗi câu / vế đọc một lần cho mọi kiểm tra (`readerOf` dùng chung, `firstEnd` / `lastStart` thay `found`).

Cỡ: +212 / −61 dòng sản phẩm (gần một nửa là regex và chú thích), +277 / −3 dòng test (tổng +489 / −64; vòng sửa 2: +25 / −23 và +16); vượt ước lượng của Issue (≈ 20–40 và ≈ 80) vì gộp hết 9 ghi chú, vẫn dưới trần ~400 / ~800.

##### Lệch so với Issue

**1. "chưa / không" tính theo vế, "?" theo câu.** Issue ghi "cùng câu". Vế kết thúc bằng "chưa / không" là câu hỏi; "chưa" cuối một câu có nhiều vế là lời kể: "KH đã kết hôn, có 2 con, bảo hiểm thì chưa." vẫn đề xuất cả hai (bản theo câu bỏ cả hai). "?" tính theo câu như Issue.

**2. L105: "con / cháu" để lại, "bạn" sửa một phần.** Xem dòng L105 ở dưới: mở cho "KH có 2 con, đã kết hôn." thì "KH có 2 con, cả hai đã kết hôn." thành đề xuất sai; ba câu có test giữ hành vi hiện tại ("Narrow on purpose", CX-A4).

**3. "…" (U+2026) giữ không là dấu hết câu** (ghi chú L154): tách câu ở "…" chỉ thêm đề xuất sai ("Em trai KH… độc thân"), không tách chỉ làm mất dữ kiện sau dấu.

**4. Ngoài danh sách của ghi chú, cùng họ:** "cưới" cạnh "có / cùng / với / lấy" trước "vợ / chồng"; "thêm / được" sau "có / sinh", và "đẻ / nhận nuôi", của "sắp / sẽ"; "thú", "vật", "cún" cạnh "vẹt" (thú cưng, vật nuôi); "chú thích" cạnh "ghi chú". Bỏ "má / mẹ" khỏi danh sách đứng sau "ba": mỗi từ đã tự là người khác, nên bỏ không đổi hành vi (đột biến tương đương, không test nào giết được). Vòng 1 bỏ cả "em" với cùng lý do, nhưng lý do đó sai với "em": "em bé" không là người khác, nên "ba em bé" chỉ bị chặn nhờ nhánh "ba". Vòng sửa 2 trả "em" lại (mục chặn của review).

**5. Hai câu test cũ đổi** theo ghi chú L153: "KH muốn kiểm tra 9 con số…" → "KH cần kiểm tra…" (để "số" tự giữ), "Ông bà có 3 cháu nội." → "KH có 3 cháu nội." (để "nội" tự giữ). Test thời gian DR6-79 nới `toBe(36_003)` thành `≥ 36_000` để thêm hàng "đã kết hôn" × 3 273 (36 006 ký tự) và ba hàng dấu cách (vòng sửa 1).

**6. "bạn" sau "với" / "có" giữ nguyên là người khác** (chỉ "kết hôn với / lấy / cưới" mới đổi): "KH nói chuyện với bạn đã kết hôn." phải không đề xuất; có test.

**7. Từ ước muốn theo vế, "cho <n> con" là ngoại lệ duy nhất (vòng sửa 1).** Ghi chú L151 xin chỉ tính từ ước muốn "ngay trước có / sinh"; cài theo chữ đó làm lọt "muốn trong 5 năm tới có 2 con" (review). Đọc theo vế như `NOT_SO` giữ hành vi `main`; chỉ "cho" ngay trước số được tha, vì không có chữ nào khác ngay trước số phân biệt "muốn lo học phí của 2 con" (dữ kiện thật) với "muốn nhận nuôi 2 con" (chưa có).

**8. "anh em / chị em / ba anh em" là người khác (vòng sửa 1).** Ghi chú L150 xếp chúng cùng "từ ghép không chỉ ai", nhưng đó là anh chị em của KH, chủ ngữ của cụm sau ("Anh chị em của KH đều đã kết hôn." ra Đã kết hôn). Như "con / cháu" ở L105: "KH có ba anh em, đã kết hôn." chỉ cho Đã kết hôn khi biết ai kết hôn, nên không đề xuất (CX-A4).

**9. Một dấu cách giữa các chữ của từ chỉ người, của "sắp / sẽ" và của "người" (vòng sửa 1).** Ngoại lệ "cô  giáo" hai dấu cách (phần L150 PR đã làm) trở lại là người khác: ghi chú đã lưu không có hai dấu cách liền (`normalizeNote`), còn `\s+` trong lookbehind của `SOMEONE_ELSE` tốn ≈ 1 s ở 36 000 dấu cách.

**10. "anh / chị em bé" và "cưới" của đám cưới (vòng sửa 2).** Ngoài câu review nêu ("ba em bé"), "anh em bé" / "chị em bé" cùng cơ chế nên sửa luôn. Với đám cưới, review gợi ý "đám / ăn / tiệc / thiệp"; PR thêm "lễ / mừng / đi cưới" (cùng nghĩa dự đám cưới) và áp cho cả "vợ / chồng" ("đám cưới chồng cũ"). Cả hai chỉ bớt đề xuất, trở về hành vi của `main` ở các câu đó.

#### Test chấp nhận

- [x] Các câu của CL3-C2 (10 câu) và các câu "chỉ ghi lại" của L154 → không đề xuất (bảng trên; test `proposes nothing from … (DR6-121)` và các nhóm cùng họ). Câu đúng về KH giữ đề xuất ("KH đã kết hôn, có 2 con.", "KH đã có vợ và 2 con.", "Hai vợ chồng đã kết hôn, có 2 con đang học cấp 1.").
- [x] K5, đo lại ở `08adb3d` (Office Laptop, script mới ở phiên này, không commit): mọi ghi chú `kyc_notes` nguồn RE của dữ liệu tải (`LOAD_SCALE`, mốc 12/10/2026, seed 6, có Thùng rác như `buildLoadData`: 2 292 ghi chú khác nhau) và của seed demo ở 3 ngày neo (20/10/2026, 28/02/2026, 31/12/2027, seed 1: 1 259 ghi chú thêm): **3 551 ghi chú khác nhau, 0 khác `main`, 0 khác `0c9d986`** (1 332 = 1 332 = 1 332 đề xuất: 670 "Độc thân", 662 "Đã kết hôn"), đúng số của báo cáo CL3-C2. Dữ liệu dựng bằng chính `seedDemoData` với tham số của `tools/load-data-core.mjs`; bản cũ lấy từ `main` @ `f981ddc` và `0c9d986`. Ghi chú thật chỉ có dạng "Hôn nhân: Đã kết hôn; Số con: N; …", không có "<n> con" nên không ca chủ định nào chạm tới.
- [x] Ghi chú một dòng 36 000 ký tự < 50 ms (best of 3 trong một tiến trình, Node 24, Office Laptop, `main` → `0c9d986` → `08adb3d`): "độc thân" × 4 000 (36 003) 2,2 → 3,8 → 3,6 ms; "có 2 con và " × 3 000 (36 003) 0,6 → 0,6 → 0,5 ms; "đã kết hôn " × 3 273 (36 006) 1,8 → 1,8 → 1,9 ms; "KH" + 36 000 dấu cách + "độc thân" (bản `84c9522` ≈ 1 000 ms) 0,9 → 1,0 → 1,0 ms; hai hàng dấu cách còn lại ≤ 1,0 ms. Thêm ở vòng sửa 2 (không vào test): "đi ăn cưới bạn " × 2 250 (33 761) 0,2 → 1,2 → 0,5 ms; "anh em bé " × 3 600 (36 013) 0,2 → 1,2 → 0,5 ms. Tuyến tính; test DR6-79 xanh, ba hàng dấu cách đỏ ở `84c9522` (≈ 1 s), xanh từ `0c9d986`.
- [x] Mỗi mục test hở của L153 có test đỏ khi gỡ: má, thím, dượng, giả sử, hy vọng, hi vọng, xe, tàu, thuyền, dao, chú trọng, trần 20 (`slice(0, 19)` và cắt 20 trước khi lọc KH, hai hàng riêng). Kiểm đột biến lượt đầu của PR: 139 mutant, 0 sống (trên code trước vòng sửa). Vòng sửa 1, phần đổi: 52 mutant (từng từ ước muốn, cờ `i`, đọc theo vế, ngoại lệ "cho", `{0,2}`, `[Ss]`, từng động từ và từng chữ đệm của "sắp / sẽ", `NOT_PLANNED(_CHILDREN)`, `NOT_OF_ANYONE`, ngoại lệ "em" sau "anh / chị", từng nhánh của "ba", `readClause`): **46 bị diệt**, trong đó hai (`Sẽ` hoa, đúng ba chữ đệm) sau khi thêm "Sẽ có 2 con." và "KH sẽ cân nhắc vì có 2 con."; **6 sống, không test nào diệt được**: guard biên `(?<!\p{L})` / `(?!\p{L})` của từ ước muốn (2), của "sắp / sẽ" (1) và của "người" (1), giống bảy guard có từ trước PR (`NEGATED`, `GUESSED`, `ASKED`, `WHEN`, `THEN`: 7 / 7 sống); `<` thay `<=` ở vị trí từ ước muốn, như `negated` / `someoneElse` có từ trước; và `(?! (?:anh|chị)(?: chị)? em)` thêm vào "ba" (tương đương: "em" vẫn chặn). Vòng sửa 2, phần đổi: 19 mutant (bỏ "em" sau "ba"; bỏ "anh em"; bỏ "chị em"; "bé" không trọn chữ; bỏ miễn "em bé"; bỏ từng chữ trong 7 chữ của `MARRYING`; `MARRYING` thành "cưới" trơn; bỏ "cưới" khỏi danh sách bạn; `OWN_SPOUSE` với "cưới" trơn và không có "cưới"; `AFTER_CHO` thiếu dấu cách; "cho" tha ở mọi nơi / không bao giờ): **19 / 19 bị diệt**. Chạy chính `mock-adapter.test.ts` trên từng bản đột biến qua alias Vitest, không sửa worktree; bản không đổi qua cùng alias thì sống (kiểm cách đo).
- [x] Fuzz vi sai (script ở phiên này, không commit), cũ ↔ mới. Lượt đầu: ≈ 20 000 và ≈ 29 000 ghi chú ngẫu nhiên. Vòng sửa 1: 250 000 ghi chú ghép từ bộ từ vựng **không có luật chủ định** (không từ ghép, không vợ / chồng / bạn sau "có / cùng / với / lấy / cưới", không "cho" đi với từ ước muốn, không "Con" hoa) → **0 đề xuất mới so với `main`**; 120 000 ghi chú bộ từ vựng đầy đủ → mọi đề xuất mới so với `main` đi kèm một luật chủ định (từ ghép, vợ / chồng / bạn của KH, "cho <n> con", "Con" viết hoa); 64 câu viết tay ở các họ ước muốn, kế hoạch, anh chị em, vợ / chồng, câu hỏi → đề xuất mới so với `main` chỉ ở các luật chủ định. Vòng sửa 2 (`0c9d986` ↔ `08adb3d`): 200 000 ghi chú bộ từ vựng đầy đủ (thêm "em bé", "Em Bé", "em béo", "ba / anh / chị" trước "em bé", các từ đám cưới…) → **0 đề xuất mới**; 2 118 ghi chú bớt đề xuất, ghi chú nào cũng có một trong ba luật của vòng này ("ba / anh / chị em bé" 1 419, "em béo" 695, "cưới" của đám cưới trước bạn / vợ / chồng 182; một ghi chú có thể có nhiều luật). 100 000 ghi chú bộ từ thường → 0 khác `0c9d986`; so với `main` có 101 ghi chú có đề xuất mới, cả 101 có "và / có / cùng / với / lấy / cưới" ngay trước "vợ / chồng" (L149, chủ định).
- [ ] e2e `customer-ai.spec.ts` + `customer-ai-web.spec.ts` (có ca AI trích xuất bằng Mock): 27 / 27 ở `84c9522`; CI xanh ở `0c9d986`; ở `08adb3d` do CI chạy (ghi chú e2e `Hai vợ chồng đã kết hôn, có 2 con đang học cấp 1.` ra cùng đề xuất ở cả ba bản).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `f981ddc`): 9 mục "Trùng file".

- L105 (`SOMEONE_ELSE`, "con / cháu / bạn" trước cụm): **một phần.** "bạn" (và sếp, hàng xóm, người quen, đồng nghiệp, người thân, họ hàng) ngay sau "kết hôn với / lấy / cưới" là người phối ngẫu của KH, không chặn. "con / cháu" **để lại + lý do:** mở cho "KH có 2 con, đã kết hôn." thì "KH có 2 con, cả hai đã kết hôn." cũng thành đề xuất sai "Đã kết hôn"; Mock giữ "Narrow on purpose". Ba câu "KH có 2 con, đã kết hôn." / "…, cả hai đã kết hôn." / "KH có 2 con đã kết hôn." có test giữ hành vi (chỉ đề xuất Số con). "bạn" sau "với / có" để lại: "KH nói chuyện với bạn đã kết hôn." phải không đề xuất.
- L149 (`SOMEONE_ELSE`, "vợ" / "chồng" đứng riêng): **đã sửa.** "có / cùng / với / lấy / cưới / và" ngay trước là vợ / chồng của KH; "cưới" của đám cưới ("KH đi đám cưới chồng cũ…") thì không (vòng sửa 2). Phần còn lại, vợ / chồng / bạn của KH là chủ ngữ của vị ngữ ngay sau trong cùng vế ("KH lấy chồng đã có 2 con riêng." → Số con 2): review PR #753 ghi không chặn, **để lại + lý do:** cần đọc cả vế sau từ đó, ngoài cỡ task; ghi sổ.
- L150 (`SOMEONE_ELSE`, từ thân tộc trong từ ghép): **một phần.** "ghi chú", "chú thích", "chú trọng", "đàn ông", "em bé" (khi "bé" trọn chữ và không có "ba / anh / chị" ngay trước, vòng sửa 2), "bác bỏ", "cô dâu" không chặn. **Để lại + lý do:** "anh em / chị em / anh chị em / ba anh em" (là anh chị em của KH, chủ ngữ của cụm sau: "Anh chị em của KH đều đã kết hôn." ra Đã kết hôn sai; review PR #753, Lệch 8) và dấu cách đôi ("cô  giáo": một dấu cách như "anh trai", Lệch 9).
- L151 (`NOT_SO`, ước muốn làm rơi dữ kiện thật): **một phần.** Từ ước muốn chặn theo vế như `NOT_SO` (`NEGATED` tách ra cho không / chưa / chẳng); cụm "<n> con" có "cho" ngay trước được tha: "KH muốn đầu tư cho 2 con." → Số con 2. **Để lại + lý do:** "KH muốn lo học phí của 2 con." (không có "cho" ngay trước) vẫn không đề xuất như `main`, vì chữ ngay trước số không phân biệt nó với "muốn nhận nuôi 2 con" (Lệch 7).
- L152 (mẫu `childrenCount`, cờ `giu` làm "Con" viết hoa thành số con): **đã sửa.** Bỏ cờ `i` của mẫu số con (như trước #682); chữ hoa sau "con" là tên / thương hiệu.
- L153 (`mock-adapter.test.ts`, test hở): **đã sửa.** Xem "Test chấp nhận" (đột biến, trần 20, hai câu gián tiếp đổi).
- L154 (chỉ ghi lại, đề xuất sai ngoài DR6-78): **đã sửa** ("Ba ruột / nuôi", vật nuôi / thú cưng / vẹt, "giả thử", "khi … thì", "sắp / sẽ có"), **trừ "…" (U+2026) để lại + lý do:** tách câu ở "…" chỉ thêm đề xuất sai, không tách chỉ làm mất dữ kiện sau dấu.
- L155 (*Duplicated Code*, `aboutTheKh` chia câu hai lần): **đã sửa** phần Mock: `readerOf` tách mỗi bộ dấu một lần, dùng cho cả bốn kiểm tra theo câu và kiểm "ly hôn". Phần e2e (`customer-ai-web.spec.ts:249-253` chép từ `customer-ai.spec.ts:155-159`) **để lại:** ngoài danh sách file, ghi chú tự nói "khi có nơi thứ ba".
- L156 (*Mysterious Name*, `found`): **đã sửa** phần Mock (`wordBefore` / `found` thay bằng `readerOf` / `firstEnd` / `lastStart`). `canvas` ở `e2e/support.ts` **để lại:** ngoài danh sách file.

Mục "Trong vùng" L244 (DR6-67, hoãn sau v1.0) không chạm.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local ở `08adb3d` (lint, typecheck, ranh giới module, 3 419 test, coverage `packages/ai` 100 %: `mock-adapter.ts` 75 / 75 dòng, 35 / 35 nhánh)
- [x] Không thêm dependency ngoài ADR-0005 (không đổi dependency)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md` (head đổi sau `REVIEW: CHANGES` @ `0c9d986`: cần review lại ở `08adb3d`)

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-276 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #628, #682 — T-276 (#727, PR #753, `REVIEW: PASS` @`08adb3d`), Mock trích xuất `packages/ai/src/mock-adapter.ts`. Tác dụng phụ còn lại của các luật mới: mục review #753 ở OPEN.
  - #628, `SOMEONE_ELSE` ("con" / "cháu" / "bạn" trước cụm): "bạn" (và sếp, hàng xóm, người quen, đồng nghiệp, người thân, họ hàng) ngay sau "kết hôn với / lấy / cưới" là người KH cưới, không chặn: "KH đã kết hôn với bạn học cũ, có 2 con." → cả hai đề xuất. "con / cháu" giữ có chủ ý (CX-A4): mở ra thì "KH có 2 con, cả hai đã kết hôn." thành đề xuất sai; ba ca ở `packages/ai/src/mock-adapter.test.ts` giữ hành vi.
  - #682, "vợ" / "chồng" đứng riêng: "có / cùng / với / lấy / cưới / và" ngay trước là vợ / chồng của KH ("KH đã có vợ và 2 con.", "KH sống cùng vợ và 2 con.", "KH đã lấy chồng, có 2 con." → Số con 2); "cưới" của đám cưới thì không (`MARRYING`).
  - #682, từ ghép chứa từ thân tộc: "ghi chú", "chú thích", "chú trọng", "đàn ông", "em bé", "bác bỏ", "cô dâu" không còn chặn ("Ghi chú: KH đã kết hôn, có 2 con." → cả hai đề xuất). Không làm, có lý do: "anh em / chị em / anh chị em / ba anh em" là anh chị em của KH, vẫn là người khác (review #753 vòng 1: "Anh chị em của KH đều đã kết hôn." không được ra Đã kết hôn); dấu cách đôi ("cô  giáo") không có trong ghi chú đã lưu (`normalizeNote`).
  - #682, `NOT_SO` (ước muốn làm rơi dữ kiện thật): từ ước muốn vẫn chặn cả vế (`WISHED`); riêng "<n> con" có "cho" ngay trước được tha ("KH muốn đầu tư cho 2 con." → Số con 2). Chỉ tính "ngay trước có / sinh" như ghi chú gợi ý thì lọt "KH muốn trong 5 năm tới có 2 con." (review #753 vòng 1). "KH muốn lo học phí của 2 con." vẫn không đề xuất như `main`: không chữ nào ngay trước số phân biệt nó với "muốn nhận nuôi 2 con".
  - #682, cờ `giu` của mẫu `childrenCount`: mẫu số con bỏ cờ `i`; chữ hoa sau "con" là tên / thương hiệu ("KH có 2 Con.", "Họp ngày 15 Con trai KH đến." → không đề xuất).
  - #682, test hở của `packages/ai/src/mock-adapter.test.ts`: má, thím, dượng, giả sử, hy vọng, hi vọng, xe, tàu, thuyền, dao, chú trọng, trần 20 (`slice(0, 19)`, cắt 20 trước khi lọc KH) đều có test đỏ khi gỡ; hai câu gián tiếp đổi thành câu về KH ("KH cần kiểm tra 9 con số…", "KH có 3 cháu nội.").
  - #682, "chỉ ghi lại" ngoài DR6-78: "Ba ruột / Ba nuôi của KH có 5 con.", "<n> con" + thú cưng / vật nuôi / vẹt, "giả thử", "khi … thì", "sắp / sẽ có 2 con" nay không đề xuất. "…" (U+2026) giữ không là dấu hết câu, có lý do: tách ở đó chỉ thêm đề xuất sai ("Em trai KH… độc thân." sẽ ra Độc thân).
  - #682, mùi *Duplicated Code* / *Mysterious Name*, phần Mock: `readerOf` tách mỗi bộ dấu một lần cho mọi kiểm tra theo câu / vế (`aboutTheKh` không còn chia câu hai lần); `wordBefore` / `found` thay bằng `readerOf` / `firstEnd` / `lastStart`. Phần e2e (`e2e/customer-ai-web.spec.ts`) và `canvas` (`e2e/support.ts`) vẫn OPEN.

---

# Issue #728 — T-277: Đợt G5 lượt 3: dấu viết rời, nhận diện tin nhắn của app, chặn nhầm câu thường (DR6-122…124)

Trạng thái: CLOSED · nhãn: type:task, risk:med, gate, ready-for-agent

##### Mục tiêu

Đợt G5 lượt 3, Owner 21/10 đồng ý Q4 (a) (sửa cả ba). **Owner duyệt G5 §12 ngày 23/10/2026 ("duyệt hết", PR #762):** bước 0 hướng C, "luật" hướng b2, `analysis@4` / `discovery@4`. Chỗ chữ dưới khác §12 thì theo §12. **PR docs G5 trước:** §12 mới của `docs/design/phase-5-prompts.md`, Owner duyệt chữ luật (cổng G5), như #698 làm với §11. **Sau đó PR code.**

1. **Dấu viết rời làm câu lọt V3–V6 (DR6-122):** #698 bỏ "bản bỏ dấu cả câu", nên dấu tổ hợp không gắn vào chữ nào làm cụm không khớp. Hai dạng: dấu đứng sau dấu cách, hay ký tự tương thích mà NFKC viết thành dấu cách + dấu (U+00B4 `´`, U+00A8 `¨`). Bước 0 (`cleanText`) bỏ dấu tổ hợp không đứng sau chữ cái (sau NFKC). Hoặc chữ G5 ghi dạng khác, nếu Owner duyệt.
2. **Nhận diện tin nhắn của app (DR6-123):** `isOwnMessage` tách dòng ở U+0085 / U+2028 / U+2029 cùng CR / LF, như `normalizeNote` (K25).
3. **Chặn nhầm câu thường (DR6-124):**
   - (a) chữ của mục "Bỏ dấu: có" mà dạng không dấu là âm tiết thật ("ấm" → "am", "lạnh" → "lanh", "nội" → "noi", "ít" → "it") chỉ khớp dạng không dấu khi **cả cụm** viết không dấu;
   - (b) miễn "định", "giới" đứng trước "luật" (như "kỉ", "qui" ở §11.4).
4. **Version prompt:** theo quyết định G5. Đổi luật kiểm như `@3` thì lên `@4`; khi đó seed / dữ liệu tải / snapshot / eval theo version mới. Eval AI thật ở G7 chạy với version cuối.

##### Bối cảnh

Deep review Phase 1–6 lượt 3 (T-267 #714), nhóm **L3-I**; Owner 19/10 sửa hết, 21/10 đồng ý Q4 (a).

- DR6-122 là mất mới do #698. G5 §11.3 đã chấp nhận một nhóm "Mất" cùng loại (sai dấu, giữ `đ` bỏ dấu thanh, hai dấu chồng) nhưng chưa liệt kê dạng này.
- DR6-123: review đối kháng #698 xếp vào "bị bác, có từ trước", không vào sổ; không phải KNOWN.
- Cả ba đều 0 lần trong 1 085 chuỗi eval thật (output suy biến hoặc câu hiếm), nên mức Low / Nit.
- Thay đổi so khớp là cổng G5, nên Issue có nhãn `gate`.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §5.1 (CX3-C1), §6.6 (DR6-122…124), §8.2 L3-I, §9 Q4
- `docs/reviews/raw/2026-10-21/claude/C.md` CL3-C3, C4, C5 (probe `p05-bare-scan`, `p06-edges`); `docs/reviews/raw/2026-10-21/codex/C.md` CX3-C1 (`own-lines-probe`)
- `docs/design/phase-5-prompts.md` §6a, §7 (bước 0, mục 2–3), §8.4, §11 (đủ; §11.3 phần "Mất", §11.8); `docs/golden/ai-eval.md`
- PR #698 (`8f7355b`): mẫu cho một đợt G5 (file đổi khi lên version)
- `packages/ai/src/{text-match.ts,blocklists.ts,web.ts,schema.ts,validator.ts}`, `packages/ai/src/prompts/{analysis,discovery}.ts`

##### File / thư mục được phép sửa

- PR docs (G5): `docs/design/phase-5-prompts.md` (§12 mới, ca kiểm ở §12.7; PR code chép vào §8.5): PR #762
- PR code:
  - `packages/ai/src/{text-match,blocklists,web,schema,validator}.ts` và test (`blocklists.test.ts`, `validator-blocklists.test.ts`, `validator.test.ts`, `web.test.ts`, `run.test.ts`, `schema.test.ts`);
  - khi lên version: `packages/ai/src/prompts/{analysis,discovery}.ts` + `prompts.test.ts`, `packages/ai/CLAUDE.md`, `apps/desktop/src/data/ai-analysis.test.ts`, `apps/desktop/src/routes/customers/ai-panel-view.test.ts`, `e2e/{customer-ai,customer-ai-web,full-cycle}.spec.ts`, `packages/db/src/{seed.test.ts,ai-analyses.test.ts,backup-invariants.test.ts}`, `docs/golden/ai-eval.md`, `docs/design/phase-5-ai.md`, `docs/user-guide/06-ai.md` (ví dụ chip)
  - thêm theo G5 §12.1 (Owner duyệt 23/10/2026): `docs/design/phase-5-prompts.md` (chép §12 vào §2, §3, §6a, §7, §8.4, §8.5; trạng thái §12), `docs/README.md` (dòng version prompt), `docs/user-guide/11-thuat-ngu.md` (dòng Prompt, ví dụ version)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `98d0016`):

- L70 `web.ts` (`checkWebAnswer`: kiểm > 40 000 code unit chạy trước tin nhắn của app, nên dán lại tin nhắn `web@1` rất lớn báo "quá dài"): **gộp**, cùng chỗ với DR6-123.
- L39 `text-match.ts` (`phrase()` ghi tên mục có dấu vào `detail`; mục trùng phần sinh hai issue): **gộp** nếu vừa cỡ, không cần G5.
- L193 (`nfdZw` khai hai lần trong test): **gộp**, đưa vào `packages/ai/src/test-support.ts`.
- L192 (`visible` chỉ chuyển tiếp): **gộp** nếu chạm `schema.ts`.
- L191 (`schemaDetail` coi mọi `invalid_format` là mã F): để lại, chỉ ghi lại (*Shotgun Surgery*, #698).
- L42, L60, L61, L63, L64, L110: để lại, ngoài phạm vi.
- L164 (test hở Mock): làm ở T-276.
- L219 (DR6-25), L222 (DR6-67): để lại, hoãn sau v1.0.

##### Interface / hợp đồng

- Luật so khớp theo §12 Owner duyệt. Chữ prompt không đổi (như `@3`); version `@4` (G5 §12.1, Owner duyệt 23/10/2026).

##### Test chấp nhận

- [ ] PR docs §12 có Owner duyệt (G5) trước PR code.
- [ ] "KH có xáć suất đồng ý cao", "xác ́suất", "xác´suất", "xác¨suất" → V3 "xác suất" (như trước #698).
- [ ] Tin nhắn của app dán lại với U+0085 / U+2028 / U+2029 thay xuống dòng → `OWN_MESSAGE`, không tính lần thử, ở lần 1 và lần 2; câu trả lời chỉ nhắc dòng mốc trong `text` JSON vẫn là câu trả lời.
- [ ] "khách am hiểu", "khách lanh lợi", "định hướng noi theo", "làm IT khả năng…" đạt; "khach am", "khach lanh", "huong noi" (cả cụm không dấu) vẫn chặn.
- [ ] "định luật Pareto", "giới luật Phật giáo" đạt; "Theo Luật Kinh doanh bảo hiểm", "đạo luật Doanh nghiệp" vẫn V6.
- [ ] 1 085 chuỗi eval thật (10/10, 11/10) và mọi giá trị `vi.ts`: kết quả chặn không đổi, trừ ca chủ định.
- [ ] Version, seed, dữ liệu tải, snapshot, `ai-eval.md` theo §12.
- [ ] Ca C73–C79 và các ca ngoài bảng của G5 §12.7 ra đúng; PR code chép C73–C79 vào §8.5.

Ước lượng: ≈ 10–25 dòng SP + ≈ 80 dòng test (+ file theo version).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS (PR docs G5 và PR code)

##### Rủi ro

risk:med

##### Bị chặn bởi

#719 (fixture đồng hồ e2e, nếu PR code chạm e2e khi lên version)

## PR #762 — docs: propose the third Phase 6 G5 round for Owner review (T-277)

Trạng thái: MERGED · merge 2026-10-23T00:05:30Z · commit `8b5ff6f7591b4ac66d6cdd11c685cb7ad91779f1` · nhánh `task/T-277-g5-round-3-docs` · nhãn: risk:med, gate

Refs #728 (PR docs G5 đi trước; PR code đi sau và đóng Issue)

Đợt G5 Phase 6 lượt 3, theo Q4 (a) (Owner 21/10/2026). **Owner duyệt G5 23/10/2026: "duyệt hết"** (§12.9; ghi ở `6dde32c`). Đề xuất, lý do và số đo nằm ở §12 mới của `docs/design/phase-5-prompts.md`.

#### Thay đổi

- **§12 mới** (Owner duyệt 23/10/2026; PR code chép vào §1–§8):
  - §12.1 version `analysis@4` / `discovery@4`, giữ `extraction@1`, `web@1`. PR code được sửa thêm `docs/design/phase-5-prompts.md`, `docs/README.md`, `docs/user-guide/11-thuat-ngu.md`.
  - §12.2 DR6-122 (dấu tổ hợp lạc): ba hướng đã đo. Hướng **C**: ở dạng tách dấu, dấu không đứng sau nguyên âm đọc như một dấu cách. Hướng A (đúng chữ Q4) để lọt chính ca "xáć suất" của Issue. Hướng B làm đỏ test của review #420.
  - §12.3 DR6-123: tách dòng ở CR, LF, U+0085, U+2028, U+2029.
  - §12.4 DR6-124 (a): danh sách đóng "ấm", "lạnh", "nội", "ít". Không mở rộng, vì C68 "Nghi định 46" cần "nghi" trong cụm lẫn.
  - §12.5 DR6-124 (b): hướng **b2**, miễn "giới", và miễn "định" trừ khi "định" đứng sau "quy" / "qui". Hướng b1 (đúng chữ Q4) để lọt "Theo quy định Luật Kinh doanh bảo hiểm". §12.5 ghi kèm chữ mới của mục §8.4.
  - §12.6 ghi lý do sửa §7 bước 0. §12.7 có ca kiểm C73–C79 và các ca ngoài bảng. §12.8 ghi việc không làm, §12.9 là danh sách duyệt.
- **§7 bước 0:** thêm "ký tự điều khiển C0 / C1 không phải khoảng trắng" vào tập ký tự vô hình. Chữ này theo code đã merge (DR6-111, PR #738); luật và version không đổi.
- **Dòng trạng thái đầu file:** thêm "Đợt lượt 3 `analysis@4` / `discovery@4` Owner duyệt G5 23/10/2026 (T-277 #728, §12; PR code chép vào §1–§8)".
- Không sửa §2–§6a, §8.1–§8.5. Test đọc nguyên văn các bảng §8 và các khối ```` ````text ```` / ```` ````plaintext ````, nên PR code mới chép §12 vào đó, cùng lúc với code. Ca C73–C79 cũng vào §8.5 ở PR code, để §1–§8 luôn khớp code.

**Đã thử trước khi đề xuất.** Thử trên bản chép `packages/ai` ngoài repo, dựng bằng script tạm (không commit). Mỗi hướng là một bản; mỗi bản chạy 921 test hiện có và một bộ đo:

| | A | B | **C + b2** | C + b1 |
|---|---|---|---|---|
| 921 test hiện có (gồm C1–C72, bảng §8) | xanh | đỏ 1 (#420) | xanh | xanh |
| Ca kiểm của Issue (DR6-122…124) | "xáć suất" lọt | đạt | đạt | đạt |
| "Theo quy định Luật Kinh doanh bảo hiểm" | V6 | V6 | V6 | **lọt** |
| 1 085 chuỗi eval thật, đúng khối | 0 đổi | 0 đổi | 0 đổi | 0 đổi |
| 2 636 chuỗi code (`vi.ts`, `schema.ts`, seed) | 0 đổi | 0 đổi | 0 đổi | 0 đổi |
| 118 744 đoạn `docs/**/*.md` | 7 đổi | 7 đổi | 7 đổi | 7 đổi |

A và B đo cùng "luật" hướng b2. 7 đoạn đổi đều là chỗ bản tổng hợp / báo cáo gốc lượt 3 trích chính các câu của DR6-122, 124. Ở mọi bản, DR6-123: 10 / 10 ca dán ra `OWN_MESSAGE`; hôm nay 6 / 10 lọt.

#### Test chấp nhận

- [x] PR docs §12 có Owner duyệt (G5) trước PR code (#728): Owner 23/10/2026 "duyệt hết", ghi ở `6dde32c`
- Các mục còn lại của Issue là việc của PR code; ca kiểm tương ứng ở §12.7.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (1 mục "Trùng file"):

- L189 (`docs/design/phase-5-prompts.md`, `packages/ai/src/schema.ts`; tài liệu chưa theo tập K25 mới, ký tự điều khiển): **đã sửa phần tài liệu** ở §7 bước 0, là chỗ luật đang dùng (§12.6). Dòng 594 thuộc §11.2, là bản ghi đề xuất Owner duyệt 18/10, nên giữ nguyên. Còn doc comment `visible` ở `packages/ai/src/schema.ts:101-104`: để lại cho PR code của #728, vì là file code, ngoài PR docs này.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

**Thứ tự:**

1. ✅ Owner trả lời §12.9 trong chat: "duyệt hết" (23/10/2026).
2. ✅ Phần duyệt ghi vào PR này ở `6dde32c` (trạng thái §12, tick §12.9, dòng trạng thái đầu file). Issue #728 ghi cùng ngày: luật theo §12, ba file thêm cho PR code, ca C73–C79 vào test chấp nhận.
3. Khi CI xanh trên head `6dde32c`, Owner gõ "review PR #762" ở phiên sạch. Review đạt thì Owner merge (`risk:med`).
4. Sau đó mới làm PR code của #728.

Rủi ro: `risk:med` (cổng G5, nhãn `gate`; Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #766 — feat(ai): third Phase 6 G5 round — analysis@4, discovery@4 (T-277)

Trạng thái: MERGED · merge 2026-10-23T10:22:10Z · commit `405ded1c4483b07bf8e687b2007624c50ece4ee2` · nhánh `task/T-277-g5-round-3` · nhãn: risk:med, gate

Closes #728

Đợt G5 Phase 6 lượt 3. **Owner duyệt G5 23/10/2026** ("duyệt hết", PR #762): bước 0 hướng C, "luật" hướng b2, `analysis@4` / `discovery@4`, ba file thêm cho PR code. Đề xuất, lý do và số đo ở `docs/design/phase-5-prompts.md` §12; các thay đổi đã chép vào §2, §3 (version), §6a, §7, §8.4, §8.5 (C73–C79) và spec `phase-5-ai.md` §3.1 mục 3, §6.4.

#### Thay đổi

- **Version:** `analysis@4`, `discovery@4` (chữ prompt không đổi; đổi luật kiểm, như `@3`). `extraction@1`, `web@1` giữ → ChatGPT web lưu `analysis@4+web@1`. Seed và dữ liệu tải (`tools/load-data.mjs` gọi `seedDemoData`) lấy version từ `PROMPT_VERSIONS` nên tự theo; mốc hash seed (`DEMO_HASH`) đổi như T-257. Test app, e2e, `ai-eval.md`, hướng dẫn sử dụng (`06-ai.md`, `11-thuat-ngu.md`), `docs/README.md`: `@3` → `@4`.
- **DR6-122 — dấu tổ hợp lạc (§7 bước 0, §12.2 hướng C):** `cleanText` = `normalizeText` → NFKD → mỗi chuỗi dấu tổ hợp không đứng sau nguyên âm (a, e, i, o, u, y, hoa / thường; chuỗi dấu sau nguyên âm giữ nguyên) đọc như **một dấu cách** → NFC → gộp khoảng trắng, cắt hai đầu. Không có dấu lạc thì kết quả bằng NFKC như cũ. Dấu lạc vẫn là ranh giới từ ("Ý x" + U+0301 + "xác suất" vẫn V3). Áp cho V3–V6 và dòng dán ChatGPT web; V1 không đổi (`normalizeText`).
- **DR6-123 — tách dòng tin nhắn của app (§6a, §12.3):** `isOwnMessage` tách ở CR LF, CR, LF, U+0085, U+2028, U+2029 như `normalizeNote` (K25); bản sao riêng trong `web.ts`, đổi = qua G5 (ghi chú L239).
- **DR6-124 a — danh sách đóng (§7 mục 2, §12.4):** `phrase` (`bareOrNot`): mục có "ấm", "lạnh", "nội", "ít" khớp khi mỗi chữ viết đúng hay không dấu, trừ chữ trong danh sách phải viết đúng; **hoặc** khi cả cụm viết không dấu. Mục khác dựng regex như cũ.
- **DR6-124 b — "luật <Tên>" (§8.4, §12.5 hướng b2):** `LAW_NAME` miễn thêm "giới", và "định" mà trước nó không phải "quy" / "qui" (lookbehind lồng). Chữ mục §8.4 chép nguyên văn §12.5; `blocklists.test.ts` đọc đúng ô đó và có mẫu "quy định Luật Kinh doanh bảo hiểm".
- **Ghi chú sổ gộp:** L69 (review #521) — câu dán chỉ đọc 40 000 code unit đầu (bỏ dòng bị cắt) khi tìm dòng mốc, kiểm tin nhắn của app **trước** khi từ chối theo độ dài: tin nhắn app rất lớn dán lại báo "Đây là tin nhắn của app…" thay vì "quá dài"; câu dán 20 triệu ký tự vẫn không bị đọc hết (DR5-09, test < 50 ms). L159 / L188 — `visible = normalizeText`, doc comment theo K25. L160 — `ZWSP`, `nfdZw`, `lettersAround` dùng chung ở `test-support.ts`. L164 — comment `SLOW` bỏ số đo cũ. L238–L241 — §7 bước 0 ghi "trừ NUL" (đúng code, NUL không bị bỏ), §6a nêu cả U+0085 / U+2028 / U+2029 ở phần "chấp nhận", tác dụng phụ chữ nước ngoài ("Škoda" → "S koda") ghi ở §7, §12.2, §12.8, "Mất" của §12.2 ghi rõ chỗ (§12.2 / §12.8), không sửa §11.3.
- `packages/ai/CLAUDE.md`: dòng Validator rút gọn để bản đồ export vẫn ở dạng đầy đủ (7 974 / 8 000 ký tự; thêm chữ thì `codemap` rơi về dạng chỉ tên file).

#### Test chấp nhận

- [x] PR docs §12 có Owner duyệt (G5) trước PR code: PR #762, Owner duyệt và merge 23/10.
- [x] "KH có xáć suất đồng ý cao", "xác ́suất", "xác´suất", "xác¨suất" → V3 "xác suất" (C73; `detail` vẫn một dấu cách: "có "xác suất"", "có "Điều 35"", "có "Luật K"").
- [x] Tin nhắn của app dán lại với U+0085 / U+2028 / U+2029 thay xuống dòng → `OWN_MESSAGE`, không tính lần thử, ở lần 1 và lần 2 (message thử lại, phiên còn mở); câu trả lời có dòng mốc ở giữa một `text` JSON vẫn là câu trả lời; dòng mốc kẹp giữa hai U+0085 / U+2028 / U+2029 trong `text` → `OWN_MESSAGE` (phần "chấp nhận" của §12.3, ghim bằng test).
- [x] "khách am hiểu", "khách lanh lợi", "định hướng noi theo", "làm IT khả năng…" đạt (C76); "khach am", "khach lanh", "huong noi" (cả cụm không dấu) vẫn chặn, "khach ấm", "ít kha nang" vẫn chặn (C77); "khách am", "hướng noi" đạt, "Phòng IT khả năng cao" chỉ còn "khả năng cao".
- [x] "định luật Pareto", "giới luật Phật giáo" đạt (C78, cả viết hoa); "Theo Luật Kinh doanh bảo hiểm", "đạo luật Doanh nghiệp", "quy định Luật …", "qui định Luật …", "QUY ĐỊNH LUẬT …" vẫn V6 (C79 + ca ngoài bảng).
- [x] 1 085 chuỗi eval thật (10/10, 11/10) và mọi giá trị `vi.ts`: kết quả chặn không đổi (số đo dưới).
- [x] Version, seed, dữ liệu tải, snapshot (`DEMO_HASH`), `ai-eval.md` theo §12.
- [x] Ca C73–C79 và ca ngoài bảng của §12.7 ra đúng; C73–C79 đã chép vào §8.5 (test đọc bảng §8 và danh sách đóng của §7 mục 2 từ file).

**Số đo (probe ngoài repo, so `main` ↔ PR trên cùng tiến trình, V3–V6 theo khối):**

| Kho chữ | Số chuỗi | Bị chặn `main` → PR | Đổi kết quả |
|---|---|---|---|
| `text` eval thật 10/10 + 11/10 (mỗi chuỗi ở khối của nó) | 1 085 | 0 → 0 | 0 |
| giá trị `vi.ts` | 1 165 | 4 → 4 | 0 |
| chuỗi literal của `schema.ts`, `seed.ts`, `seed-data.ts` | 428 | 1 → 1 | 0 |
| ô / dòng của `docs/**/*.md` | 118 610 | 1 599 → 1 592 | 14, đều là chỗ trích chính câu của DR6-122 / DR6-124 (§8.5, §12 của G5; tổng hợp và báo cáo gốc lượt 3) |

(§12 đếm `vi.ts` / code theo cách khác: 2 305 / 331 chuỗi; cùng kết luận không chuỗi nào đổi.)

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (24 mục "Trùng file"):

- L38 (`text-match.ts` `phrase()` ghi tên mục vào `detail`; mục trùng phần sinh hai issue): để lại — đổi `detail` và số issue của V3–V6 (message thử lại, `validator_json`, bảng test §8), phần hai cần vị trí khớp (đổi kiểu `Matcher`); không vừa cỡ một PR G5 (Issue: "gộp nếu vừa cỡ"); code, không cần G5.
- L41 (`schema.ts` `isoDate` lặp `validDate`): để lại — cần hàm mới ở `domain`, ngoài phạm vi.
- L59 (`AI_ANALYSIS_NO_MODEL` / `web.ts`): để lại — cần sửa `db`, ngoài phạm vi.
- L60 (hai hằng 20 000): để lại — cần sửa `db`, ngoài phạm vi.
- L62 (`customerId` + `kycVersionId`): để lại — chỉ ghi lại.
- L63 (phạm vi export của `run.ts`): để lại — ngoài phạm vi.
- L69 (`checkWebAnswer` kiểm `TOO_LONG` trước tin nhắn của app): **đã sửa** — đọc 40 000 code unit đầu, tin nhắn của app kiểm trước độ dài.
- L103 (`ai-panel-view.test.ts:398` test gần hiển nhiên): để lại — file chỉ đổi chuỗi version; test đúng chữ test chấp nhận #598.
- L104 (`KycIntelligence.tsx` tên state; `PROMPT_VERSIONS` chép version): để lại — phần đầu ngoài file được phép; phần `PROMPT_VERSIONS` sổ đã ghi chấp nhận (test giữ khớp, nay `@4`).
- L133 (NIT `kyc-view.test.ts` ký tự vô hình thô): để lại — file khác; ca mới của PR này viết dấu / ký tự vô hình bằng escape hoặc `String.fromCodePoint`.
- L145 (e2e tìm KH seed lặp): để lại — "khi có nơi thứ ba", PR chỉ đổi chuỗi version.
- L158 (`schemaDetail` coi mọi `invalid_format` là mã F): để lại — chỉ ghi lại (Issue).
- L159 (`visible` chỉ chuyển tiếp): **đã sửa** — `const visible = normalizeText`.
- L160 (`nfdZw` / ZWSP / chuỗi C71 lặp trong test): **đã sửa** — `ZWSP`, `nfdZw`, `lettersAround` ở `test-support.ts`, dùng ở 5 file test.
- L164 (comment `SLOW` của `seed.test.ts` đã cũ): **đã sửa** — bỏ số đo, giữ lý do (T-095).
- L188 (doc comment `visible` chưa theo K25): **đã sửa**.
- L208 (`KycIntelligence.tsx:177` bỏ `nowrap`): để lại — chỉ ghi lại.
- L209 (e2e `scrolls` / `sideways` / `right` lặp): để lại — "khi có nơi thứ ba".
- L227 (`11-thuat-ngu.md` ví dụ `@3`): **đã sửa** — `@4` ở `11-thuat-ngu.md` và `06-ai.md` (file thêm theo §12.1).
- L238 (§7 bước 0 gồm cả NUL): **đã sửa** — ghi "trừ NUL" (đúng code; bỏ cả NUL là đổi luật, cần G5).
- L239 (§12.3 chỉ nêu U+2028): **đã sửa** — §6a nêu U+0085, U+2028, U+2029; test ghim cả ba.
- L240 (chữ nước ngoài có dấu trên phụ âm): **đã sửa** — ghi ở §7 bước 0, §12.2 ("Tác dụng phụ"), §12.8; ví dụ kiểm trên code ("Šmic" → V4 "mic", "Ñaia" → V4 "aia").
- L241 ("Mất" mới đặt ở đâu): **đã sửa** — §12.2 ghi "cùng loại với phần Mất của §11.3; ghi ở đây và §12.8, §11.3 giữ nguyên".
- L247 (DR6-25 `zod/mini`): để lại — hoãn sau v1.0 (Owner 15/10).

Trong vùng: L250 (DR6-67, gồm `fold` của `packages/ai`) — hoãn sau v1.0, không chạm.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (3 589 test; coverage `packages/ai` 100 %)
- [x] e2e liên quan xanh ở local (`customer-ai`, `customer-ai-web`, `full-cycle`: 28 / 28 kể cả `seed-timing`)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

**Tự kiểm bằng đột biến** (trong phiên, không subagent): 24 đột biến trên phần code mới, **24 bị giết** — dấu lạc bị xóa thay vì thành dấu cách, không / luôn coi là dấu lạc, bỏ gộp khoảng trắng, bỏ cắt hai đầu, NFD thay NFKD, nguyên âm chỉ chữ thường, bỏ "y"; bỏ nhánh cả cụm không dấu, danh sách rỗng, chữ trong danh sách được viết không dấu, bỏ "ít"; bỏ "giới", "định" luôn được miễn, chỉ "quy"; tách dòng chỉ CR / LF, bỏ từng U+0085 / U+2028 / U+2029; đọc cả dòng bị cắt, `>=` thay `>`, kiểm tin nhắn của app sau độ dài, đọc cả câu dán, phần đầu nhỏ hơn.

Rủi ro: `risk:med` (cổng G5; Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-277 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #521, #698, #702, #738, #758, #762 — T-277 PR code G5 lượt 3 (#728, PR #766, `REVIEW: PASS` @`6c2ce7b`):
  - #521, `packages/ai/src/web.ts` (`checkWebAnswer` kiểm > 40 000 code unit trước tin nhắn của app): `isOwnMessage` chạy trước mọi kiểm độ dài và chỉ đọc 40 000 code unit đầu (bỏ dòng bị cắt), nên tin nhắn `web@1` rất lớn dán lại báo "Đây là tin nhắn của app…"; câu dán 20 triệu ký tự vẫn không bị đọc hết (DR5-09). Test `web.test.ts` "names it as the own message before checking its length", "reads no line that the head of a paste past 40 000 code units cuts".
  - #698, *Middle Man* `packages/ai/src/schema.ts:105`: `const visible = normalizeText`.
  - #698, *Duplicated Code* (test): `ZWSP`, `nfdZw`, `lettersAround` ở `packages/ai/src/test-support.ts`, dùng ở 5 file test; phần sót (`String.fromCodePoint(0x200b)` ở hai file) xem mục review #766 ở OPEN.
  - #702, NIT comment `SLOW` của `packages/db/src/seed.test.ts:32`: bỏ số đo cũ, giữ lý do (T-095).
  - #738, mục K25 "tài liệu chưa theo tập mới", phần cuối: doc comment `visible` (`packages/ai/src/schema.ts:101-105`) nêu ký tự điều khiển không phải khoảng trắng, trừ NUL (K25, DR6-111).
  - #758, `docs/user-guide/11-thuat-ngu.md:93`: ví dụ `analysis@4`, `discovery@4`, cùng dòng chip `docs/user-guide/06-ai.md:49` (file thêm theo G5 §12.1).
  - #762, `docs/design/phase-5-prompts.md` §7 bước 0: ghi "trừ NUL", đúng code (bỏ cả NUL là đổi luật, cần G5).
  - #762, §12.3 "Chấp nhận": §6a nêu cả U+0085, U+2028, U+2029; `packages/ai/src/web.test.ts` ghim cả ba.
  - #762, §12.2 chữ nước ngoài có dấu trên phụ âm: "Tác dụng phụ" ghi ở §7 bước 0, §12.2, §12.8 ("Šmic" → V4 "mic", "Ñaia" → V4 "aia", review #766 chạy lại trên code).
  - #762, §12.2 chỗ ghi "Mất": "cùng loại với phần Mất của §11.3; ghi ở đây và §12.8", §11.3 giữ nguyên.

- Ghi chú review PR #738 — T-277 PR docs G5 §12 (#728, PR #762, `REVIEW: PASS` @`6dde32c`):
  - #738, `docs/design/phase-5-prompts.md:221` (§7 bước 0; phần này của mục "Tài liệu chưa theo tập K25 mới"): nay liệt kê cả ký tự điều khiển C0 / C1 không phải khoảng trắng (DR6-111, §12.6), khớp `normalizeText`; riêng NUL xem mục review #762 ở OPEN. Dòng 594 (§11.2) giữ nguyên làm bản ghi; phần `packages/ai/src/schema.ts` vẫn OPEN.

---

# Issue #729 — T-278: Tài liệu: tiền gõ dấu phẩy, ngoại lệ Dọn sạch, ví dụ chip prompt (DR6-131…133)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **Tiền gõ dấu phẩy (DR6-131):** mockup 6d (`appointment-forms.html:244`, câu help) và NT-LH-25 (`nghiem-thu-v1.md:135`) theo **quyết định Owner 27/09/2026 (G8, Issue #106, T-060)**: "dấu phẩy theo sau bởi 3 chữ số là dấu ngăn nghìn, kể cả khi có đơn vị".
   - `1,234 tr` là 1.234.000.000 ₫, app đọc vậy.
   - Ví dụ thập phân cho câu help: `1,2 tr` → 1.200.000 ₫.
2. **Dọn sạch Thùng rác xóa hẳn (DR6-132 a):** thêm vế "trừ khi dọn sạch Thùng rác (spec Phase 6 TR-11, phụ lục ADR-0008)" ở các câu còn nói ghi chú KYC / dữ kiện / phân tích AI không bao giờ xóa:
   - `CONTEXT.md:38`;
   - spec Phase 3 §2, §3.8, §3.9;
   - `docs/design/phase-5-ai.md:295`;
   - `docs/user-guide/05-ho-so-kh.md:24`;
   - mockup `kyc-forms.html:134`.
3. **Ví dụ chip prompt (DR6-133):** `docs/user-guide/06-ai.md:49` theo version hiện tại (`discovery@3`). T-277 lên version thì sửa lại dòng này.
4. Gộp ghi chú OPEN tài liệu cùng file (dưới).

##### Bối cảnh

Deep review Phase 1–6 lượt 3 (T-267 #714), nhóm **L3-K**; Owner 19/10: sửa hết. Mockup 6d viết ngày 27/09 (#75), trước quyết định G8 cùng ngày (#112) nên còn câu help cũ; NT-LH-25 (#577, 13/10) chép theo mockup. Owner chạy NT-LH-25 ở G7 sẽ thấy "sai" dù app đúng. PR #707 chỉ sửa spec Phase 6, mockup `trash.html`, ADR-0008, nên các câu "không bao giờ xóa" ở nơi khác còn sót. Chú thích `schema.ts` và `packages/db/CLAUDE.md` làm ở T-271 (code).

##### Tài liệu cần đọc

- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §5.1 (CL3-A1), §6.8 (DR6-131…133), §8.2 L3-K
- Issue #106 (T-060, quyết định G8 27/09); `docs/reviews/raw/2026-10-21/claude/A.md` CL3-A1, CL3-A23; `docs/reviews/raw/2026-10-21/claude/C.md` CL3-C6
- `docs/design/phase-6-hoan-thien.md` §4.2 TR-11; phụ lục dọn Thùng rác của ADR-0008
- `.claude/rules/mockups.md`; các dòng nêu ở Mục tiêu

##### File / thư mục được phép sửa

- `docs/design/mockups/{appointment-forms,kyc-forms,index}.html`
- `docs/testing/nghiem-thu-v1.md`
- `CONTEXT.md`
- `docs/design/{phase-3-du-lieu,phase-5-ai}.md`
- `docs/user-guide/{05-ho-so-kh,06-ai}.md`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `98d0016`):

- L190 `docs/design/phase-5-ai.md:78` (spec §3.1 mục 3 còn ghi chuẩn hóa dòng dán là "NFKC, bỏ ký tự định dạng", lệch G5 §6a / §7 bước 0 mới): **gộp**. Phần `docs/README.md:22` của cùng mục đã sửa ở PR #717.
- L199 NIT `docs/design/mockups/index.html:150` (thẻ `trash.html` chưa nhắc dọn sạch 11h–11j): **gộp**.
- L172 `docs/design/phase-3-du-lieu.md:175` (luật K20 cũ): làm ở T-270, cùng code K25.

##### Interface / hợp đồng

- Chỉ tài liệu; không đổi luật. Mockup sửa theo quyết định Owner đã có (G8 27/09), Owner xem ở PR.

##### Test chấp nhận

- [ ] Câu help mockup 6d và NT-LH-25 khớp `parseVnd` (`1,234 tr` → 1.234.000.000 ₫, `1,2 tr` → 1.200.000 ₫).
- [ ] Mọi câu nêu ở mục tiêu 2 có vế ngoại lệ Dọn sạch.
- [ ] `06-ai.md:49` khớp chip trên màn.
- [ ] L190, L199 sửa.

Chỉ sửa `docs/**`, `CONTEXT.md` → không chạy CI.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (PR docs-only: không chạy CI)
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #755 — docs: align the comma money rule, the purge exception and the chip example with the app (T-278)

Trạng thái: MERGED · merge 2026-10-22T13:34:03Z · commit `4cc2a23b7f956933b1ea0600d0f9a9aded952b69` · nhánh `task/T-278-docs-money-purge-chip` · nhãn: type:task, risk:low

Closes #729

#### Thay đổi

T-278, nhóm L3-K của deep review Phase 1–6 lượt 3: DR6-131 (CL3-A1), DR6-132 (a) (CL3-A23), DR6-133 (CL3-C6) và gộp 2 ghi chú OPEN. Chỉ sửa tài liệu: 9 file, +15 / −15 dòng, không đổi luật, không đổi code (`schema.ts` và `packages/db/CLAUDE.md` của DR6-132 làm ở T-271).

##### 1. Tiền gõ dấu phẩy (DR6-131)

Theo quyết định Owner 27/09/2026 (G8, Issue #106, T-060): dấu `.` hay `,` theo sau đúng 3 chữ số là dấu ngăn nghìn, kể cả khi có đơn vị. Đọc bằng `parseVnd` / `formatVnd` / `formatVndCompact` của `packages/domain/src/money.ts` (script đo ở phiên này, không commit; dòng đọc lại của hộp 6d là `{amount} ({compact})`, `outcome.caseSizeRead`):

| Gõ | App đọc |
|---|---|
| `1.234 tr` | 1.234.000.000 ₫ (1,23 tỷ) |
| `1,234 tr` | 1.234.000.000 ₫ (1,23 tỷ) |
| `1,2 tr` | 1.200.000 ₫ (1,2 tr) |
| `12,5` | lỗi `fraction` ("Số tiền phải là số đồng nguyên.") |

- **Mockup 6d** (`appointment-forms.html`), câu help dưới ô Case size dự kiến: "Dấu phẩy hay dấu chấm theo sau đúng 3 chữ số là dấu ngăn nghìn, kể cả khi có đơn vị: "1,234 tr" = 1.234.000.000 ₫. Muốn 1,2 triệu thì gõ "1,2 tr" → 1.200.000 ₫." (trước: `Muốn 1,234 triệu thì gõ "1,234 tr" → 1.234.000 ₫.`). Chỉ đổi chữ, không đổi bố cục. **Anh xem câu này ở PR** (mockup đã duyệt G3, sửa theo quyết định G8 đã có).
- Nhãn nhỏ "dấu . là ngăn nghìn" (dòng 241) **giữ nguyên**: nó mô tả ô mẫu `1.234 tr` ngay dưới và vẫn đúng; luật dấu phẩy nằm ở câu help.
- **NT-LH-25**: thêm `1,2 tr` vào các ô gõ; `1,234 tr` đọc "1.234.000.000 ₫ (1,23 tỷ)" cùng `1.234 tr`; `1,2 tr` đọc "1.200.000 ₫ (1,2 tr)". Các ca còn lại giữ.
- Để anh biết: app không hiện câu help này dưới ô Case size (chỉ có nhãn "Case size dự kiến (để trống = chưa ước lượng)" và dòng đọc lại), nên câu help chỉ có ở mockup và NT-LH-25 không kiểm nó. Không ghi thêm vào "Lệch mockup đã biết" (ngoài phạm vi Issue).

##### 2. Ngoại lệ Dọn sạch Thùng rác (DR6-132 a)

Thêm vế "trừ khi dọn sạch Thùng rác (spec Phase 6 TR-11, phụ lục ADR-0008)" vào mọi câu còn nói ghi chú KYC / dữ kiện / phân tích AI không bao giờ xóa. Dòng 1–7 là danh sách của Issue; dòng 8–9 cùng câu, cùng file được phép sửa, nên sửa luôn:

| # | Vị trí | Vế thêm |
|---|---|---|
| 1 | `CONTEXT.md:38` | trừ khi dọn sạch Thùng rác xóa hẳn KH đã xóa |
| 2 | `phase-3-du-lieu.md:41` (§2) | ngoại lệ duy nhất: dọn sạch xóa hẳn từng bảng theo thứ tự khóa ngoại, một transaction, vẫn không dùng `ON DELETE CASCADE` |
| 3 | `phase-3-du-lieu.md:140` (§3.8 `kyc_notes`) | trừ dọn sạch Thùng rác xóa hẳn dòng của KH đã xóa |
| 4 | `phase-3-du-lieu.md:154` (§3.9 `kyc_facts`) | trừ dọn sạch Thùng rác, như §3.8 |
| 5 | `phase-5-ai.md:295` (§7.1 `ai_analyses`) | ngoại lệ duy nhất; trigger chỉ cho xóa dòng của KH có `deleted_at`, vẫn chặn mọi `UPDATE` (như phụ lục ADR-0008) |
| 6 | `05-ho-so-kh.md:24` | "chỉ mất khi dọn sạch Thùng rác xóa hẳn KH đã xóa" + link `09-cai-dat.md#dọn-sạch-thùng-rác` (cùng chữ với `11-thuat-ngu.md:71`, `04-khach-hang.md:52`) |
| 7 | `kyc-forms.html:134` | trừ khi dọn sạch Thùng rác xóa hẳn KH đã xóa (TR-11) |
| 8 | `phase-3-du-lieu.md:19` (D4) | ghi theo kiểu ghi chú ngày của bảng (Owner, 19/10/2026, #662), không viết lại quyết định |
| 9 | `phase-5-ai.md:392` (bảng test `db`) | "trigger chặn sửa / xóa" thêm: xóa chỉ được với dòng của KH đã xóa, qua dọn sạch |

Để lại, ngoài danh sách file của Issue: `customer-forms.html:267` (hộp Xóa KH 5f cũ, dòng "Ghi chú KYC · 5 — giữ nguyên, không bao giờ xóa"). Spec Phase 6 TR-9 đã ghi dòng này bỏ chữ đó, và hộp đúng là 11f ở `trash.html`; không có phát hiện review nào nêu file này. Nếu anh muốn sửa cho khớp thì mở Issue riêng.

##### 3. Ví dụ chip (DR6-133)

`06-ai.md:49`: `discovery@2` → `discovery@3` (= `PROMPT_VERSIONS.discovery` ở `packages/ai/src/schema.ts`; chip hiện nguyên `analysis.promptVersion` qua `chip.prompt`). Issue #728 (T-277) có `06-ai.md` trong danh sách file khi lên version: sửa lại dòng này khi đó.

##### 4. Ghi chú OPEN gộp

- `phase-5-ai.md:78` (§3.1 mục 3): chuẩn hóa dòng dán ChatGPT web ghi theo G5 §6a: bỏ ký tự vô hình theo tập K20, gộp khoảng trắng, NFKC, rồi bỏ tiền tố trích dẫn `>`, gộp khoảng trắng. Không động `phase-5-prompts.md` (G5, chạy CI; dòng 496 là bản ghi lịch sử).
- `mockups/index.html:150`: thẻ `trash.html` nhắc dọn sạch (11h–11j); dòng meta của thẻ Phase 6 thêm ngày duyệt 19/10/2026 (#662), như `mockups/README.md:24`.

#### Test chấp nhận

- [x] Câu help mockup 6d và NT-LH-25 khớp `parseVnd` (bảng ở mục 1): `1,234 tr` → 1.234.000.000 ₫, `1,2 tr` → 1.200.000 ₫.
- [x] Mọi câu nêu ở mục tiêu 2 có vế ngoại lệ Dọn sạch (bảng ở mục 2, dòng 1–7; `grep` lại các cụm "không bao giờ xóa", "không sửa, không xóa", "Never deleted" trong các file được phép sửa: không còn câu nào thiếu vế).
- [x] `06-ai.md:49` khớp chip trên màn (`discovery@3`).
- [x] L167, L176 sửa (mục "Ghi chú OPEN liên quan").

Chỉ sửa `docs/**` và `CONTEXT.md` → không chạy CI.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `6e87556`): 2 mục "Trùng file".

- L167 (`phase-5-ai.md:78`, chuẩn hóa dòng dán còn "NFKC, bỏ ký tự định dạng"): **đã sửa**, theo G5 §6a (mục 4).
- L176 (NIT `mockups/index.html:150`, thẻ `trash.html` chưa nhắc dọn sạch 11h–11j): **đã sửa** (mục 4).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (không đổi dependency)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-278 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #698, #707 — T-278 (#729, PR #755, `REVIEW: PASS` @`f41e12b`):
  - #698, `docs/design/phase-5-ai.md:78` (spec §3.1 mục 3, chuẩn hóa dòng dán ChatGPT web): nay ghi "bỏ ký tự vô hình theo tập K20, gộp khoảng trắng, NFKC, rồi bỏ tiền tố trích dẫn `>`, gộp khoảng trắng", đúng G5 §6a và §11.2.
  - #707, NIT `docs/design/mockups/index.html:150`: thẻ `trash.html` nay nhắc dọn sạch Thùng rác (11h–11j: nhắc từ 1 000 bản ghi, hộp xác nhận, kết quả); dòng meta của thẻ Phase 6 thêm "dọn sạch 11h–11j: 19/10/2026 (#662)".

---

# Issue #730 — T-279: Nâng mức code-review của skill review-pr (low high, med max, high max + mọi phát hiện)

Trạng thái: CLOSED · nhãn: type:task, risk:low

##### Mục tiêu

Ghi và áp dụng quyết định Owner ngày 21/10/2026 về mức review của skill `review-pr` (ADR-0017). Nguyên văn: "nâng mức của skill /review-pr lên max cho med, max-findings cho high risk, với low thì high".

Trục Correctness theo mức (mức lấy từ nhãn `risk:*`, sau bảng nâng mức theo file):

| Mức | Trước | Từ 21/10/2026 |
|---|---|---|
| low | tự rà inline, không gọi skill | `code-review high` |
| med | `code-review medium` | `code-review max` |
| high | `code-review high` | `code-review max --max-findings all` |

- Giữ nguyên: Spec, Standards (checklist), mùi code (low không có, med 4, high 12), bảng nâng mức theo file, quy tắc merge.
- Theo mô tả skill `code-review`, lựa chọn `--max-findings` được giữ cho tới khi truyền `--max-findings default`. Vì vậy mức low / med luôn truyền `--max-findings default`, để review low / med chạy sau một review high không kế thừa `all`.
- Mọi chỗ trong repo nói mức hiện hành đều theo mức mới. Chỗ ghi lịch sử (báo cáo review, sổ ghi chú, số đo) giữ nguyên.

##### Bối cảnh

- ADR-0017 (27/09/2026): bảng mức ở mục 3. Phương án "Chạy `code-review` cho mọi mức" bị loại vì lúc đó Owner ưu tiên chi phí thấp cho `risk:low` / `risk:med`.
- Owner quyết trong chat ngày 21/10/2026, sau bản tổng hợp deep review lượt 3 (#714; PR #717, #718) và trước đợt sửa #719–#729. PR của đợt sửa review theo mức mới sau khi PR của Issue này merge.
- Cách hiểu "max-findings cho high risk": `risk:high` không thể thấp hơn `risk:med` (`max`), nên là `max` kèm `--max-findings all` (báo mọi phát hiện).
- Không đổi: PR chỉ sửa docs (`docs/**`, `*.md`, trừ `CODE_DOCS`) vẫn bỏ trục Correctness (skill §2). Quyết định chỉ nói mức của `code-review`, và PR docs không có code cho `code-review` săn lỗi.
- Không đổi: không `--comment` / `--fix` / `ultra` (ADR-0017 mục 4).
- PR #717 cũng thêm mục 20/10, 21/10 vào cuối "Current OWNER decisions" của `docs/PROJECT-STATE.md`. PR nào merge sau phải cập nhật nhánh, giữ cả hai mục.

##### Tài liệu cần đọc

- `.claude/skills/review-pr/SKILL.md` §2–§4
- `docs/decisions/0017-review-theo-muc-risk.md` (toàn bộ; mục 5 là mẫu ghi "Sửa ngày …")
- `CLAUDE.md` § "Quy trình một task" bước 4, § "Skills được phép"
- `docs/decisions/README.md` (dòng ADR-0017), `docs/PROJECT-STATE.md` (cuối "Current OWNER decisions")
- Mô tả skill `code-review` có sẵn của Claude Code (mức effort, `--max-findings`)

##### File / thư mục được phép sửa

- `.claude/skills/review-pr/SKILL.md`
- `CLAUDE.md` (bước 4 của "Quy trình một task", dòng `code-review` của "Skills được phép")
- `docs/decisions/0017-review-theo-muc-risk.md` (mục 3, phương án đã cân nhắc, hệ quả, phụ lục mới)
- `docs/decisions/README.md` (dòng ADR-0017)
- `docs/PROJECT-STATE.md` (mục 2026-10-21)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files <5 file trên>` @ `98d0016`: một mục "Trùng file".

- L176 `CLAUDE.md`: câu về cổng "tested base" ở bước 5 và `.claude/rules/ci.md:12` thiếu vế "danh sách commit của `main` cũng đọc đủ trang" (DR6-85) → **để lại**. Mục này khác chủ đề (cổng CI, không phải mức review), và file chính `.claude/rules/ci.md` nằm ngoài danh sách được sửa. Gộp vào lần chạm sau của `ci.md`.

##### Interface / hợp đồng

Args mà `review-pr` truyền cho Skill `code-review` (§C):

```
risk:low   →  high <N> --max-findings default
risk:med   →  max <N> --max-findings default
risk:high  →  max <N> --max-findings all
```

Comment review (mẫu §4) ghi đúng args đã truyền ở phần "Correctness: …". Phần ``mức `<risk>` `` mà `merge-pr` đọc không đổi.

##### Test chấp nhận

- [ ] Bảng §3 và §C của skill `review-pr` ghi đúng ba mức trên; mức low không còn "tự rà" / "Không gọi skill".
- [ ] §C ghi rõ: mỗi lần gọi truyền cả mức effort lẫn `--max-findings`; low / med truyền `--max-findings default`, high truyền `all`; kèm lý do (lựa chọn được giữ tới khi truyền `default`).
- [ ] Mẫu comment §4 ghi phần Correctness theo args mới, gồm cả trường hợp PR chỉ sửa docs và trường hợp `code-review` không chạy được.
- [ ] `CLAUDE.md` bước 4 và dòng `code-review` của "Skills được phép" khớp mức mới (gọi ở mọi mức).
- [ ] ADR-0017: mục 3 (dòng Correctness), phương án "Chạy `code-review` cho mọi mức" và hệ quả ghi rõ đã sửa ngày 21/10/2026; phụ lục mới ghi nguyên văn quyết định, bảng mức, `--max-findings` và những gì giữ nguyên. Dòng ADR-0017 của `docs/decisions/README.md` khớp.
- [ ] `docs/PROJECT-STATE.md` có mục 2026-10-21 về quyết định này.
- [ ] Grep toàn repo (`code-review medium`, `code-review high`, `mức med`, `med/high`, `tự rà`…) không còn chỗ nào nói mức cũ như quy tắc hiện hành. Ngoại trừ chỗ ghi lịch sử: `docs/reviews/**`, `docs/state/review-notes.md`, `docs/metrics/**`, phần gạch / "Sửa ngày" của ADR-0017. Kết quả grep ghi vào PR.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (PR chỉ sửa `*.md` ngoài `CODE_DOCS` → không chạy CI)
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #731 — docs: raise the code-review levels of review-pr (T-279)

Trạng thái: MERGED · merge 2026-10-20T19:10:35Z · commit `cece0f95877dcfc199e76f95de4a3bc9748b4300` · nhánh `task/T-279-review-pr-levels` · nhãn: risk:low

Closes #730

#### Thay đổi

Ghi và áp dụng quyết định Owner ngày 21/10/2026: "nâng mức của skill /review-pr lên max cho med, max-findings cho high risk, với low thì high". Trục Correctness của `review-pr`:

| Mức | Trước | Từ 21/10/2026 (args truyền cho `code-review`) |
|---|---|---|
| low | tự rà inline, không gọi skill | `high <N> --max-findings default` |
| med | `medium <N>` | `max <N> --max-findings default` |
| high | `high <N>` | `max <N> --max-findings all` |

- `.claude/skills/review-pr/SKILL.md`:
  - bảng §3;
  - §C viết lại: bảng args theo mức, luôn truyền cả mức effort lẫn `--max-findings`, lý do low / med truyền `default`;
  - phần "Correctness:" của mẫu comment §4;
  - câu "PR chỉ sửa docs" ở §2 nói rõ là không gọi `code-review`.
- `CLAUDE.md`: bước 4 của "Quy trình một task", dòng `code-review` của "Skills được phép".
- ADR-0017:
  - phụ lục mới "nâng mức `code-review`": nguyên văn quyết định, bảng mức, `--max-findings`, những gì giữ nguyên, hệ quả;
  - dòng Correctness của mục 3, phương án "Chạy `code-review` cho mọi mức" và hệ quả đầu tiên: gạch phần cũ, thêm dòng mới (như cách mục 5 ghi lần sửa 17/10);
  - dòng trạng thái và câu ưu tiên chi phí ở Bối cảnh trỏ tới phụ lục.
- `docs/decisions/README.md`: dòng ADR-0017.
- `docs/PROJECT-STATE.md`: mục 2026-10-21.

Cách hiểu, Owner xác nhận khi review:

- "max-findings cho high risk" = `max` kèm `--max-findings all`, vì mức high không thấp hơn med.
- PR chỉ sửa docs (`docs/**`, `*.md`, trừ `CODE_DOCS`) vẫn bỏ trục Correctness như trước. Quyết định chỉ nói mức của `code-review`, và PR docs không có code để săn lỗi.

Sửa kèm, trong đoạn §C đang viết lại: "(ADR-0017 §3)" → "(ADR-0017 mục 4)". Câu "kết quả chỉ để đọc" là mục 4 của ADR; §3 là bảng mức.

Kiểm `--max-findings`: theo mô tả skill `code-review`, lựa chọn này được giữ cho tới khi truyền `--max-findings default`. Mô tả không nói lựa chọn được giữ trong phiên hay lưu trên máy, nên lần gọi nào cũng truyền rõ: low / med `default`, high `all`.

Grep toàn repo sau khi sửa, trừ `docs/reviews/**`, `docs/state/review-notes.md`, `docs/metrics/**`. Mẫu: `code-review medium|high`, `` `medium <N>` ``, `mức med`, `med/high`, `low/med`, `tự rà`, `rà nhanh`, `rà inline`, `Không gọi skill`, `for med/high`.

- Còn lại, đều đúng:
  - phần lịch sử đã gạch hoặc ghi "trước" trong ADR-0017 và trong mục 2026-10-21 của `PROJECT-STATE.md`;
  - ADR-0017 phụ lục 27/09, mục 1 (#96) và mục 3 (R1–R4): sự kiện đã qua;
  - "rà inline" của đường lùi khi `code-review` không chạy được;
  - `apps/desktop/src/data/ai-tauri.ts`, `packages/ai/src/schema.ts`: mức reasoning của AI, không liên quan.
- Không nói mức `code-review`, không cần sửa: `docs/process/REVIEW-CHECKLIST.md`, `docs/agents/`, mẫu Issue / PR trong `.github/`, `tools/`, `.claude/hooks/`. `tools/` chỉ đọc phần ``mức `<risk>` `` của comment review (`session-core.mjs`, `pr-core.mjs`); phần đó không đổi.

#### Test chấp nhận

- [x] Bảng §3 và §C của skill `review-pr` ghi đúng ba mức; mức low không còn "tự rà" / "Không gọi skill".
- [x] §C: mỗi lần gọi truyền cả mức effort lẫn `--max-findings`; low / med `default`, high `all`; có lý do.
- [x] Mẫu comment §4 ghi phần Correctness theo args mới, gồm cả PR chỉ sửa docs và `code-review` không chạy được.
- [x] `CLAUDE.md` bước 4 và dòng `code-review` của "Skills được phép" khớp mức mới.
- [x] ADR-0017: mục 3, phương án, hệ quả ghi rõ đã sửa ngày 21/10/2026; có phụ lục mới; dòng ADR-0017 của `docs/decisions/README.md` khớp.
- [x] `docs/PROJECT-STATE.md` có mục 2026-10-21.
- [x] Grep toàn repo: không còn chỗ nói mức cũ như quy tắc hiện hành (kết quả ở trên).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `98d0016`: một mục "Trùng file".

- L176 `CLAUDE.md` (cổng "tested base" ở bước 5 và `.claude/rules/ci.md:12` thiếu vế đọc đủ trang commit của `main`, DR6-85) → **để lại**. Khác chủ đề (cổng CI, không phải mức review), và file chính `.claude/rules/ci.md` nằm ngoài danh sách Issue cho sửa. Gộp vào lần chạm sau của `ci.md`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

PR chỉ sửa `*.md` ngoài `CODE_DOCS` → CI không chạy.

#### Lưu ý khi merge và khi áp dụng

- **Xung đột dự kiến với PR #717** ở `docs/PROJECT-STATE.md`: cả hai PR thêm mục ngay sau mục 2026-10-19 cuối. PR nào merge sau thì cập nhật nhánh, giữ cả hai mục (mục của PR này đứng sau mục 20/10, 21/10 của #717), rồi review lại phần merge. Ở `CLAUDE.md` và `docs/decisions/README.md`, hai PR sửa những dòng khác nhau.
- **Lần review đầu sau khi merge:** phiên review nạp skill `review-pr` từ worktree review (`Project-2C-review`, `-review-2`), lúc worktree còn ở SHA của lần review trước. Nếu SHA đó chưa có thay đổi này (vd. head của #717 / #718, hoặc head của PR có nhánh cắt trước khi PR này merge), phiên đó chạy mức cũ. Vì vậy trước khi mở phiên review, đưa worktree về `origin/main`: `git fetch origin`, rồi `git checkout --detach origin/main` trong worktree đó.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-279 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #735 — T-280: Thanh trên cùng không che phần tử nhận focus (scroll-padding-top, WCAG 2.4.11)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **Phần tử nhận focus không nằm dưới thanh trên cùng (WCAG 2.2 SC 2.4.11 Focus Not Obscured).** Thanh trên cùng của app là `sticky`, nhưng trang không có `scroll-padding-top`. Hệ quả:
   - Tab / Shift+Tab, hoặc `focus()` của đích dự phòng DR6-83, coi phần tử nằm trong dải ≈ 59 px ngay dưới thanh là đã thấy nên không cuộn, và thanh che nó. Đích dự phòng có thể rơi vào dải này: tiêu đề Hợp đồng, dòng 11e, dòng "ngoài góc nhìn", khung Chi tiết dưới `lg`.
   - `scrollIntoView({ block: 'start' })` của "Xem tất cả" (hộp lịch hẹn mở từ hồ sơ KH) và của link sang Dữ kiện KYC trong panel AI đưa đích xuống dưới thanh.
   
   Sửa ở một chỗ: vùng nhìn của trang chừa phần thanh trên cùng (`scroll-padding-top` trên phần tử cuộn của trang). Không sửa từng nơi gọi.
2. **Ảnh hướng dẫn không phụ thuộc class `sticky` (ghi chú OPEN L104).** CSS của hàm `shot` chọn header bằng `header.sticky`. Đổi sang một selector ổn định để ảnh phần cao không bị header che dòng đầu nếu class đổi.

##### Bối cảnh

Ghi chú không chặn của review PR #693 (T-251, #655). Ghi chú nêu rõ: chỉ sửa một dòng CSS, nhưng đổi hành vi cuộn của mọi màn, nên tách thành Issue riêng. Deep review lượt 3 xếp mục này vào KNOWN nên bản tổng hợp T-267 không tạo Issue. Owner 21/10/2026 quyết: tạo Issue riêng, milestone Phase 6, làm trước G7.

Tiêu đề màn không xuống dòng (`whitespace-nowrap`). Chiều cao thanh có thể khác giữa màn có và màn không có bộ chọn phạm vi. Cửa sổ nhỏ nhất là 1 100 × 700.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục "Ba ghi chú không chặn của review PR #693" (dòng thanh `sticky` và 4 ý con) và mục `shots.guide.ts:30` (ghi chú của review #533 / #554)
- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §6.4 (DR6-83, đích focus dự phòng)
- `apps/desktop/src/shell/AppShell.tsx:14-46` (`useScreenFocus`), `:66-70` (header `sticky`); `apps/desktop/src/index.css`
- `apps/desktop/src/routes/customers/CustomerProfile.tsx:100-108`, `:220-228`; `apps/desktop/src/routes/customers/KycIntelligence.tsx:95-102`; `packages/ui/src/components/dialog-focus.ts` (`focusBack`)
- `e2e/navigation.spec.ts:68-176` (DR6-35, DR6-81: mẫu đo focus và cuộn); `e2e/customer-policies.spec.ts:207-241` (DR6-83, Hợp đồng); `e2e/guide/shots.guide.ts:20-35`
- `.claude/rules/i18n-ui.md` (token, không khoảng cách tùy tiện)

##### File / thư mục được phép sửa

- `apps/desktop/src/index.css`
- `apps/desktop/src/shell/AppShell.tsx` (chỉ khi cần: thuộc tính `data-*` ổn định cho header, hoặc chiều cao đo thật của thanh)
- `e2e/topbar-focus.spec.ts` (mới)
- `e2e/guide/shots.guide.ts` (chỉ chuỗi `style` của hàm `shot`)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `e32dca3`):

- L179, L180, L181, L182 (thanh `sticky` che focus; đích dự phòng DR6-83; `scrollIntoView` của "Xem tất cả"; "Issue riêng"): **gộp**, là mục tiêu 1. L181 trùng file `CustomerProfile.tsx` mà #724 để lại; task này sửa ở CSS nên không chạm file đó.
- L104 (`shots.guide.ts:30`: `header.sticky` dựa vào class Tailwind): **gộp**, là mục tiêu 2.
- L123 (tiêu đề cửa sổ exe không đổi theo màn): để lại, cần sửa `src-tauri` (mức high, nhãn `build-exe`).
- L145 (`scrollTo(0, 0)` khi đổi mục trong Cài đặt): để lại, chỉ ghi lại.

##### Interface / hợp đồng

- Không đổi chữ, luật, API hay component.
- Giá trị chừa ra ≥ chiều cao thanh trên cùng ở mọi màn, có và không có bộ chọn phạm vi, ở 1 100 và 1 440. Lấy theo thang khoảng cách của Tailwind / token (vd. `--spacing(…)`), không viết số px tùy tiện. Nếu một giá trị cố định không đủ ở mọi màn thì dùng chiều cao đo thật của thanh (biến CSS do `AppShell.tsx` đặt).
- `window.scrollTo(0, 0)` khi mở màn mới (DR6-81) và `focus({ preventScroll: true })` giữ nguyên hành vi.

##### Test chấp nhận

- [ ] e2e ở 1 100 × 700, màn Khách hàng có seed: cuộn sao cho một link ở dòng của danh sách nằm dưới thanh, rồi Shift+Tab tới link đó → cạnh trên của nó ≥ cạnh dưới thanh trên cùng.
- [ ] e2e đích dự phòng DR6-83 (tiêu đề Hợp đồng, theo ca bàn phím của `customer-policies.spec.ts`, khi trang đã cuộn để tiêu đề nằm dưới thanh) → cạnh trên tiêu đề ≥ cạnh dưới thanh.
- [ ] e2e "Xem tất cả" của hộp lịch hẹn mở từ hồ sơ KH (KH có > 5 lịch) → cạnh trên thẻ Lịch hẹn ≥ cạnh dưới thanh. Cùng kiểm cho link sang Dữ kiện KYC của panel AI.
- [ ] Đột biến: bỏ dòng `scroll-padding-top` → ba ca trên đỏ.
- [ ] Toàn bộ e2e hiện có xanh, gồm DR6-35, DR6-81 (`navigation.spec.ts`).
- [ ] Ảnh hướng dẫn: hàm `shot` không còn dựa vào class `sticky`. Chạy lại spec chụp ảnh không làm header che dòng đầu ảnh phần cao (`06-ai-phan-tich`).

Ước lượng: ≈ 2–8 dòng SP + ≈ 70–100 dòng e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

#719 (fixture đồng hồ e2e chung, dòng import của các spec)

## PR #760 — fix: keep what scrolls into view out from under the topbar (T-280)

Trạng thái: MERGED · merge 2026-10-22T16:48:49Z · commit `018fdc415aa5c00d665a8e25bbe31f2a88846cd5` · nhánh `task/T-280-topbar-focus` · nhãn: type:task, risk:low

Closes #735

#### Thay đổi

T-280. Ghi chú không chặn của review PR #693 (L160–L163: thanh trên cùng `sticky` che phần tử nhận focus) và review PR #626 (L102, L103: hàm `shot`).

- **`apps/desktop/src/index.css`:** thêm `main :not(dialog, dialog *) { scroll-margin-top: --spacing(20); }` (trong `@layer base`, như `theme.css`). Khi focus hay `scrollIntoView` đưa thứ gì trong một màn vào khung nhìn, nó dừng cách đỉnh cửa sổ 80, tức dưới thanh. Áp dụng cho:
  - Tab / Shift+Tab;
  - `focus()` của đích dự phòng DR6-83;
  - "Xem tất cả" và link sang Dữ kiện KYC.

  Chỉ sửa một chỗ, không chạm nơi gọi nào. `window.scrollTo(0, 0)` (DR6-81) và `focus({ preventScroll: true })` không đổi hành vi.
- **`e2e/guide/shots.guide.ts`:** chuỗi `style` của `shot` chọn `header { position: static !important; }`, không dựa vào class `sticky` nữa (**L102**). App chỉ có một `<header>`. Comment ngay trên cũng sửa (**L103**).
- **`e2e/topbar-focus.spec.ts` (mới):** 6 ca, chạy ở 1 100 × 700.

`AppShell.tsx` không cần sửa: một giá trị cố định đủ cho mọi màn.

Cỡ: 13 dòng CSS (7 dòng comment), 6 dòng `shots.guide.ts`, 165 dòng e2e.

##### Lệch so với Issue

**1. Dùng `scroll-margin-top` trên nội dung của màn, không dùng `scroll-padding-top` trên `html`.** Đây là thay đổi chính. Issue chỉ định `scroll-padding-top` trên phần tử cuộn của trang; cách này lấy từ ghi chú review #693, mà ghi chú ấy ghi "chưa tái hiện, lập luận". Đo trên Edge thì cách đó gây hồi quy:

- Thanh trên cùng nằm **trong** trang, và luôn ở trong dải được chừa ra. Khi một nút của chính thanh nhận focus (bằng bàn phím hay `focus()`: nhóm Góc nhìn, ô Team / RE), trình duyệt cuộn **trang** để đưa nút ra khỏi dải. Nút vẫn đứng yên vì thanh là sticky, còn nội dung bên dưới nhảy lên. Trang đang cuộn ở 500 nhảy về 150 nếu chừa 64, về 142 nếu chừa 80, về 140 nếu chừa 84. Không chừa thì trang đứng yên.
- Khung Chi tiết lịch hẹn cũng sticky (`lg:top-20` = 80). Chừa hơn 80 thì khi khung nhận focus (DR6-83), trang cuộn đúng bằng phần dư. Ở lần chạy toàn bộ e2e đầu tiên với 84, ca `appointment-outcome.spec.ts:448` đỏ (300 → 296).

`scroll-margin-top` đặt trên **đích** (nội dung trong `main`), không đặt trên trang, nên thanh (nằm ngoài `main`) không bị ảnh hưởng. Vẫn sửa ở một chỗ, và giá trị vẫn ≥ chiều cao thanh ở mọi màn.

Hộp thoại được loại ra. Chúng nằm ở top layer, phía trên thanh, và có thể cuộn bên trong: nếu không loại, Shift+Tab về một ô bị khuất sẽ dừng cách mép trên hộp 80. Trong `main` chỉ có vùng cuộn ngang (`overflow-x-auto` ở Báo cáo, Team), không có vùng cuộn dọc.

**2. Giá trị là 80 (`--spacing(20)`), không lấy mức tối thiểu "≥ chiều cao thanh".** Chiều cao thanh đo được (Edge, 22/10), như nhau ở 1 100 và 1 440:

| Màn | Thanh |
|---|---|
| Tổng quan, Lịch hẹn, Khách hàng, Báo cáo (góc nhìn Toàn bộ / Team / RE) | 64 |
| Team & nhân sự, Cài đặt, hồ sơ KH | 59 |

Giá trị phải thỏa ba ràng buộc:
- **≥ 64:** hợp đồng của Issue (thanh cao nhất).
- **≥ 59 + 17 = 76:** `scrollIntoView({ block: 'start' })` đưa **tiêu đề** `h2` lên mép, mà tiêu đề nằm dưới mép thẻ 17 (`p-4` + viền). Test chấp nhận 3 đòi mép **thẻ** ≥ cạnh dưới thanh ở hồ sơ KH.
- **≤ 80:** chỗ khung Chi tiết dính (`top-20`). Lớn hơn thì trang cuộn khi khung nhận focus.

Trên thang khoảng cách chỉ có 19 (76) và 20 (80) thỏa cả ba. PR lấy 20, đúng đường "ngay dưới thanh" mà app đã dùng.

Đột biến xác nhận hai đầu: lên 21 thì `appointment-outcome.spec.ts:448` đỏ (300 → 296); xuống 18 thì hai ca thẻ đỏ (55 < 59).

Giới hạn còn lại: ở màn **có** bộ chọn, nếu một thẻ được đưa lên đỉnh bằng tiêu đề thì mép thẻ ở 63, dưới thanh 64 một chút. Hiện không nơi nào gọi như vậy: cả hai `scrollIntoView({ block: 'start' })` đều ở hồ sơ KH.

**3. Thêm hai e2e ngoài danh sách test của Issue:**
- Ca canh hồi quy ở mục 1. Màn Khách hàng (Bảng) đang cuộn ở 500, focus vào nút "Team" của thanh → trang đứng yên. Nếu dùng `scroll-padding-top` trên `html` thì ca này đỏ (500 → 142).
- Ca canh hợp đồng. Ở mọi màn, có và không có bộ chọn (cả ba góc nhìn), ở 1 100 và 1 440: giá trị tính được của `scroll-margin-top` (đọc trên một phần tử trong `main`) ≥ chiều cao thanh. Vì đọc giá trị tính được, ca này cũng bắt được trường hợp Tailwind không dịch `--spacing()`.

**4. `shots.guide.ts`:** Issue chỉ cho sửa chuỗi `style`; PR sửa thêm 2 dòng comment ngay trên chuỗi đó (L103, NIT).

**5. Không commit lại ảnh hướng dẫn.**
- Ảnh `06-ai-phan-tich` chụp từ `main` và chụp từ nhánh này (với cả hai cách ở mục 1) trùng nhau từng byte (376 × 1 001). Vậy task này không làm đổi ảnh 06; các ảnh khác không so.
- Ảnh đang commit (376 × 985, chụp 15/10) khác ảnh trên vì app đã đổi từ đó. G7 chụp lại cả bộ.
- Đột biến bỏ hẳn `style` cũng ra cùng ảnh 06: ở 1 440 × 900 khung AI đã nằm trong cửa sổ nên Playwright không cuộn. `style` vẫn giữ cho phần phải cuộn tới.

#### Test chấp nhận

- [x] e2e 1 100 × 700, màn Khách hàng (Bảng), dữ liệu seed. Link ở dòng thứ 9 được cuộn vào dải dưới thanh (điều kiện đầu: nằm trọn trong dải); Shift+Tab tới link đó → cạnh trên của nó ≥ cạnh dưới thanh.
- [x] e2e đích dự phòng DR6-83, theo ca bàn phím của `customer-policies.spec.ts`: Lưu HĐ từ thẻ Hợp đồng trống. Trước khi lưu, trang được cuộn để tiêu đề Hợp đồng nằm dưới thanh → sau khi lưu, tiêu đề có focus và cạnh trên ≥ cạnh dưới thanh. KH mới cần một lượt phân tích Mock thì trang mới đủ dài; điều kiện đầu bắt được trường hợp trang không đủ dài.
- [x] e2e "Xem tất cả" (KH có 6 lịch tính tới hôm nay) → cạnh trên thẻ Lịch hẹn ≥ cạnh dưới thanh. Link "Xem ở Dữ kiện KYC →" của panel AI → cạnh trên thẻ Dữ kiện KYC ≥ cạnh dưới thanh. Cả hai ca kiểm trước rằng trang cuộn được đủ xa để mép thẻ lên tới đỉnh cửa sổ, để không xanh suông.
- [x] Đột biến, bỏ dòng `scroll-margin-top` → 5 ca đỏ, đúng ở phép so vị trí:
  - ca canh: 0 < 64;
  - Shift+Tab: 24,1 < 64;
  - DR6-83: 27,5 < 59;
  - "Xem tất cả": −17 < 59;
  - link KYC: −16,75 < 59.

  Ca thanh trên và `appointment-outcome.spec.ts:448` vẫn xanh.
- [x] Toàn bộ e2e xanh (267 / 267, local, Home PC, với `scroll-margin-top`), gồm DR6-35, DR6-81 (`navigation.spec.ts`) và DR6-83 của khung Chi tiết (`appointment-outcome.spec.ts:448`).
- [x] Ảnh hướng dẫn: `shot` không còn dựa vào class `sticky`. Chạy lại `06 AI`: dòng đầu ảnh ("KYC Intelligence · CURRENT · Mock") không bị header che.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`:

- L102 (`shots.guide.ts:30`, `header.sticky` dựa vào class Tailwind): đã sửa.
- L103 (NIT `shots.guide.ts:28–29`): đã sửa.
- L160 (`focus()` coi dải ≈ 59 px dưới thanh là đã thấy): đã sửa.
- L161 (đích dự phòng DR6-83 nằm trong dải đó): đã sửa.
- L163 ("sửa một dòng CSS … → Issue riêng"): đã sửa, nhưng bằng `scroll-margin-top` thay vì `scroll-padding-top` (Lệch 1).

Các mục không có trong `--diff` vì file của mục không nằm trong diff:
- L162 (`scrollIntoView` của "Xem tất cả", `CustomerProfile.tsx:226`): cũng đã sửa nhờ CSS, không chạm file đó.
- L118 (tiêu đề cửa sổ exe): để lại, vì phải sửa `src-tauri` (mức high, nhãn `build-exe`).
- L138 (`scrollTo(0, 0)` khi đổi mục Cài đặt): để lại, chỉ ghi lại.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-280 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #693, #626 — T-280 (#735, PR #760, `REVIEW: PASS` @`e48b862`):
  - #693, thanh trên cùng `sticky` che phần tử nhận focus (WCAG 2.4.11; `apps/desktop/src/shell/AppShell.tsx:70`), cả bốn ý con: `apps/desktop/src/index.css` nay có `main :not(dialog, dialog *) { scroll-margin-top: --spacing(20); }`. Tab / Shift+Tab, `focus()` của đích dự phòng DR6-83, `scrollIntoView({ block: 'start' })` của "Xem tất cả" (`apps/desktop/src/routes/customers/CustomerProfile.tsx:226`) và của link sang Dữ kiện KYC (`apps/desktop/src/routes/customers/KycIntelligence.tsx:100`) đều dừng dưới thanh. Ca e2e ở `e2e/topbar-focus.spec.ts`: Shift+Tab ở bảng KH, tiêu đề Hợp đồng, "Xem tất cả", link KYC; bỏ luật thì 5 ca đỏ (đột biến của PR). Các đích dự phòng khác (dòng 11e, dòng "ngoài góc nhìn", khung Chi tiết dưới `lg`) nằm trong `main` nên theo cùng luật, chưa có ca riêng. Không dùng `html { scroll-padding-top }` như ghi chú đề xuất: lệch so với Issue, xem mục review #760 ở OPEN.
  - #626, `e2e/guide/shots.guide.ts:30`: `shot` chọn `header { position: static !important; }` (app chỉ có một `<header>`), không dựa vào class `sticky` nữa; NIT comment `:28-29` nay nói đúng điều kiện "phần Playwright phải cuộn tới".

---

# Issue #752 — T-281: Lưu file: thư mục dữ liệu không cho tạo file vẫn báo "chương trình khác" (sau DR6-120)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

Khi thư mục `Project2C-data` không cho tạo file mới, app phải nói đúng nguyên nhân, không bảo đóng "chương trình khác". Cùng họ với DR6-120, nhưng đi qua thư mục thay vì qua file.

1. **Lúc mở:** nếu thư mục dữ liệu không cho tạo file thì `storage::open` trả `ACCESS_DENIED`, ra trang lỗi khởi động như DR6-74 / DR6-120. Ví dụ cách làm: thử tạo rồi xóa một file tạm trong thư mục, hoặc tạo `project2c.db.tmp` rỗng rồi xóa. Tên và cách làm do phiên chọn.
2. **Lúc lưu:** nếu bước tạo `project2c.db.tmp` (`write_atomic_with`) lỗi `PermissionDenied`, `save` trả một mã riêng. Mã này có thể dùng chung `READ_ONLY`, hoặc là mã mới; phiên chọn. Dải lưu và hộp đóng app nói "thư mục dữ liệu không cho ghi", không nói "chương trình khác".

##### Bối cảnh

Review PR #750 (T-275), comment `REVIEW: PASS` @`0733cc4`, mục Correctness đầu tiên. Ghi chú OPEN ở `docs/state/review-notes.md` (khối review #750, mục `storage.rs:228`). Đã tái hiện bằng chương trình thử của phiên review (Rust 1.98.1, chỉ dùng `std`, không quyền quản trị):

- Thư mục cấm `(WD)` (không cho tạo file, không kế thừa), `project2c.lock` đã có sẵn.
- `open_lock_file` mở lock bằng `OPEN_ALWAYS` nên không tạo file nào; đọc `project2c.db` và thử `DELETE` đều Ok. Vậy `open` cho qua, app mở bình thường.
- Lần lưu nào cũng lỗi os error 5 ở bước tạo `.tmp`. `read_only` → `replace_refused(db)` = false, nên giữ lỗi trần; `saveFailure` ra `other`, và câu hiện ra là "file có thể đang mở trong chương trình khác". Thử lại không bao giờ được.

Hiếm (ACL thư mục do quản trị đặt, hoặc đổi giữa phiên), nhưng hậu quả giống DR6-120: người dùng đi tìm một chương trình không có, rồi mất các thay đổi chưa lưu. **Owner 23/10: làm trước G7.**

##### Tài liệu cần đọc

- Comment review PR #750: https://github.com/AlexH-AI/Project-2C/pull/750#issuecomment-6324759834 (bảng đo)
- Thân PR #750 (bảng ACL, lệch 1–2); Issue #726
- `apps/desktop/src-tauri/src/storage.rs` (`open_with`, `replace_refused`, `read_only`, `write_atomic_with`, test `Denied`, `refuse_replacing`)
- `apps/desktop/src/data/tauri-storage.ts` (`saveFailure`), `apps/desktop/src/shell/{SaveWarning.tsx,CloseGuard.tsx}`, `apps/desktop/src/i18n/vi.ts` (`storage.*`, `close.*`)

##### File / thư mục được phép sửa

- `apps/desktop/src-tauri/src/storage.rs` (gồm test trong file)
- `apps/desktop/src/data/{tauri-storage.ts,tauri-storage.test.ts,tauri-contract.test.ts}`
- `apps/desktop/src/shell/{SaveWarning.tsx,SaveWarning.test.tsx,CloseGuard.tsx,CloseGuard.test.tsx}`
- `apps/desktop/src/i18n/vi.ts` (khóa `storage.*`, `close.*`)
- `docs/user-guide/{01-bat-dau.md,10-su-co.md}`
- `e2e/{support.ts,dialog-keyboard.spec.ts}` (để gộp mục `CloseGuard.tsx:28`, `:67`, xem dưới)

##### Ghi chú OPEN liên quan

Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu. Đã biết:
- mục `storage.rs:228` của khối review #750: **gộp** (chính là Issue này);
- mục `docs/user-guide/10-su-co.md:15`, cột "Làm gì" của dòng ACCESS_DENIED chưa nói quyền xóa: nên **gộp**, vì cùng dòng sẽ sửa;
- mục `apps/desktop/src/shell/CloseGuard.tsx:28`, `:67` của khối review #750 (chưa có test nào kiểm `CloseGuard` truyền `saveError()` vào `CloseDialog`): **gộp** (Owner 22/10). Cho `window.exe.failSaves` ở `e2e/support.ts` mang chuỗi mã của Rust (`'READ_ONLY'`, `'DISK_FULL'`, và mã mới nếu có), rồi thêm ca ở `e2e/dialog-keyboard.spec.ts` kiểm dải lưu và hộp đóng app ra đúng câu theo từng nguyên nhân;
- mục *Repeated Switches* của khối review #750 (`SAVE_FAILED` ở `apps/desktop/src/shell/SaveWarning.tsx:6`, `UNSAVED_BODY` ở `apps/desktop/src/shell/CloseGuard.tsx:8`): **gộp** (Owner 22/10). Dùng `satisfies Record<SaveFailure, …>` cho cả hai bảng, hoặc gộp thành một bảng `{ banner, close }` theo nguyên nhân; làm cùng lúc với việc thêm mã mới (nếu có).

##### Interface / hợp đồng

- Mã lỗi đi cùng đường với `DISK_FULL` / `READ_ONLY` (`saveError()` → `saveFailure`). Câu mới đặt trong `vi.ts`.
- Không thêm crate (G4). ACL trong test dựng bằng `icacls`, theo mẫu `Denied` của #750.

##### Test chấp nhận

- [ ] Test Rust: thư mục cấm `(WD)`, `project2c.lock` có sẵn, file đọc được → `open` trả `ACCESS_DENIED`; file không đổi; không có `backups\`; gỡ ACL xong thì mở được.
- [ ] Test Rust: ACL thư mục đổi giữa phiên (cấm `(WD)` sau `open`) → `save` trả mã đã chọn, file không đổi. Các ca của #750 vẫn ra như cũ: chương trình khác giữ file (chia sẻ 0, 1 | 2) vẫn ra lỗi của Windows; file chỉ đọc / ACL file vẫn ra `READ_ONLY`.
- [ ] Unit app: dải lưu và hộp đóng app ra đúng câu cho mã mới (nếu có mã mới).
- [ ] Exe: tái hiện ca thư mục cấm tạo file, lúc mở và giữa phiên (ghi kết quả trong PR).

Ước lượng: ≈ 25–50 dòng SP + ≈ 100–130 dòng test (gồm ca e2e của mục `CloseGuard.tsx`).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh, `pnpm verify:rust` xanh
- [ ] CI xanh (gồm build exe, nhãn `build-exe`)
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med

##### Bị chặn bởi

Không (#750 đã merge)

## PR #764 — fix: tell a data folder that lets no new file in from a program holding the file (T-281)

Trạng thái: MERGED · merge 2026-10-23T07:46:13Z · commit `37539322cc57e648494feecb209e36391c65e830` · nhánh `task/T-281-folder-read-only` · nhãn: type:task, risk:med, build-exe

Closes #752

#### Thay đổi

T-281, sau DR6-120 (review PR #750, ghi chú OPEN `storage.rs:228`): thư mục `Project2C-data` không cho tạo file mới (ACL cấm `(WD)`, `project2c.lock` đã có) không còn bị báo là "chương trình khác".

- **Hỏi thư mục đúng quyền mà lần lưu hỏi (`add_refused`).** Mỗi lần lưu tạo `project2c.db.tmp` trong thư mục, tức hỏi quyền `FILE_ADD_FILE` của thư mục. `add_refused` mở thư mục chỉ với quyền đó (kèm `FILE_FLAG_BACKUP_SEMANTICS`, thiếu cờ này Windows không mở thư mục), như `delete_refused` của #750 mở file chỉ với `DELETE`. Cách này không tạo file nào, nên không có file tạm sót lại khi app sập, và không đụng `project2c.db.tmp` mà lần mở lại webview phải giữ (`open_again_in_the_same_process_leaves_the_db_tmp_alone`).
- **Lúc mở (`storage::open`):** thư mục bị từ chối `FILE_ADD_FILE` → `ACCESS_DENIED`, ra trang lỗi khởi động như DR6-74 / DR6-120. Bước kiểm nằm sau khi lấy khóa và dọn file tạm (để lần thử lại vẫn được dọn), trước khi đọc file. Vậy cả lần mở đầu (chưa có `project2c.db`) trong thư mục như thế cũng dừng ở trang lỗi, thay vì sinh dữ liệu giả lập rồi lần lưu nào cũng lỗi. Bước này chạy ở mọi lần mở, như `replace_refused`.
- **Lúc lưu (`storage::save`):** mã mới **`FOLDER_READ_ONLY`**. `read_only` thành `refused`: lỗi `PermissionDenied` mà thư mục bị từ chối → `FOLDER_READ_ONLY`; nếu không thì như cũ (`replace_refused` → `READ_ONLY`, còn lại giữ lỗi của Windows). Hỏi thư mục trước, vì lần lưu ghi `.tmp` trước rồi mới thay file.
- **Mã mới, không dùng chung `READ_ONLY`:** câu `READ_ONLY` bảo bỏ chỉ đọc *của file* `project2c.db`. Ở ca này file không có gì sai, người dùng làm theo sẽ không thấy gì. Câu mới (`storage.saveFolderReadOnly`, `close.unsavedBodyFolderReadOnly`) nói thư mục không cho tạo file mới, và bảo nhờ người quản trị cấp lại quyền ghi vào thư mục.
- **Một bảng câu cho dải lưu và hộp đóng app (L221, *Repeated Switches*):** `SAVE_FAILED` ở `SaveWarning.tsx` thành `{ banner, close }` theo nguyên nhân, `as const satisfies Record<SaveFailure, …>`; `CloseGuard.tsx` dùng chung, bỏ `UNSAVED_BODY`. Thêm một nguyên nhân chỉ sửa `saveFailure` và một dòng của bảng.
- **E2e phủ đường `saveError()` → dải lưu và hộp đóng app (L219):** `window.exe.failSaves` của bản exe giả mang chuỗi Rust gửi (`'DISK_FULL'`, `'READ_ONLY'`, `'FOLDER_READ_ONLY'`; `true` = câu của Windows). Thêm ca `e2e/dialog-keyboard.spec.ts` kiểm cả hai nơi ra đúng câu theo từng nguyên nhân.
- Hướng dẫn: `01-bat-dau.md` thêm câu dải mới; `10-su-co.md` thêm dòng ở bảng nguyên nhân, cột "Làm gì" của dòng `ACCESS_DENIED` nay là "kiểm quyền ghi và xóa" (**L220**).

- **Gộp thêm L146** (`e2e/support.ts:26`, `canvas` thật ra là context 2D → `context`): ba dòng đổi tên trong file đã được phép sửa.

Cỡ: ≈ 85 dòng sản phẩm (≈ 35 dòng là doc comment, 4 dòng là hai câu `vi.ts`), ≈ 120 dòng test (gồm 31 dòng e2e), 8 dòng tài liệu. Hơn ước lượng của Issue (25–50) vì doc comment và việc gộp bảng câu của L221. Mọi file đều trong danh sách của Issue.

##### Lựa chọn của phiên (Issue để phiên chọn)

1. **Cách kiểm lúc mở:** hỏi quyền thay vì "thử tạo rồi xóa một file tạm". Hai cách trả cùng câu trả lời cho ACL, nhưng cách tạo file có nhược điểm. Nếu app sập giữa hai bước thì sót file tạm. Nếu dùng `project2c.db.tmp` thì lần mở lại webview gặp `.tmp` có sẵn (test trên giữ nó), nên không kết luận được.
2. **Mã mới thay vì dùng chung `READ_ONLY`:** lý do ở trên. Hằng TS `FOLDER_READ_ONLY` có test hợp đồng với Rust.
3. **`window.exe.failSaves = true`** nay ném chuỗi `'Access is denied. (os error 5)'` như Rust (Tauri trả lỗi là chuỗi), thay vì `Error('file locked')`. Hai test đang dùng `true` (`dialog-keyboard.spec.ts:158`, `trash.spec.ts:622`) vẫn ra nguyên nhân "còn lại" như cũ, đã chạy xanh.

#### Test chấp nhận

- [x] Test Rust lúc mở: `open_reports_a_data_folder_that_lets_no_new_file_in_as_access_denied` (thư mục cấm `(WD)` không kế thừa, `project2c.lock` có sẵn, file đọc được, lần lưu bị `PermissionDenied`) → `ACCESS_DENIED`, file không đổi, thư mục chỉ còn `project2c.db` + `project2c.lock` (không `backups\`), gỡ ACL thì mở được.
- [x] Test Rust giữa phiên: `a_save_the_data_folder_refuses_is_reported_as_folder_read_only` (cấm `(WD)` sau `open`) → `FOLDER_READ_ONLY`, file không đổi, không `.tmp`; gỡ ACL thì lưu được. Các ca của #750 vẫn ra như cũ, không sửa test: chương trình khác giữ file (chia sẻ 0, 1 | 2) → lỗi của Windows; chỉ đọc giữa phiên và ACL file + `(DC)` → `READ_ONLY`; ACL chỉ cấm ghi vào file → vẫn mở và lưu được.
- [x] Unit app: `saveFailure` (`tauri-storage.test.ts`), dải lưu (`SaveWarning.test.tsx`), hộp đóng app (`CloseGuard.test.tsx`) ra đúng câu cho `FOLDER_READ_ONLY` (không có "chương trình khác", không có "chỉ đọc"); hằng khớp Rust (`tauri-contract.test.ts`).
- [x] E2e: ca mới ở `e2e/dialog-keyboard.spec.ts`. Mỗi lần bấm đóng, app lưu lại trước; lần lưu đó lỗi với mã đặt cho từng lượt (`DISK_FULL`, `READ_ONLY`, `FOLDER_READ_ONLY`, câu của Windows). Hộp đóng app rồi dải lưu đều ra câu của đúng nguyên nhân; Escape giữ cửa sổ mở.
- [x] Exe release build từ nhánh này (sau đó chỉ đổi một doc comment TS), Office Laptop (`D13_ThinkPad`), thư mục thử riêng ngoài repo. ACL: `icacls Project2C-data /deny *S-1-1-0:(WD)` (không `(OI)(CI)`, chỉ thư mục), gỡ bằng `/remove:d`. Đọc màn hình qua cổng debug WebView2; bấm đóng cửa sổ bằng WM_CLOSE (`CloseMainWindow`).

| Ca | Kết quả |
|---|---|
| **Lúc mở:** thư mục cấm `(WD)`, `project2c.lock` có sẵn từ lần mở trước | Trang lỗi "App không có quyền ghi vào thư mục dữ liệu" + câu `storage.accessDeniedHelp`; hash `project2c.db` không đổi; không có `backups\`; exe thoát 0 |
| Gỡ ACL, mở lại | Mở bình thường, backup lúc mở như cũ |
| **Giữa phiên:** cấm `(WD)` rồi tạo team | Dải "Chưa lưu được dữ liệu vào file: thư mục Project2C-data không cho tài khoản Windows đang dùng tạo file mới trong đó…"; hash không đổi, không sót `.tmp` |
| Bấm đóng | Hộp "Chưa lưu được thay đổi" với câu thư mục (`close.unsavedBodyFolderReadOnly`). Thử lại khi còn cấm → hộp hiện lại, app vẫn chạy, file không đổi |
| Gỡ ACL → Thử lại | App lưu rồi thoát 0; file đã đổi; mở lại có "4 team" và team vừa tạo |

- [x] Mỗi đột biến có test đỏ. Áp tạm từng cái bằng script, chạy test, rồi trả file nguyên byte (kiểm hash):
  - M1 bỏ bước kiểm thư mục ở `open` → `open_reports_a_data_folder_that_lets_no_new_file_in_as_access_denied` đỏ.
  - M2 bỏ nhánh thư mục ở `refused` → `a_save_the_data_folder_refuses_is_reported_as_folder_read_only` đỏ (lỗi trần "Access is denied").
  - M3 bỏ `FILE_FLAG_BACKUP_SEMANTICS` → thư mục không mở được nên lần mở nào cũng `ACCESS_DENIED`, 12 test `open` / `save` đỏ.
  - M4 mọi `PermissionDenied` của lần lưu thành `FOLDER_READ_ONLY` → `a_save_a_program_holding_the_file_refuses_…` và hai test `…_read_only` đỏ.
  - T1 `saveFailure` không nhận `FOLDER_READ_ONLY` → 3 test đỏ (`saveFailure`, dải, hộp).
  - T2 `CloseGuard.tsx:62` truyền `error={void error}` vào `CloseDialog` (ca của L219) → ca e2e mới đỏ.
  - T3 `SaveWarning` truyền `error={void error}` → ca e2e mới đỏ. (`void error` thay vì `undefined` để biến vẫn được dùng; với `undefined`, bản build web lỗi TypeScript trước khi test kịp chạy.)
  - T4 hằng TS lệch Rust → test hợp đồng đỏ.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `fbc5057`), 18 mục "Trùng file":

- L13 `storage.rs` (`open_lock_file` dùng `Some(32)`; closure `map_err` thành identity ngoài Windows): để lại, ngoài phạm vi. Issue không gộp mục này, và nó không liên quan ca thư mục.
- L24 `CloseGuard.tsx` (#125, bấm X lúc đang seed "Nạp lại"; không có dấu "đang lưu"): để lại, ngoài phạm vi.
- L25 Cài đặt (#96, #87; sau một lần lưu lỗi "Nạp lại" bị từ chối): để lại; Owner 21/10 Q5 (a) giữ mục OPEN.
- L49 `vi.ts` (khuôn câu "AI đề xuất" của `KycExtraction.tsx:96`): để lại, ngoài phạm vi (`KycExtraction.tsx` ngoài danh sách file).
- L57 `tauri-storage.ts` (`newPage` ≈ `newSessionId` của `packages/ai`): để lại, chỉ ghi lại (mục hẹn làm khi có nơi thứ ba).
- L80 `vi.ts` (`trash.customer.with`, slot `{count}`): để lại, ngoài phạm vi (`i18n/index.ts` ngoài danh sách file).
- L100 `storage.rs` (`remove_interrupted_backups` lặp vòng; `saveError` ở `AppData`; `ACCESS_DENIED` gom mọi `PermissionDenied`): để lại. Phần lặp vòng cùng họ DR6-67 (hoãn sau v1.0); đưa lỗi cuối vào `PersistQueue` cần sửa `persist-queue.ts`, ngoài danh sách file.
- L139 `tauri-contract.test.ts:294` (regex semver): để lại, ngoài phạm vi (mục hẹn nới khi có bản pre-release).
- L145 `e2e/support.ts` (khối tìm KH seed qua "Hiện thêm" lặp ở hai spec): để lại, chỉ ghi lại (mục hẹn làm khi có nơi thứ ba; hai spec ngoài danh sách file).
- L146 `e2e/support.ts:26` (`canvas` thật ra là context 2D): **đã sửa**, đổi tên thành `context`.
- L210 `e2e/support.ts` (`scrolls`, `sideways`, `right` lặp ở hai spec): để lại, chỉ ghi lại (như L145).
- L213 `vi.ts` (`policies.editLabel` thiếu trạng thái, DR6-119): để lại, ngoài phạm vi (`CustomerPolicies.tsx` ngoài danh sách file).
- L218 `storage.rs:228` (thư mục không cho tạo file vẫn ra "chương trình khác"): **đã sửa**, chính Issue này.
- L219 `CloseGuard.tsx:28`, `:67` (chưa test nào kiểm `CloseGuard` truyền `saveError()` vào `CloseDialog`): **đã sửa**. Có ca e2e mới; đột biến `:67` thành `error={void error}` làm ca đó đỏ (xem dưới).
- L220 `10-su-co.md:15` (cột "Làm gì" chỉ nói quyền ghi): **đã sửa**, nay là "kiểm quyền ghi và xóa của tài khoản đang dùng"; cột "Nghĩa" thêm "tạo" cho ca thư mục.
- L221 *Repeated Switches* (`SAVE_FAILED` / `UNSAVED_BODY`): **đã sửa**, gộp thành một bảng `{ banner, close }` có `satisfies Record<SaveFailure, …>`.
- L232 `vi.ts` (`outcome.caseSizeRead` lặp phần trong ngoặc): để lại, ngoài phạm vi (`MetFields.tsx` ngoài danh sách file).
- L252 `storage.rs` (DR6-67, mã lặp): để lại, hoãn sau v1.0.

Việc chuyển L146, L218–L221 sang RESOLVED làm ở PR sổ sau review.

##### Ngoài phạm vi (gợi ý cho sổ)

`docs/testing/nghiem-thu-v1.md` (ngoài danh sách file) chưa có ca nghiệm thu cho thư mục cấm tạo file (lúc mở, giữa phiên). Cũng chưa có ca cho file chỉ đọc giữa phiên của #750: NT-DB-18 / NT-DB-20 chỉ phủ lúc mở. Gợi ý thêm ở PR docs G7, theo các bước của bảng exe trên.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] `pnpm verify:rust` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (không thêm crate; ACL trong test dựng bằng `icacls`)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` (nhãn `build-exe`: sửa `src-tauri`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-281 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #750, #682 — T-281 (#752, PR #764, `REVIEW: PASS` @`2cb959b`):
  - #750, `apps/desktop/src-tauri/src/storage.rs:228` (thư mục `Project2C-data` cấm tạo file mới vẫn ra "chương trình khác"): `add_refused` mở thư mục chỉ với quyền `FILE_ADD_FILE` (kèm `FILE_FLAG_BACKUP_SEMANTICS`), không tạo file nào. Lúc mở, thư mục bị từ chối → `ACCESS_DENIED` (trang lỗi khởi động, cả ở lần mở đầu); lúc lưu, `refused` hỏi thư mục trước rồi tới file → mã mới `FOLDER_READ_ONLY` với câu riêng ở dải lưu và hộp đóng app. Test `open_reports_a_data_folder_that_lets_no_new_file_in_as_access_denied`, `a_save_the_data_folder_refuses_is_reported_as_folder_read_only`; bảng exe ở thân PR. Review đo `add_refused` khớp lần lưu thật ở 14 kiểu thư mục, kể cả thuộc tính chỉ đọc. Ca lần mở đầu chưa có test: mục review #764 ở OPEN.
  - #750, `apps/desktop/src/shell/CloseGuard.tsx:28`, `:67` (chưa test nào kiểm `CloseGuard` truyền `saveError()` vào `CloseDialog`): `failSaves` của `e2e/support.ts` nay mang chuỗi Rust gửi (`'DISK_FULL'`, `'READ_ONLY'`, `'FOLDER_READ_ONLY'`; `true` là câu của Windows). Ca mới `e2e/dialog-keyboard.spec.ts:190` kiểm hộp đóng app rồi dải lưu ra đúng câu theo từng nguyên nhân; đột biến `error={void error}` ở `CloseGuard` hay `SaveWarning` làm ca này đỏ.
  - #750, `docs/user-guide/10-su-co.md:15`: cột "Làm gì" nay "kiểm quyền ghi và xóa của tài khoản đang dùng", khớp `storage.accessDeniedHelp`; cột "Nghĩa" thêm "tạo" cho ca thư mục.
  - #750, *Repeated Switches* (`SAVE_FAILED` / `UNSAVED_BODY`): một bảng `SAVE_FAILED` `{ banner, close }` ở `apps/desktop/src/shell/SaveWarning.tsx`, `as const satisfies Record<SaveFailure, …>`; `apps/desktop/src/shell/CloseGuard.tsx` dùng chung, bỏ `UNSAVED_BODY`.
  - #682, *Mysterious Name* `canvas` (`e2e/support.ts:26`): đổi thành `context`.

---

# Issue #756 — T-282: Tài liệu: dọn ghi chú không chặn của review PR #755 (câu help 0,500 tr, hộp 5f cũ, từ điển Thùng rác)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Dọn các ghi chú không chặn của review PR #755 (T-278, Issue #729) bằng một PR docs nhỏ. Chỉ sửa tài liệu và chữ trong hai mockup; không đổi luật, không đổi code, không đổi bố cục mockup.

1. **Câu help 6d nói rộng hơn code một ca.** Câu help dưới ô Case size dự kiến của mockup 6d và dòng NT-LH-25 nói dấu `.` hay `,` theo sau đúng 3 chữ số là dấu ngăn nghìn. Khi số đứng trước dấu là `0` thì dấu luôn là thập phân (luật 2 của quyết định Owner 27/09 ở Issue #106): `parseVnd('0,500 tr')` → 500.000 ₫, không phải 500.000.000 ₫. Thêm vế này vào cả hai chỗ, giữ các ví dụ `1,234 tr` và `1,2 tr`.
   - Câu help mới: `Dấu phẩy hay dấu chấm theo sau đúng 3 chữ số là dấu ngăn nghìn, kể cả khi có đơn vị: "1,234 tr" = 1.234.000.000 ₫ (số đứng trước là 0 thì là dấu thập phân: "0,500 tr" = 500.000 ₫). Muốn 1,2 triệu thì gõ "1,2 tr" → 1.200.000 ₫.`
   - NT-LH-25: thêm vào ngoặc nói về luật dấu: "trừ khi số đứng trước là `0`: `0,500 tr` = 500.000 ₫". Không thêm ô gõ mới.
2. **"Ngoại lệ duy nhất" của spec Phase 3 §2 sót bảng nối.** Sửa người phối hợp của lịch hẹn xóa cứng các dòng cũ của bảng nối `appointment_coordinators` rồi ghi tập mới, không qua Dọn sạch. Bảng này không có bảng con nên không liên quan `ON DELETE CASCADE`. Sửa câu thành "Ngoại lệ duy nhất **với bản ghi nghiệp vụ** là dọn sạch Thùng rác …" và thêm một vế nêu bảng nối.
3. **Hộp 5f cũ còn "không bao giờ xóa".** Hộp 5f của mockup Phase 3 còn ghi, ở dòng Ghi chú KYC, "5 — giữ nguyên, không bao giờ xóa", và câu cuối "Màn "Thùng rác" để khôi phục sẽ làm sau Phase 3". Spec Phase 6 TR-9 và mockup `trash.html` 11f (bản đúng, nay có trong app) đã bỏ cả hai. Sửa hai dòng này của 5f đúng chữ 11f: dòng Ghi chú KYC chỉ ghi số; câu cuối "Dữ liệu vẫn còn: khôi phục ở Cài đặt → Thùng rác."
4. **Ví dụ prompt của bảng thuật ngữ hướng dẫn đã cũ.** Dòng "Prompt" ghi ví dụ `analysis@1`, `discovery@2`; phiên bản hiện tại là `analysis@3`, `discovery@3` (`PROMPT_VERSIONS`). Sửa theo `PROMPT_VERSIONS` lúc làm. Nếu T-277 (#728) lên version sau Issue này thì T-277 sửa lại dòng này cùng dòng chip của hướng dẫn AI (như Issue #729 đã ghi cho dòng chip).
5. **Lệch mockup 6d chưa được ghi.** App không hiện câu help dưới ô Case size (chỉ có nhãn "Case size dự kiến (để trống = chưa ước lượng)" và dòng đọc lại), nên câu help chỉ có ở mockup; NT-LH-25 không kiểm nó. Thêm một dòng vào "Lệch mockup đã biết" của tài liệu nghiệm thu. Nếu Owner muốn app hiện câu help thì mở Issue code riêng và bỏ dòng này.
6. **Từ điển thiếu Thùng rác.** `CONTEXT.md` đã nhắc "dọn sạch Thùng rác" (ở mục Ghi chú KYC) nhưng chưa có mục nào cho Xóa mềm, Thùng rác, Dọn sạch Thùng rác. Thêm một mục "Dữ liệu" ba dòng:
   - **Xóa mềm** (`deleted_at`) — KH, cuộc hẹn, HĐ, nhân sự, team khi xóa chỉ bị ẩn khỏi danh sách và chỉ số, khôi phục được ở Thùng rác (spec Phase 3 D4).
   - **Thùng rác** — Cài đặt → Thùng rác: liệt kê mọi bản ghi xóa mềm để khôi phục; không theo góc nhìn, không tự dọn (spec Phase 6 §4.2).
   - **Dọn sạch Thùng rác** — nút xóa hẳn mọi bản ghi trong Thùng rác (trừ bản ghi còn được dữ liệu khác dùng tới, TR-12); hỏi trước, backup trước, một transaction. Là cách duy nhất xóa hẳn bản ghi nghiệp vụ, kể cả ghi chú KYC, dữ kiện và phân tích AI của KH đã xóa (spec Phase 6 TR-11, phụ lục ADR-0008).

##### Bối cảnh

Sáu mục trên là các mục "không chặn" của review PR #755 (`REVIEW: PASS` @`f41e12b`, mức low, đã merge `4cc2a23`): https://github.com/AlexH-AI/Project-2C/pull/755#issuecomment-6341522496. Owner 22/10/2026: xử lý các mục này bằng một Issue nhỏ mới.

Mockup đã duyệt G3 là hợp đồng giao diện. Mục 1 và 3 đổi chữ trong mockup đã duyệt, theo luật đã có (quyết định G8 27/09 ở Issue #106; spec Phase 6 TR-9 và 11f, Owner duyệt G3 19/10). Owner xem hai chữ này ở PR, như Issue #729.

Cỡ ước lượng: ≈ 15 dòng sửa, 6 file, toàn tài liệu.

##### Tài liệu cần đọc

- Comment REVIEW của PR #755 (link ở Bối cảnh), các mục "Không chặn" của trục Spec và Standards.
- Issue #106 (luật 2: nhóm đầu `0` thì luôn là thập phân); `packages/domain/src/money.ts` `splitNumber`; `packages/domain/src/money.test.ts` (`0,500 tỷ`).
- `docs/design/phase-3-du-lieu.md` §2 (dòng "Khóa ngoại bật…"); `packages/db/src/appointments.ts` `replaceCoordinators`.
- `docs/design/phase-6-hoan-thien.md` §4.2 TR-9, TR-11, TR-12; `docs/design/mockups/trash.html` 11f; `docs/design/mockups/README.md`; `.claude/rules/mockups.md`.
- `docs/design/mockups/customer-forms.html` hộp 5f; `docs/design/mockups/appointment-forms.html` 6d (ô Case size dự kiến).
- `docs/testing/nghiem-thu-v1.md` NT-LH-25, NT-KH-14, mục "Lệch mockup đã biết".
- `docs/user-guide/11-thuat-ngu.md` dòng Prompt; `packages/ai/src/schema.ts` `PROMPT_VERSIONS`; `docs/user-guide/06-ai.md` (dòng chip, đã sửa ở PR #755).
- `CONTEXT.md`; `docs/user-guide/09-cai-dat.md` mục Thùng rác và Dọn sạch Thùng rác; `docs/decisions/0008-kyc-du-kien-co-cau-truc-va-cong-deterministic.md` phụ lục.

##### File / thư mục được phép sửa

- `docs/design/mockups/appointment-forms.html`
- `docs/design/mockups/customer-forms.html`
- `docs/design/phase-3-du-lieu.md`
- `docs/testing/nghiem-thu-v1.md`
- `docs/user-guide/11-thuat-ngu.md`
- `CONTEXT.md`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` (sổ @ `4cc2a23`): không có ghi chú OPEN nào nêu các file này. Sáu mục ở trên chưa được ghi vào sổ, vì Issue này xử lý trực tiếp; PR sổ sau review #755 chỉ chuyển hai mục của PR #755 (L167, L176) sang RESOLVED. Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Chỉ tài liệu và chữ trong hai mockup; không đổi luật, không đổi code, không đổi bố cục mockup.
- Chữ mới khớp code: `parseVnd('0,500 tr')` → 500.000; `PROMPT_VERSIONS` = `analysis@3`, `discovery@3`, `extraction@1`; hộp Xóa KH trong app theo 11f.

##### Test chấp nhận

- [ ] Câu help 6d và NT-LH-25 nêu vế "số đứng trước là 0" với ví dụ `0,500 tr` → 500.000 ₫, khớp `parseVnd`; `1,234 tr` → 1.234.000.000 ₫ và `1,2 tr` → 1.200.000 ₫ vẫn đúng.
- [ ] Spec Phase 3 §2 ghi "Ngoại lệ duy nhất với bản ghi nghiệp vụ" và nêu bảng nối `appointment_coordinators`.
- [ ] Hộp 5f cũ: dòng Ghi chú KYC chỉ ghi số, câu cuối như 11f. `grep` "không bao giờ xóa" trong các mockup `*.html`: không còn câu nào nói ghi chú KYC không bao giờ xóa.
- [ ] Ví dụ ở dòng Prompt của bảng thuật ngữ khớp `PROMPT_VERSIONS` lúc làm.
- [ ] "Lệch mockup đã biết" có dòng hộp 6d.
- [ ] Từ điển có ba mục Xóa mềm, Thùng rác, Dọn sạch Thùng rác, khớp spec Phase 6 §4.2 và phụ lục ADR-0008.
- [ ] PR chỉ sửa các file trong danh sách; thân PR trả lời từng mục "Trùng file" của `notes-for --diff` (nếu có).

Chỉ sửa `docs/**` và `CONTEXT.md` → không chạy CI.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (PR docs-only: không chạy CI)
- [ ] Review phiên sạch: PASS
- [ ] Owner xem hai chữ đổi trong mockup (câu help 6d, hộp 5f) ở PR

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #758 — docs: clear the six non-blocking notes of the PR 755 review (T-282)

Trạng thái: MERGED · merge 2026-10-22T15:36:19Z · commit `da0d3c87ab2ed478fe6d88b17830604f9f3b9a00` · nhánh `task/T-282-docs-review-755-notes` · nhãn: type:task, risk:low

Closes #756

#### Thay đổi

T-282: sáu mục "không chặn" của review PR #755 (T-278, đã merge `4cc2a23`): [comment REVIEW](https://github.com/AlexH-AI/Project-2C/pull/755#issuecomment-6341522496). Chỉ sửa tài liệu và chữ trong hai mockup: 6 file, +14 / −7 dòng, không đổi luật, không đổi code, không đổi bố cục mockup.

##### Anh xem hai chữ trong mockup đã duyệt G3

Hai mockup này là hợp đồng giao diện đã duyệt; hai chỗ dưới chỉ đổi chữ theo luật đã có, giữ nguyên thẻ, `class` và bố cục. **Anh xem hai chỗ này ở PR.**

**A. Mockup 6d** (`appointment-forms.html:244`), câu help dưới ô Case size dự kiến. Theo quyết định Owner 27/09/2026 (G8, Issue #106, luật 2: số đứng trước dấu là `0` thì dấu luôn là thập phân):

- Trước: `Dấu phẩy hay dấu chấm theo sau đúng 3 chữ số là dấu ngăn nghìn, kể cả khi có đơn vị: "1,234 tr" = 1.234.000.000 ₫. Muốn 1,2 triệu thì gõ "1,2 tr" → 1.200.000 ₫.`
- Sau: `Dấu phẩy hay dấu chấm theo sau đúng 3 chữ số là dấu ngăn nghìn, kể cả khi có đơn vị: "1,234 tr" = 1.234.000.000 ₫ (số đứng trước là 0 thì là dấu thập phân: "0,500 tr" = 500.000 ₫). Muốn 1,2 triệu thì gõ "1,2 tr" → 1.200.000 ₫.`

**B. Mockup 5f** (`customer-forms.html:267` và `:269`), hộp Xóa KH cũ. Theo spec Phase 6 TR-9 và hộp 11f của `trash.html` (bản đúng, nay có trong app, Owner duyệt G3 19/10/2026); chữ mới đúng chữ 11f:

| Chỗ | Trước | Sau |
|---|---|---|
| Dòng Ghi chú KYC | `5 — giữ nguyên, không bao giờ xóa` | `5` |
| Dải thông tin cuối hộp | `Dữ liệu vẫn còn và khôi phục được. Màn "Thùng rác" để khôi phục sẽ làm sau Phase 3.` | `Dữ liệu vẫn còn: khôi phục ở Cài đặt → Thùng rác.` |

Không chép `class="num"` của 11f vì các dòng khác của 5f không có.

##### 1. Câu help 6d và NT-LH-25 (mục tiêu 1)

Đọc bằng `parseVnd` / `formatVnd` / `formatVndCompact` của `packages/domain/src/money.ts` (script đo ở phiên này, không commit; `splitNumber`: một dấu duy nhất đứng sau nhóm đầu `0` là dấu thập phân, `money.test.ts` có ca `0,500 tỷ`):

| Gõ | App đọc |
|---|---|
| `0,500 tr` (và `0.500 tr`) | 500.000 ₫ |
| `1,234 tr` | 1.234.000.000 ₫ (1,23 tỷ) |
| `1,2 tr` | 1.200.000 ₫ (1,2 tr) |

- **NT-LH-25** (`nghiem-thu-v1.md:135`): vế luật trong ngoặc thành "dấu `.` hay `,` theo sau đúng 3 chữ số là dấu ngăn nghìn, kể cả khi có đơn vị, trừ khi số đứng trước là `0`: `0,500 tr` = 500.000 ₫; quyết định Owner 27/09/2026, #106". Không thêm ô gõ mới; các ca `1,234 tr`, `1,2 tr` giữ.
- Nhãn nhỏ "dấu . là ngăn nghìn" (dòng 241 của mockup) giữ nguyên: nó mô tả ô mẫu `1.234 tr` ngay dưới và vẫn đúng.

##### 2. Spec Phase 3 §2 (mục tiêu 2)

`phase-3-du-lieu.md:41`: "Ngoại lệ duy nhất **với bản ghi nghiệp vụ** là dọn sạch Thùng rác …" (chữ thường trong file), rồi thêm vế: bảng nối `appointment_coordinators` (§3.6) không có `deleted_at`; sửa người phối hợp của lịch hẹn xóa cứng các dòng cũ của lịch đó rồi ghi tập mới (`replaceCoordinators`, `packages/db/src/appointments.ts:385`), không qua dọn sạch; bảng không có bảng con nên không liên quan `ON DELETE CASCADE`.

Kiểm: trong `packages/db/src` (bỏ test, migration, seed) chỉ có hai nơi xóa cứng: `replaceCoordinators` và `purge.ts`. `schema.ts` cho `appointment_coordinators` chỉ có `appointment_id`, `person_id`.

##### 3. Hộp 5f cũ (mục tiêu 3)

Hai dòng ở mục B trên. `grep -n "không bao giờ xóa" docs/design/mockups/*.html` và `grep -n "sau Phase 3"` cùng đường dẫn: không còn kết quả (trước PR: `customer-forms.html:267` và `:269`). NT-KH-14, NT-KH-15 đã theo 11f nên không đổi.

##### 4. Ví dụ prompt của bảng thuật ngữ (mục tiêu 4)

`11-thuat-ngu.md:93`: `analysis@1`, `discovery@2` → `analysis@3`, `discovery@3`. `PROMPT_VERSIONS` (`packages/ai/src/schema.ts:309`) lúc làm, trên `origin/main` `be0408b`: `analysis@3`, `discovery@3`, `extraction@1`. Nếu T-277 (#728) lên version sau PR này thì sửa lại dòng này cùng dòng chip ở `06-ai.md:49`.

##### 5. Lệch mockup 6d (mục tiêu 5)

`nghiem-thu-v1.md` mục "Lệch mockup đã biết", danh sách đầu (cạnh "Hộp 6a / 6h", chưa phải mục "Owner chọn không sửa"): app không hiện câu help dưới ô Case size (chỉ có nhãn "Case size dự kiến (để trống = chưa ước lượng)" và dòng đọc lại, `MetFields.tsx`), nên câu help chỉ có ở mockup và NT-LH-25 không kiểm nó. **Nếu anh muốn app hiện câu help này thì mở Issue code riêng và bỏ dòng này.**

##### 6. Từ điển (mục tiêu 6)

`CONTEXT.md`: mục "Dữ liệu" mới (cuối file) với ba dòng **Xóa mềm**, **Thùng rác**, **Dọn sạch Thùng rác**, chữ theo Issue #756, đối chiếu spec Phase 3 D4, spec Phase 6 §4.2 (TR-6, TR-7, TR-11, TR-12) và phụ lục ADR-0008. Một chỗ khác chữ trong Issue: "backup trước **(bản exe)**", vì TR-11 ghi bản web không có file nên không backup.

#### Test chấp nhận

- [x] Câu help 6d và NT-LH-25 nêu vế "số đứng trước là 0" với `0,500 tr` → 500.000 ₫, khớp `parseVnd` (bảng ở mục 1); `1,234 tr` → 1.234.000.000 ₫ và `1,2 tr` → 1.200.000 ₫ vẫn đúng.
- [x] Spec Phase 3 §2 ghi "Ngoại lệ duy nhất với bản ghi nghiệp vụ" và nêu bảng nối `appointment_coordinators`.
- [x] Hộp 5f: dòng Ghi chú KYC chỉ ghi số, câu cuối như 11f; `grep` "không bao giờ xóa" trong `docs/design/mockups/*.html`: không còn kết quả.
- [x] Ví dụ ở dòng Prompt khớp `PROMPT_VERSIONS` (`analysis@3`, `discovery@3`).
- [x] "Lệch mockup đã biết" có dòng hộp 6d.
- [x] Từ điển có ba mục Xóa mềm, Thùng rác, Dọn sạch Thùng rác.
- [x] PR chỉ sửa 6 file trong danh sách; mục "Trùng file" của `notes-for --diff`: không có.

Chỉ sửa `docs/**` và `CONTEXT.md` → không chạy CI.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `4cc2a23`): không có ghi chú OPEN nào nêu các file này. Không có mục "Trùng file".

#### Để anh biết

- Với số dưới 1 triệu, dòng đọc lại của ô Case size trong app là "500.000 ₫ (500.000 ₫)" (`0,500 tr`), vì `formatVndCompact` dưới 1 triệu trả dạng đầy đủ và `MetFields.tsx` ghép `{amount} ({compact})` không bỏ phần lặp; `kyc-view.ts` (ghi chú KYC) có `compact === amount ? amount : …`. Vì thế NT-LH-25 không thêm dòng đọc cho `0,500 tr`. Không thuộc Issue này; không sửa.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (head `8e0fb87`, sau khi rebase lên #757)
- [x] Không thêm dependency ngoài ADR-0005 (không đổi dependency)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-282 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #772 — T-283: e2e và tools: helper dùng chung, đồng hồ / múi giờ, luật import, pr-status; ghi quyết định 23/10

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Gom các mục OPEN về e2e, công cụ và tài liệu quy trình; ghi quyết định Owner 23/10.

1. **Helper e2e dùng chung** thay các chỗ chép:
   - `pasteAsIs(locator, text)` cho khối "đặt value như dán" (3 chỗ);
   - `scrolls` / `sideways` / `right` (2 chỗ);
   - bước tìm KH seed qua "Hiện thêm" (2 chỗ).
2. **Đồng hồ e2e:**
   - `toNewYearsEve` nhảy theo `Date.now()` của trang, không coi đồng hồ trang còn ở 09:30;
   - `ANCHOR_MORNING` không phụ thuộc múi giờ của tiến trình Node khi config đặt `timezoneId`: cài giờ theo múi của trình duyệt, hoặc đặt `TZ` cùng múi;
   - ca "the data seeded beforehand…" không còn phụ thuộc nửa đêm: chỉ đặt `machineClock` cho ca cần, hoặc ghi giới hạn đúng trong comment.
3. **Luật lint** `no-restricted-imports` cho spec e2e: không lấy `test` từ `@playwright/test` (mọi dạng import). Ca quét regex hiện có thì bỏ hoặc giữ kèm lý do.
4. **e2e hộp 5f** kiểm số lần tính RF và số ghi chú KYC chính xác (đọc từ hồ sơ), không chỉ `\d+`.
5. **Kiểm link của hướng dẫn** bỏ được code span mở bằng nhiều dấu backtick.
6. **Bảng số đo perf** chỉ tính `percent` khi nền khác 0.
7. **Công cụ:**
   - `pr-status` đọc cả `previous_filename` (file của từng commit `main` và file của PR; so `changedFiles` theo mục);
   - dòng `tested` chỉ in ", only n read" đúng điều kiện của `mergeBlockers`;
   - test danh sách tài liệu mà test đọc nhận cả đường dẫn `docs/….md` viết thẳng hoặc qua `join`.
8. **Luật test:** phần I/O của `tools/` không bắt buộc unit test; khi cần thì giả `run` như test của `pr-status`.
9. **Tài liệu quy trình:**
   - NIT §L3.10 của kế hoạch deep review Phase 1–6;
   - dòng lỗi thời ở mục Hệ quả của ADR-0017.
10. **Ghi quyết định Owner 23/10:**
    - `PROJECT-STATE.md`: sửa hết sổ OPEN trước v1.0; kế hoạch T-283…T-301 (Owner duyệt 17 Issue; tách thêm T-284 cho cổng G3 và tách đôi phần lưu file vì cỡ); phạm vi:
      - 10 mục ACCEPTED có cải thiện thật đưa lại vào đợt sửa;
      - ba lệch mockup (chỉ báo lưu 10d, câu help Case size 6d, bộ lọc dòng thời gian) đưa vào đợt sửa;
      - giữ các mục "Owner chọn không sửa" ngày 15/10;
      - mục chờ lượt L1 ghi là lệch chấp nhận;
    - `PROJECT-STATE.md`, các cổng đã duyệt:
      - G2 / G5: bảy luật của T-291 và luật trích JSON của T-290;
      - G4: một lần gọi OpenCode thật; không thêm thư viện test component;
      - G6: quyền đổi tiêu đề cửa sổ;
      - G3: gom vào T-284 (mockup / token cho bốn chỗ đổi hình thức), Owner duyệt PR của T-284;
    - tài liệu nghiệm thu, mục "Owner xác nhận ở lượt L1": Owner 23/10 chọn ghi là lệch chấp nhận (chuyển vào danh sách lệch đã biết).

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771). Owner duyệt kế hoạch và mọi đề xuất phạm vi / cổng (phiên Home PC 23/10). Kế hoạch thành T-283…T-301: thêm T-284 gom cổng G3, tách đôi phần lưu file (T-294, T-295) vì cỡ. Rà sổ G7: #769, #770.

Issue này gom mọi mục OPEN của sổ ghi chú review gắn **[T-283]**. Vị trí, ví dụ và hướng sửa chi tiết của từng mục nằm ở chính sổ. Issue đầu của đợt: helper e2e có sẵn để các Issue sau dùng.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-283]
- `.claude/rules/tests.md`, `.claude/rules/ci.md`
- `e2e/fixtures.ts`, `e2e/anchor.ts`, `e2e/support.ts`, `e2e/fixtures.spec.ts`, `e2e/seeded-snapshot.spec.ts`, `e2e/customer-forms.spec.ts` (ca 5f), `e2e/customer-kyc.spec.ts`, `e2e/customer-ai.spec.ts`, `e2e/customer-ai-web.spec.ts`, `playwright.config.ts`, `eslint.config.js`
- `e2e/guide/links.ts`, `e2e/perf/stats.ts`, `e2e/perf/stats.spec.ts`
- `tools/pr-status.mjs`, `tools/pr-status.test.mjs`, `tools/pr-core.mjs` (`CODE_DOCS`), `tools/pr-core.test.mjs`, `tools/notes-for.mjs` (cách đọc `previous_filename`)
- `docs/process/deep-review-phase-1-6.md` §L3.10; `docs/decisions/0017-review-theo-muc-risk.md` (Hệ quả, phụ lục 27/09)
- `docs/PROJECT-STATE.md` (cách viết một dòng quyết định); `docs/testing/nghiem-thu-v1.md` mục "Lệch mockup đã biết"

##### File / thư mục được phép sửa

- `e2e/{fixtures.ts,anchor.ts,support.ts,fixtures.spec.ts,seeded-snapshot.spec.ts,customer-forms.spec.ts,customer-kyc.spec.ts,customer-ai.spec.ts,customer-ai-web.spec.ts,appointment-outcome.spec.ts,customer-policies.spec.ts}`
- `e2e/guide/links.ts`, `e2e/perf/{stats.ts,stats.spec.ts}`
- `playwright.config.ts`, `eslint.config.js`
- `tools/{pr-status.mjs,pr-status.test.mjs,pr-core.test.mjs}`
- `.claude/rules/tests.md`
- `docs/process/deep-review-phase-1-6.md`, `docs/decisions/0017-review-theo-muc-risk.md`, `docs/PROJECT-STATE.md`, `docs/testing/nghiem-thu-v1.md` (chỉ mục lượt L1)

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-283]**: gộp (chính là Issue này). Mục khác mà `notes-for` báo trùng file thì để lại cho Issue ghi ở nhãn của mục (đợt T-283…T-301), hoặc cho G7 (nhãn **[G7]**). Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Helper e2e mới đặt ở `fixtures.ts` / `support.ts`, có JSDoc; các spec cũ chuyển sang dùng, hành vi test không đổi.
- `pr-status` / `merge-pr` vẫn chặn đúng như cũ; chỉ thêm đường đổi tên file.

##### Test chấp nhận

- [ ] e2e xanh; các chỗ chép nêu ở mục 1 dùng helper chung.
- [ ] `toNewYearsEve` dừng ở 23:58 theo đồng hồ trang cả khi test đã chạy lâu (ca thử: đồng hồ trang chạy trước vài phút).
- [ ] Spec lấy `test` từ `@playwright/test` (import có tên, `import * as`, export lại) bị lint báo.
- [ ] e2e 5f đỏ khi hộp ghép nhầm số RF và số KYC (đột biến ghi trong PR).
- [ ] Link nằm trong code span hai backtick không bị kiểm.
- [ ] Unit `pr-status`: commit đổi tên file code thành `docs/….md` không bị coi là docs-only; dòng `tested` không in ", only N+1 read" khi đã đọc đủ.
- [ ] Unit: test đọc docs qua `join(root, 'docs/x.md')` được nhận.
- [ ] `PROJECT-STATE.md` có dòng 2026-10-23; tài liệu nghiệm thu ghi lựa chọn của lượt L1.

Ước lượng: ≈ 40 dòng SP (tools) + ≈ 250 dòng e2e / test + ≈ 30 dòng tài liệu.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (Verify + e2e)
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-283] đã sửa sang RESOLVED

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #792 — test: share e2e helpers, follow the page clock, read renamed files in pr-status (T-283)

Trạng thái: MERGED · merge 2026-10-23T14:44:23Z · commit `f4696393b4574186d4df147035a25e28d2a6bef8` · nhánh `task/T-283-e2e-tools` · nhãn: type:task, risk:low

Closes #772

#### Thay đổi

1. **Helper e2e dùng chung** (mục 1):
   - `pasteAsIs(field, text)` ở `e2e/fixtures.ts` thay 3 khối "đặt value như dán" (`customer-kyc.spec.ts` ×2, `customer-forms.spec.ts`); prototype chọn theo `tagName`. Chuỗi truyền vào `evaluate` như tham số vẫn giữ nguyên nửa surrogate lẻ: ba ca dán hỏng vẫn thấy câu từ chối của `isStorableText` (U+FFFD thì app nhận).
   - `right` / `scrolls` / `sideways` và `seededCustomer(page, name)` (tìm KH seed qua "Hiện thêm") ở `e2e/support.ts`, dùng ở `customer-kyc.spec.ts`, `customer-ai.spec.ts`, `customer-ai-web.spec.ts`. Biến `right` trong `past` (`customer-kyc.spec.ts`) đổi tên `edge` để không che helper.
2. **Đồng hồ e2e** (mục 2):
   - `toNewYearsEve` tính khoảng nhảy trong trang (`new Date(2026, 11, 31, 23, 58)` trừ `Date.now()` của trang), nên dừng ở 23:58 theo đồng hồ trang dù test đã chạy bao lâu, ở múi giờ nào.
   - `anchorMorning(timeZone)` ở `e2e/anchor.ts`: 09:30 ngày neo theo đồng hồ của múi trình duyệt (`use.timezoneId`, đọc bằng `Intl`); fixture `context` cài đồng hồ trang bằng nó. Không có `timezoneId` thì vẫn là `ANCHOR_MORNING` (giờ máy), nên `playwright.config.ts` không đổi.
   - `seeded-snapshot.spec.ts`: `machineClock` chỉ cho ca đầu (`test.describe` + `test.use`). Ca "the data seeded beforehand…" mở hai trang trong context của fixture (đồng hồ trang; dữ liệu bản web nằm trong bộ nhớ từng trang), nên cả hai hỏi file của ngày neo dù nửa đêm của máy tới giữa chừng: app lấy file theo tên ngày (`demoSnapshotName`), nên trước đây cả trang mở file cũng chịu cửa sổ nửa đêm. `seedDuration(seeded) > 0` (cần giờ máy) thay bằng kiểm trang đó nhận 404 cho `demo-2026-09-15.sqlite`: vừa chắc trang tự seed, vừa chắc nó hỏi đúng ngày neo.
3. **Luật lint** (mục 3): `no-restricted-imports` ở `eslint.config.js` cấm `test` và `default` (export mặc định của `@playwright/test` cũng là `test`) của `@playwright/test` ở mọi `e2e/**/*.ts`, trừ `e2e/fixtures.ts` và hai bộ chạy bằng config riêng (`*.guide.ts`, `*.perf.ts`). Luật phủ cả helper, nên `test` của Playwright không qua được một helper export lại. Ca quét regex của `fixtures.spec.ts` bỏ (`pnpm lint` bắt mọi dạng); thay bằng ca chạy ESLint trên các dạng: có tên, alias, `import * as`, mặc định, export lại trong spec và trong helper, cùng ba ca được phép (`expect` của Playwright, `test` của `fixtures.ts`, chính `fixtures.ts`).
4. **5f** (mục 4): ca 5f đọc số RF ("sau cuộc gặp · tính 1 RF") và số ghi chú KYC ("Ghi chú KYC" + "Ghi chú hệ thống") từ dòng thời gian của hồ sơ, rồi kiểm đúng số trong hộp; ghim hai số khác nhau để hộp ghép nhầm thì đỏ.
5. **Link của hướng dẫn** (mục 5): `CODE_SPAN` bỏ code span mở bằng một hay nhiều backtick, đóng bằng đúng số backtick đó (CommonMark); dãy backtick không có dãy đóng cùng độ dài là chữ thường.
6. **Bảng perf** (mục 6): hàm `ratio()` chỉ tính phần trăm khi nền khác 0.
7. **Công cụ** (mục 7):
   - `pr-status` đọc `previous_filename`: file của từng commit `main` (cùng jq với `notes-for`) và file của PR (mỗi file một `{ path, previousPath }`). `prFiles` tính cả tên cũ vào docs-only / notes-only / `needsExe`, và so `changedFiles` với số mục (một file đổi tên là một mục); dòng `files` và câu "Read n of the m files" đếm theo mục.
   - Dòng `tested` chỉ in ", only n read" khi `!Number.isInteger(mainTotal) || mainSince.length < mainTotal`, cùng điều kiện với `mergeBlockers`.
   - Test danh sách tài liệu mà test đọc (`pr-core.test.mjs`): hàm `docsRead` nhận thêm đường dẫn `docs/….md` từ gốc repo trong đối số của `join` / `resolve` / `readFile(Sync)`; chuỗi `docs/….md` khác (dữ liệu của test, như file của PR) không tính.
8. **Luật test** (mục 8): `.claude/rules/tests.md`: I/O của `tools/` không bắt buộc unit test; khi cần thì giả `run` như `tools/pr-status.test.mjs`.
9. **Tài liệu quy trình** (mục 9):
   - §L3.10 của kế hoạch deep review: ghi không có `common-workflow-run.md`, thêm `common-prompt-claude.md`.
   - ADR-0017, Hệ quả: gạch dòng lỗi thời, ghi đã kiểm (`high` ở #96; `max` rà inline khi Owner chưa bật subagent, ghi ở comment review #738 và #742). Câu sổ đề xuất ("lần review đầu ở mức `max` ghi rõ…") đã thành sự thật, nên ghi kết quả thay vì việc phải làm.
10. **Quyết định 23/10** (mục 10): dòng 2026-10-23 ở `docs/PROJECT-STATE.md`; `docs/testing/nghiem-thu-v1.md`: đoạn "Owner xác nhận ở lượt L1" thành khối "Owner chọn ghi là lệch chấp nhận" trong "Lệch mockup đã biết".

**File ngoài danh sách của Issue:**

- `tools/pr-core.mjs`: phép so `changedFiles` nằm ở `prFiles`, nên "so `changedFiles` theo mục" (mục 7) phải sửa ở đó; đổi 4 dòng (`prFiles`, câu "Read n of the m files", JSDoc), test ở `pr-core.test.mjs`.
- `e2e/guide/links.spec.ts` (mới): test của `linkTargets` chạy trong `pnpm e2e`, như `e2e/perf/stats.spec.ts` cho `stats.ts`; `check.guide.ts` chỉ chạy bằng config của hướng dẫn.

#### Test chấp nhận

- [x] e2e xanh; các chỗ chép của mục 1 dùng helper chung.
- [x] `toNewYearsEve` dừng ở 23:58 theo đồng hồ trang khi đồng hồ trang đã chạy trước 5 phút (`fixtures.spec.ts`; trước khi sửa: 01/01/2027 00:03).
- [x] Spec lấy `test` từ `@playwright/test` bị lint báo: import có tên, alias, `import * as`, mặc định, export lại (trong spec và trong helper) (`fixtures.spec.ts`; tắt luật thì ca này đỏ: 0 lỗi).
- [x] e2e 5f đỏ khi hộp ghép nhầm: đột biến `CustomerDialogs.tsx` đổi chỗ `counts.rf` / `counts.kycNotes` → ca 5f đỏ: `Expected "Lịch hẹn5 (5 đã gặp · 1 lần tính RF)"`, nhận `"… · 6 lần tính RF)"` (KH Phan Gia Chi: 1 RF, 6 ghi chú KYC). Đã trả file về nguyên bản.
- [x] Link trong code span hai backtick không bị kiểm (`links.spec.ts`; trước khi sửa: `two.md`, `three.md` vẫn bị kiểm).
- [x] Unit `pr-status`: commit `main` đổi tên file code thành `docs/x.md` chặn merge; PR đổi tên `tools/a.mjs` → `docs/x.md` là docs-only "no", đọc đủ 1/1 file; dòng `tested` không in ", only 251 read" khi trang đọc nhiều hơn số GitHub đếm. Unit `pr-core`: file đổi tên từ `src-tauri` cần nhãn `build-exe`; đổi tên trong `docs/` vẫn docs-only; đổi tên thành sổ review vẫn cần REVIEW.
- [x] Unit: test đọc docs qua `join(root, …)`, `resolve(…)`, `readFileSync('docs/….md')` được nhận; chuỗi dữ liệu `docs/….md` không bị nhận.
- [x] `PROJECT-STATE.md` có dòng 2026-10-23; tài liệu nghiệm thu ghi lựa chọn của lượt L1.

Thêm: ca múi giờ (`timezoneId: 'Pacific/Honolulu'`, `fixtures.spec.ts`) trước khi sửa mở trang ở 14/09 16:30.

Không có bước đỏ được: `stats.ts` (đầu ra không đổi, ca #572 ghim); `seeded-snapshot` (khác biệt chỉ thấy khi nửa đêm của máy tới giữa ca).

**Quan sát ngoài phạm vi:** `playwright.guide.config.ts` đặt `timezoneId: 'Asia/Ho_Chi_Minh'`, còn `e2e/guide/shots.guide.ts` dùng `setFixedTime(ANCHOR_MORNING)` (giờ máy) với `test` của Playwright. Hai máy của Owner ở UTC+7 nên ảnh không đổi; máy ở múi khác thì giờ của ảnh lệch. Hai file ngoài danh sách nên để nguyên (có thể dùng `anchorMorning('Asia/Ho_Chi_Minh')` khi chạm lần sau).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`: 18 mục trùng file.

- L75 `tools/pr-core.test.mjs` (R2-21, regex tài liệu mà test đọc): đã sửa (`docsRead`, `FROM_ROOT`).
- L80 `e2e/customer-forms.spec.ts` (5f chỉ kiểm `\d+`): đã sửa (số RF và số KYC đọc từ dòng thời gian).
- L90 `e2e/guide/links.ts` (code span nhiều backtick): đã sửa (`CODE_SPAN`, `links.spec.ts`).
- L120 `e2e/perf/stats.ts` (`percent` khi nền 0): đã sửa (`ratio()`).
- L135 `e2e/customer-ai-web.spec.ts`, `e2e/customer-ai.spec.ts`, `e2e/support.ts` (tìm KH seed qua "Hiện thêm"): đã sửa (`seededCustomer`).
- L141 `.claude/rules/tests.md`, `tools/pr-status.test.mjs` (câu luật I/O): đã sửa.
- L142 `tools/pr-status.mjs` (dòng `tested`, ", only N+1 read"): đã sửa.
- L143 `tools/pr-status.mjs` (`previous_filename`): đã sửa (cùng `prFiles` ở `tools/pr-core.mjs`).
- L160 `docs/process/deep-review-phase-1-6.md` (§L3.10): đã sửa.
- L162 `docs/decisions/0017-review-theo-muc-risk.md` (Hệ quả, dòng lỗi thời): đã sửa.
- L164 `e2e/seeded-snapshot.spec.ts`, `e2e/fixtures.ts` (ca seed sẵn phụ thuộc nửa đêm): đã sửa (hai trang trên đồng hồ trang).
- L165 `e2e/fixtures.ts`, `e2e/anchor.ts` (`ANCHOR_MORNING` theo múi của Node): đã sửa (`anchorMorning(timezoneId)`).
- L166 `e2e/anchor.ts` (`toNewYearsEve` tính từ 09:30): đã sửa.
- L167 `e2e/fixtures.spec.ts`, `eslint.config.js` (quét regex → luật lint): đã sửa.
- L172 `e2e/customer-kyc.spec.ts`, `e2e/customer-forms.spec.ts`, `e2e/fixtures.ts` (khối "đặt value như dán"): đã sửa (`pasteAsIs`).
- L190 `e2e/customer-kyc.spec.ts`, `e2e/customer-ai-web.spec.ts`, `e2e/support.ts` (`scrolls` / `sideways` / `right`): đã sửa.
- L214 `docs/testing/nghiem-thu-v1.md` **[G7]** (ca nghiệm thu thư mục cấm tạo file): để lại, việc của PR docs nghiệm thu ở G7; Issue chỉ cho sửa mục lượt L1 của file này.
- L219 `e2e/customer-ai.spec.ts`, `e2e/customer-ai-web.spec.ts`, `e2e/fixtures.ts` **[T-288 #777]** (version prompt ghim ở ≈ 30 dòng test): để lại cho T-288 (#777), nhãn của mục.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (3 598 test), Home PC (`DESKTOP-KDURKJP`, 24 nhân).
  - Ngưỡng thời gian của test DR5-09 ở `packages/ai/src/web.test.ts` ("many lines", < 50 ms) làm `pnpm verify` phụ thuộc thứ tự Vitest xếp file: ca này chậm khi chạy cùng lúc với file nặng ở worker khác.
  - Số đo: ba lượt liền trên nhánh chỉ đỏ ca này (62–82 ms), `main` xanh 3/3; đặt lại cùng một cache thứ tự của Vitest (`node_modules/.vite/vitest/…/results.json`) thì `main` và nhánh đều xanh.
  - Hướng sửa (đo bằng số dòng được đọc thay vì thời gian) thuộc T-290 (#779) theo nhãn của mục sổ; mục đó đo trên Office Laptop. CI gặp lại thì chạy lại job.
- [x] `pnpm e2e` xanh ở local: 272/272.
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-283 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #524, #541, #547, #644, #682, #689, #718, #731, #736, #738, #746 — T-283 (#772, PR #792, `REVIEW: PASS` @`ae72dfb`):
  - #524 (R2-21), `tools/pr-core.test.mjs` (danh sách tài liệu mà test đọc): `docsRead` nhận thêm đường dẫn `docs/….md` từ gốc repo trong đối số của `join` / `resolve` / `readFile(Sync)` (`FROM_ROOT`); chuỗi `docs/….md` khác là dữ liệu của test, không tính. Giới hạn còn lại (ngoặc lồng, đường dẫn tách đoạn) PR #815 sửa: xem khối T-302.
  - #541, `e2e/customer-forms.spec.ts` (hộp 5f): ca 5f đọc số RF ("sau cuộc gặp · tính 1 RF") và số ghi chú KYC ("Ghi chú KYC" + "Ghi chú hệ thống") từ dòng thời gian của hồ sơ, rồi kiểm đúng hai số trong hộp. Hai số ghim khác nhau, nên đổi chỗ `counts.rf` / `counts.kycNotes` ở `apps/desktop/src/routes/customers/CustomerDialogs.tsx` làm ca đỏ (đột biến của PR).
  - #547, `e2e/guide/links.ts` (`CODE_SPAN`): bỏ code span mở bằng một hay nhiều backtick và đóng bằng đúng số backtick đó (CommonMark); dãy backtick không có dãy đóng cùng độ dài là chữ thường. Test ở `e2e/guide/links.spec.ts`, chạy trong `pnpm e2e`.
  - #644, `e2e/perf/stats.ts` (`markdownTable`): hàm `ratio()` chỉ tính phần trăm khi nền khác 0.
  - #682, mùi *Duplicated Code* (tìm KH seed qua "Hiện thêm"): `seededCustomer(page, name)` ở `e2e/support.ts`, dùng ở `e2e/customer-ai.spec.ts`, `e2e/customer-ai-web.spec.ts`.
  - #689, `.claude/rules/tests.md`: I/O của `tools/` không bắt buộc unit test; khi cần thì giả `run` của `tools/session-io.mjs` bằng `vi.mock`, như `tools/pr-status.test.mjs`.
  - #689, NIT `tools/pr-status.mjs` (`formatStatus`, dòng `tested`): chỉ in ", only n read" khi `!Number.isInteger(mainTotal) || mainSince.length < mainTotal`, cùng điều kiện với `mergeBlockers`.
  - #689, `tools/pr-status.mjs` (`previous_filename`): file của từng commit `main` đọc cùng jq với `tools/notes-for.mjs`; file của PR là `{ path, previousPath }`. `prFiles` (`tools/pr-core.mjs`) tính cả tên cũ vào docs-only / notes-only / nhãn `build-exe`, và so `changedFiles` theo mục.
  - #718, NIT `docs/process/deep-review-phase-1-6.md` (§L3.10): ghi "*sửa 20/10, §L3.1:* không có `common-workflow-run.md` …; thêm `common-prompt-claude.md`, bản đã dùng".
  - #731, `docs/decisions/0017-review-theo-muc-risk.md` (Hệ quả): dòng lỗi thời gạch đi, kèm kết quả đã kiểm: `high` ở PR #96; `max` rà inline khi Owner chưa bật subagent (comment review PR #738, #742).
  - #736, `e2e/seeded-snapshot.spec.ts` (ca "the data seeded beforehand…"): `machineClock` chỉ cho ca đầu (`test.describe` + `test.use`). Ca seed sẵn mở hai trang trong context của fixture (đồng hồ trang), nên cả hai hỏi file của ngày neo; ca kiểm trang seed nhận 404 cho `demo-2026-09-15.sqlite` thay cho `seedDuration`.
  - #736, `e2e/anchor.ts` (`ANCHOR_MORNING` theo múi của Node): `anchorMorning(timeZone)` cho 09:30 ngày neo theo múi của trình duyệt (`use.timezoneId`, đọc bằng `Intl`); fixture `context` của `e2e/fixtures.ts` cài đồng hồ bằng nó; ca `timezoneId: 'Pacific/Honolulu'` ở `e2e/fixtures.spec.ts`. Config hướng dẫn vẫn dùng giờ máy: xem mục review #792 ở OPEN.
  - #736, `e2e/anchor.ts` (`toNewYearsEve`): khoảng nhảy tính trong trang, từ `Date.now()` của trang; ca ở `e2e/fixtures.spec.ts` (đồng hồ trang đã chạy trước 5 phút) dừng đúng 23:58.
  - #736, `e2e/fixtures.spec.ts` (quét regex): luật `no-restricted-imports` ở `eslint.config.js` cấm `test` và `default` của `@playwright/test` ở mọi `e2e/**/*.ts`, trừ `e2e/fixtures.ts`, `*.guide.ts`, `*.perf.ts`. Ca regex bỏ, thay bằng ca chạy ESLint trên các dạng import. Import động PR #815 sửa: xem khối T-302.
  - #738, mùi *Duplicated Code* (khối "đặt value như dán"): `pasteAsIs(field, text)` ở `e2e/fixtures.ts`, dùng ở `e2e/customer-kyc.spec.ts` (hai chỗ) và `e2e/customer-forms.spec.ts`.
  - #746, *Duplicated Code* (e2e): `right`, `scrolls`, `sideways` ở `e2e/support.ts`, dùng ở `e2e/customer-kyc.spec.ts`, `e2e/customer-ai-web.spec.ts`.

---

# Issue #773 — T-284: G3: mockup và token cho bốn chỗ đổi hình thức (tương phản, hộp 8d, panel mờ, dòng help 1a / 4a)

Trạng thái: CLOSED · nhãn: type:task, risk:med, gate, ready-for-agent

##### Mục tiêu

Bước G3 của đợt sửa: một PR mockup / token để Owner duyệt một lần, trước khi code các chỗ đổi hình thức.

1. **Token tương phản:**
   - viền ô nhập và mũi tên sắp xếp đạt ≥ 3:1 với nền, cả theme sáng lẫn tối (WCAG 1.4.11);
   - đề xuất giá trị token mới trong bảng token của mockup, kèm số tương phản trước / sau và ảnh;
   - code ở T-300.
2. **Hộp 8d:**
   - dời ngày nộp / phát hành sang tháng khác thì "Ảnh hưởng chỉ số" nêu thêm dòng số HĐ nộp / HĐ phát hành chuyển tháng, cạnh dòng FYP;
   - code ở T-296.
3. **Panel KYC Intelligence ở trạng thái mờ:**
   - khung "Thông tin tham khảo" và thẻ phần tử bên trong không còn hai lớp viền đứt lồng nhau;
   - vẽ trạng thái mờ của khối này trong mockup (mockup 2h hiện chưa có khối này);
   - code ở T-297.
4. **Mockup 1a / 4a:**
   - bỏ "DeepSeek V4 Pro" khỏi hai dòng help mẫu (Owner bỏ model này 09/10/2026; app sinh dòng help từ `AI_MODELS`);
   - xong ở PR này, không cần code.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771); duyệt đề xuất "G3: em gửi giá trị / mockup để anh duyệt". Bốn chỗ gom vào một PR để Owner duyệt một lần.

Issue này gom mục OPEN gắn **[T-284]** (dòng help DeepSeek của mockup). Ba mục còn lại giữ nhãn của Issue code (T-296, T-297, T-300); Issue này là bước G3 của chúng.

##### Tài liệu cần đọc

- `.claude/rules/mockups.md`; `docs/design/mockups/README.md`
- `docs/state/review-notes.md`: mục gắn [T-284]; mục token G3 (T-300), hộp 8d (T-296), viền đứt (T-297)
- `docs/design/mockups/index.html` (bảng token), `docs/design/mockups/mockups.css`, `docs/design/mockups/forms.css`
- `docs/design/mockups/policy-forms.html` (8d); `docs/design/mockups/ai.html` (1a, 4a, 2h, khối Thông tin tham khảo)
- `packages/ui/src/tokens.css` (giá trị token hiện tại); `apps/desktop/src/routes/customers/KycIntelligence.tsx` (viền khi mờ); `apps/desktop/src/routes/customers/policy-form.ts` (`policyChange`, `monthEffects`)

##### File / thư mục được phép sửa

- `docs/design/mockups/**` (gồm `README.md`: ghi lần duyệt G3)

##### Ghi chú OPEN liên quan

Mục OPEN gắn **[T-284]**: gộp. Ba mục token / 8d / viền đứt chỉ làm phần mockup ở đây; code và việc chuyển RESOLVED thuộc Issue ghi ở nhãn của chúng. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Chỉ mockup, không sửa code.
- Owner duyệt G3 trên PR rồi merge.
- T-296, T-297, T-300 làm theo mockup đã duyệt.

##### Test chấp nhận

- [ ] Bảng số tương phản trước / sau của viền ô nhập và mũi tên sắp xếp, cả hai theme; giá trị mới ≥ 3:1.
- [ ] Mockup 8d có dòng số HĐ. Ví dụ: dời ngày nộp từ tháng 09 sang 10 → "tháng 09: −1 HĐ nộp · tháng 10: +1 HĐ nộp".
- [ ] Mockup có trạng thái mờ của khối Thông tin tham khảo, chỉ một lớp viền đứt.
- [ ] Mockup 1a / 4a không còn "DeepSeek V4 Pro".
- [ ] `README.md` của mockup ghi lần duyệt G3 (ngày, Issue).

Ước lượng: ≈ 80 dòng mockup / tài liệu.

##### Định nghĩa hoàn thành

- [ ] Review phiên sạch: PASS (PR docs, không chạy CI)
- [ ] Owner duyệt G3 trên PR; Owner merge. PR mang nhãn `risk:med` (không `risk:low`), để `merge-pr` không cho Claude tự merge trước khi Owner duyệt G3
- [ ] PR sổ sau review chuyển mục [T-284] sang RESOLVED

##### Rủi ro

risk:med

##### Bị chặn bởi

Không

## PR #795 — docs: G3 mockups for the control border token, the 8d policy count line and the faded reference block (T-284)

Trạng thái: MERGED · merge 2026-10-23T16:14:48Z · commit `f2465f88f054daed97f9bada04ea0bafa75c9bb1` · nhánh `task/T-284-g3-mockups` · nhãn: risk:med, gate

Closes #773

PR mockup **G3** của đợt sửa trước v1.0: bốn chỗ đổi hình thức gom một PR để anh duyệt một lần. Chỉ sửa `docs/design/mockups/**`, không code. Quyết định gom ở thẻ `index.html#t284` (mở bằng server `mockups`, 1440 × 900).

**Cổng G3: Owner duyệt cả 5 đề xuất ngày 23/10/2026.** Commit `5a8e068` ghi lần duyệt vào README mockup, thẻ `index.html#t284` và các mẫu. Đề xuất 2 (phạm vi T-300) đã ghi vào thân Issue #789, kèm comment.

#### Thay đổi

1. **Token `--border-control` #687890** cho viền ô nhập và mũi tên sắp xếp chưa chọn (`mockups.css`; bảng token và thẻ `#contrast` của `index.html`). Số đo WCAG 1.4.11 (≥ 3:1):

   | Thành phần | Nền kề | Trước | Sau |
   |---|---|---|---|
   | Viền ô nhập `TextField`, `SelectField`; ô tìm Thùng rác, ô tin nhắn ChatGPT web | ruột ô bg-0 · hộp thoại, thẻ bg-1 | `--border-strong` 1,88 · 1,76 | 4,25 · 3,97 |
   | Viền ô ngày Tùy chọn `PeriodPicker` | ruột ô bg-2 · màn bg-0 | `--border` 1,25 · 1,47 | 3,61 · 4,25 |
   | Mũi tên ↕ chưa chọn `DataTable` | thẻ bg-1 | `--border-strong` 1,76 | 3,97 |
   | Mũi tên ↑ ↓ đã chọn | thẻ bg-1 | `--accent` 8,94 | giữ |

   - `--border-control` trên bg-0 / 1 / 2 / 3: 4,25 · 3,97 · 3,61 · 3,15. Cặp thấp nhất là ruột bg-3 của `.input` trong mockup; trong app là ruột bg-2 của ô ngày (3,61).
   - Token mới thay vì làm sáng `--border-strong`: `--border-strong` còn dùng cho khung, viền đứt, trục chart, đường kẻ nhóm của bảng báo cáo, những chỗ không cần 3:1; làm sáng nó thì đổi hình mọi chỗ đó.
   - Mockup dùng token mới ở `.input` (`forms.css`), `.select`, `.search`, `th.sort::after` (`mockups.css`), nên mọi mockup hiện viền mới. Ảnh trước / sau: khối hai cột ở `index.html#contrast`.
   - **App chỉ có theme tối** (ADR-0013; `packages/ui/src/tokens.css` chỉ có `color-scheme: dark`). "Cả theme sáng lẫn tối" của Issue này và của T-300 hiểu là theme tối.
2. **Hộp 8d — dòng số HĐ** (`policy-forms.html#p8d-month`, mẫu mới; 8d cũ giữ nguyên vì không dời tháng): dời ngày nộp 20/08 → 01/09/2026 thì "Ảnh hưởng chỉ số" có hai dòng FYP nộp như hiện nay và thêm "tháng 08/2026: −1 HĐ nộp · tháng 09/2026: +1 HĐ nộp".
   - Luật ghi ngay dưới mẫu, để T-296 code theo luật: mỗi chỉ số đổi tháng một dòng, ngay sau các dòng FYP của chỉ số đó; dời cả hai ngày thì hai dòng; dời trong cùng tháng hay chỉ sửa FYP thì không có dòng số HĐ.
   - Ví dụ của Issue (09 → 10) đổi thành 08 → 09: hôm nay giả lập của mockup là 26/09/2026, ngày nộp không được sau hôm nay (`readPolicy`). Tháng kèm năm như dòng FYP (`monthOf`), để dời qua năm vẫn rõ.
3. **2h — khối Thông tin tham khảo mờ** (`ai.html#p2h`; mockup 2h trước đây chưa có khối này): khi mờ, khung đổi sang viền liền `--border`; thẻ bên trong giữ viền đứt, không nền như mọi thẻ mờ (DR6-21, Owner 15/10). Chỉ còn một lớp viền đứt. Khi không mờ, khung vẫn viền đứt như `customer.html`.
4. **1a / 4a** (`ai.html:340`, `:825`): bỏ "DeepSeek V4 Pro"; dòng help mẫu khớp `AI_MODELS` ("GLM-5.3 · Kimi K3 · DeepSeek V4.1 Flash").
5. **`README.md`** của mockup: ghi T-284 (#773) ở đoạn đầu, dòng `policy-forms.html`, `ai.html` ("duyệt 23/10/2026 (PR #795)") và đoạn CSS. Lần duyệt cũng ghi ở thẻ `#t284` (đổi thành "quyết định G3 của Owner", như `#ask` của `ai.html`), dòng token, chú thích 8d dời tháng và chú thích 2h.

`docs/PROJECT-STATE.md` không sửa: ngoài danh sách file của Issue, và Issue chỉ định ghi lần duyệt G3 ở README mockup.

#### Quyết định G3 — Owner duyệt cả 5 (23/10/2026)

1. Token `--border-control` #687890, giữ `--border` / `--border-strong`; chỉ theme tối. **Đề xuất: duyệt.**
2. Phạm vi T-300 (#789): thêm `apps/desktop/src/routes/SettingsTrash.tsx` (ô tìm, `:352`) và `apps/desktop/src/routes/customers/KycWebSession.tsx` (ô tin nhắn, `:138`). Hai ô này tự viết class `border-border-strong`, ngoài danh sách file của T-300. `SettingsTrash.tsx` có trong file của T-294 / T-296 nhưng hai Issue đó không có việc này; `KycWebSession.tsx` không thuộc Issue nào của đợt. **Đề xuất: thêm cả hai vào T-300**, mỗi file đổi một class, để token đổi trọn ở một PR.
3. Hộp 8d: dòng số HĐ như mẫu `#p8d-month`. **Đề xuất: duyệt.**
4. 2h: khung viền liền, thẻ viền đứt. Phương án khác: giữ khung viền đứt, thẻ trong khung bỏ viền (lệch luật "thẻ mờ viền đứt" của DR6-21). **Đề xuất: khung viền liền.**
5. 1a / 4a: bỏ DeepSeek V4 Pro. **Đề xuất: duyệt** (không cần code).

#### Test chấp nhận

- [x] Bảng số tương phản trước / sau của viền ô nhập và mũi tên sắp xếp; giá trị mới ≥ 3:1 trên mọi nền (theme tối, theme duy nhất): `index.html#contrast`.
- [x] Mockup 8d có dòng số HĐ: "tháng 08/2026: −1 HĐ nộp · tháng 09/2026: +1 HĐ nộp" (`policy-forms.html#p8d-month`).
- [x] Mockup có trạng thái mờ của khối Thông tin tham khảo, chỉ một lớp viền đứt (`ai.html#p2h`).
- [x] Mockup 1a / 4a không còn "DeepSeek V4 Pro".
- [x] `README.md` của mockup ghi lần duyệt G3 (ngày, Issue): "T-284 #773, duyệt 23/10/2026 (PR #795)".

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (sổ @ `dcf11fe`), 2 mục "Trùng file":

- L63 `docs/design/mockups/ai.html` (**[T-284]** dòng help 1a / 4a còn "DeepSeek V4 Pro"): **đã sửa**.
- L70 `docs/design/mockups/ai.html` (**[T-297]** mã F trên dòng thời gian): **để lại**, việc của code `CustomerKyc.tsx` ở T-297 (#786); mockup đã muốn mã F ở mọi nơi, không cần đổi.

Ba mục chỉ nêu file code nên `--diff` không liệt kê. PR này làm phần mockup (G3) của chúng; mục vẫn OPEN tới khi Issue ghi ở nhãn sửa code:

- L44 **[T-300]** token tương phản (`packages/ui/src/tokens.css`).
- L107 **[T-297]** hai lớp viền đứt (`KycIntelligence.tsx:260`).
- L109 **[T-296]** hộp 8d thiếu số HĐ (`policy-form.ts`).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (docs-only, không chạy CI). Lần chạy đầu đỏ một ca đo thời gian không liên quan: `packages/ai/src/web.test.ts` DR5-09, 57 ms > ngưỡng 50 ms, đúng ca chập chờn khi máy bận mà sổ đã ghi (mục **[T-290]** `web.ts:121`); PR không đụng `packages/ai`. Lần hai xanh: 119 / 119 file, 3 598 / 3 598 test. Chạy lại trên head `5a8e068` (sau commit ghi lần duyệt): xanh, 119 / 119 file, 3 598 / 3 598 test.
- [x] Không thêm dependency
- [x] Mockup mở trên server `mockups` (1440 × 900): `index.html#t284`, `#contrast`, `policy-forms.html#p8d-month`, `ai.html#p2h`, 1a, 4a, không lỗi console. Màu tính được: viền / mũi tên trước #34425A (ô ngày #263241), sau #687890, mũi tên đã chọn vẫn `--accent`; khung 2h viền liền #263241, thẻ viền đứt #34425A. Mockup khác dùng `.input` / `.select` / `th.sort` (vd. `customers.html`) hiện viền mới.
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` (docs-only; nhãn `gate`, để `merge-pr` không cho Claude tự merge trước khi anh duyệt G3).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-284 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #452 — T-284 (#773, PR #795, `REVIEW: PASS` @`5a8e068`):
  - #452 (T-180), `docs/design/mockups/ai.html` (dòng help mẫu 1a / 4a): bỏ "DeepSeek V4 Pro"; hai dòng nay bằng `AI_MODELS` ("GLM-5.3 · Kimi K3 · DeepSeek V4.1 Flash"). Owner duyệt G3 23/10/2026.

---

# Issue #774 — T-285: Hàm dùng chung vào packages/domain (ngày giờ, ngày ISO, bỏ dấu, chuẩn hóa so sánh, id ngẫu nhiên), API nextKycVersion

Trạng thái: CLOSED · nhãn: type:task, risk:high, ready-for-agent

##### Mục tiêu

Đưa các phép tính lặp ở nhiều package về một hàm của `domain`; đổi API `nextKycVersion` cho khó dùng sai.

1. **Ngày giờ:**
   - hàm "dd/mm HH:MM" thay cách tách chuỗi của `formatLocalDateTime` ở `dayAndTime` (panel AI);
   - `isIsoDate` dùng chung cho kiểm ngày ISO của schema AI và `validDate` của kiểm nhập backup;
   - `parseDate` (ô Từ / Đến của kỳ Tùy chọn) đọc trên `normalizeText` như `parseQuickDate`.
2. **Bỏ dấu:** `plain` ×2 (Thùng rác, form lịch hẹn), phần bỏ dấu của `slug` (file Excel) và `fold` của so khớp V3–V6 dùng một hàm (mỗi chỗ tự hạ chữ thường nếu cần).
3. **Chuẩn hóa so sánh:** `comparable` (đề xuất trích xuất) và `collapseSpaces` (V7) dùng chung phần NFC + gộp khoảng trắng.
4. **Id ngẫu nhiên:** `newSessionId` (AI) và `newPage` (lưu file) dùng một hàm định dạng 16 byte thành hex. `domain` vẫn thuần: hàm nhận byte, nơi gọi lấy byte bằng `crypto.getRandomValues`.
5. **DR6-67, phần domain:**
   - `yearBefore` và `sameDayYearBefore` thành một hàm;
   - số ngày tự làm của seed (`DAY_MS`, `dayNumber`) thay bằng `addDays` / `daysBetween`.
6. **API `nextKycVersion`:** một tham số `previous: { version, profile } | null`, thay cặp `previous` + `before` mà ba chỗ gọi đang phải truyền `previous && before`.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Issue này gom mọi mục OPEN gắn **[T-285]**: mục `dayAndTime` (#438), `isoDate` (#465), `plain` (#543), `comparable` / `collapseSpaces` (#469), `newSessionId` (#448), `parseDate` (#738), Domain (R3) phần `nextKycVersion`, DR6-67 phần domain / seed. Phần "ngày nhanh đầu năm" của mục Domain (R3) thuộc T-291.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-285]
- `packages/domain/CLAUDE.md` (domain thuần, export qua `index.ts`, coverage)
- `packages/domain/src/{period.ts,text.ts,kyc.ts,evidence-level.ts,compare.ts,index.ts}`
- `packages/ai/src/{schema.ts,text-match.ts,validator.ts,run.ts}`; `packages/ai/CLAUDE.md` (ranh giới `ai-schema-standalone`)
- `packages/db/src/{backup-validation.ts,seed.ts,kyc.ts}`
- `apps/desktop/src/routes/{trash-view.ts,appointments/appointment-form.ts,reports/report-workbook.ts,customers/ai-panel-view.ts,customers/extraction-view.ts,customers/kyc-view.ts}`, `apps/desktop/src/data/tauri-storage.ts`
- DR6-67: `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §8.5; vị trí: `docs/reviews/raw/2026-10-15/home-pc/claude/A.md` (mục DR6-67)

##### File / thư mục được phép sửa

- `packages/domain/src/{period.ts,text.ts,kyc.ts,evidence-level.ts,compare.ts,index.ts}` + test
- `packages/ai/src/{schema.ts,text-match.ts,validator.ts,run.ts}` + test
- `packages/db/src/{backup-validation.ts,seed.ts,kyc.ts}` + test
- `apps/desktop/src/routes/{trash-view.ts,appointments/appointment-form.ts,reports/report-workbook.ts,customers/ai-panel-view.ts,customers/extraction-view.ts,customers/kyc-view.ts}` + test
- `apps/desktop/src/data/tauri-storage.ts` + test
- `packages/{domain,ai,db}/CLAUDE.md`, `apps/desktop/CLAUDE.md` (khối codemap, `pnpm codemap`)

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-285]**: gộp. Mục khác mà `notes-for` báo trùng file (vd. các mục của `validator.ts`, `run.ts`, `schema.ts` thuộc T-288 / T-290 / T-291) để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- `domain` không import gì, không gọi `crypto` / `Date.now`; hàm mới export qua `index.ts`.
- `packages/ai/src/schema.ts` vẫn chỉ import `zod` + `domain`.
- Hành vi không đổi: test cũ của mọi chỗ gọi xanh mà không sửa kỳ vọng (trừ chữ ký `nextKycVersion`).

##### Test chấp nhận

- [ ] Unit `domain` cho từng hàm mới, có biên:
  - giờ 00:00 / 23:59;
  - ngày ISO sai, năm 1899, 29/02 năm không nhuận;
  - chữ có `đ` và dấu tổ hợp NFD;
  - 16 byte → 32 ký tự hex.
- [ ] Mọi chỗ gọi cũ dùng hàm mới; không còn bản chép (rg trong PR).
- [ ] `parseDate` đọc được ngày kèm U+200B / U+2060 như ô ngày lịch hẹn.
- [ ] Seed giả lập ra đúng dữ liệu như trước (test hash seed không đổi).
- [ ] `pnpm lint:deps` xanh.

Ước lượng: ≈ 150 dòng SP + ≈ 150 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-285] đã sửa sang RESOLVED

##### Rủi ro

risk:high

##### Bị chặn bởi

Không

## PR #799 — refactor: share date, text and id helpers in domain, one previous for nextKycVersion (T-285)

Trạng thái: MERGED · merge 2026-10-23T17:20:32Z · commit `7d5029ad73dbdc048df62db6b6639160c1c8c27a` · nhánh `task/T-285-domain-shared-helpers` · nhãn: type:task, risk:high

Closes #774

#### Thay đổi

Đưa các phép tính lặp ở nhiều package về một hàm của `packages/domain` (DR6-67 phần domain / seed, các ghi chú #438, #465, #469, #448, #543, #738), đổi API `nextKycVersion` (Domain R3). Hành vi không đổi, trừ `parseDate` (Issue yêu cầu).

**Hàm mới của `domain`** (export qua `index.ts`, trừ `sameDayYearBefore`):

- `period.ts`
  - `formatLocalDayMonthTime(at)` → `dd/mm HH:MM` (giờ địa phương); `formatLocalDateTime` dùng chung phần `HH:MM` (`localTime`, không export).
  - `isIsoDate(text)`: ngày `fromIsoDate` đọc được.
  - `sameDayYearBefore(date)`: cùng ngày năm trước, 29/02 → 28/02. Lấy dạng **không kiểm** 1900–2100 của `yearBefore` cũ: `evidenceLevel` với ngày phân tích năm 1900 vẫn không ném lỗi (test mới ở `evidence-level.test.ts` giữ hành vi này); `comparisonWindows` không bao giờ tới năm 1900 (`canShift` trả null trước, `compare.test.ts` đã ghim). Chỉ `compare.ts` và `evidence-level.ts` dùng nên export mà không vào `index.ts` (như `markIndexer`, `packages/domain/CLAUDE.md`).
  - `parseDate` đọc trên `normalizeText(text)` như `parseQuickDate` (review #738): "12/10/2026" kèm U+200B / U+2060 / U+0085 / U+0007 nay đọc được ở ô Từ / Đến của kỳ Tùy chọn.
- `text.ts`
  - `stripDiacritics(text)`: bỏ dấu, `đ` → `d`, `Đ` → `D`, giữ chữ hoa / thường. Mọi chỗ gọi tự hạ chữ thường trước như cũ, nên phần `Đ` → `D` không đổi kết quả nào hiện có.
  - `collapseSpaces(text)`: NFC + mỗi đoạn khoảng trắng (`\s`, giữ như hai bản cũ) thành một dấu cách; không cắt đầu cuối.
  - `toHex(bytes)`: mỗi byte hai chữ số hex thường. `domain` không gọi `crypto`: nơi gọi truyền byte của `crypto.getRandomValues`.
- `kyc.ts`: `nextKycVersion(previous: { version, profile } | null, after, date, manualMaterial)` thay cặp `previous` + `before`.

**Chỗ gọi:**

| Chỗ cũ | Nay |
|---|---|
| `ai-panel-view.ts` `dayAndTime` (tách chuỗi `formatLocalDateTime`) | `formatLocalDayMonthTime`, bỏ hàm riêng |
| `ai/schema.ts` `isoDate`, `db/backup-validation.ts` `validDate` (`try { fromIsoDate } catch`) | `isIsoDate` |
| `trash-view.ts`, `appointment-form.ts` `plain`; phần bỏ dấu của `report-workbook.ts` `slug`; `ai/text-match.ts` `fold` | `stripDiacritics` (bỏ `plain` ×2 và `fold`) |
| `extraction-view.ts` `comparable`, `ai/validator.ts` `collapseSpaces` | `collapseSpaces` của `domain` (`comparable` thêm `trim` + chữ thường như cũ) |
| `ai/run.ts` `newSessionId`, `tauri-storage.ts` `newPage` | `toHex(crypto.getRandomValues(new Uint8Array(16)))` |
| `evidence-level.ts` `yearBefore`, `compare.ts` `sameDayYearBefore` | `sameDayYearBefore` của `period.ts` |
| `db/seed.ts` `DAY_MS`, `dayNumber`, `toDate` | `daysBetween` / `addDays` từ mốc 01/01/1970 (số ngày giữ nguyên nghĩa); `middayOf` lấy trưa UTC bằng `Date.UTC(y, m − 1, d, 12)` của ngày đó, cùng thời điểm với `(day + 0.5) × DAY_MS` cũ |
| `db/kyc.ts` ×2, `kyc-view.ts` `nextKycVersion(previous, previous && before, …)` | `latest ? { version, profile } : null` |

**File test ngoài danh sách tên trong Issue:** `packages/ai/src/blocklists.test.ts` chỉ đổi import `fold` (đã bỏ khỏi `text-match.ts`) sang `stripDiacritics` của `@p2c/domain`, không đổi kỳ vọng. `packages/db/src/seed.test.ts` (test của `seed.ts`) dùng `toHex` cho hàm băm, không đổi kỳ vọng.

Codemap: `packages/domain/CLAUDE.md`, `packages/ai/CLAUDE.md` (`pnpm codemap`).

#### Test chấp nhận

- [x] Unit `domain` cho từng hàm mới, có biên: giờ 00:00 / 23:59 (`formatLocalDayMonthTime`); ngày ISO sai, `1899-12-31`, `2026-02-29` (`isIsoDate`, cùng danh sách kiểm `fromIsoDate` ném lỗi); chữ có `đ` / `Đ` và dấu tổ hợp NFD (`stripDiacritics`); 16 byte → 32 ký tự hex (`toHex`); 29/02 → 28/02 (`sameDayYearBefore`).
- [x] Mọi chỗ gọi cũ dùng hàm mới; không còn bản chép. `git grep` trên mã nguồn (bỏ `*.test.ts`), sau thay đổi:
  ```
  == bỏ dấu (normalize('NFD') / \p{M}, replace(/đ/)
  packages/ai/src/test-support.ts:16   (chèn U+200B trước dấu cho test, không phải bỏ dấu)
  packages/ai/src/text-match.ts:36     (cleanText: dấu lạc thành dấu cách, G5 §7 bước 0)
  packages/domain/src/text.ts:58       stripDiacritics
  == hex của byte (toString(16))
  packages/domain/src/kyc.ts:119       (cyrb53: số → hex, không phải byte)
  packages/domain/src/text.ts:76       toHex
  == tách chuỗi formatLocalDateTime(...).split   (không còn)
  == try { fromIsoDate } catch
  packages/domain/src/period.ts:126    isIsoDate
  == DAY_MS / yearBefore
  packages/domain/src/period.ts:23     MS_PER_DAY (của period.ts)
  packages/domain/src/period.ts:168    sameDayYearBefore
  ```
- [x] `parseDate` đọc được ngày kèm U+200B / U+2060 (và U+0085 / U+0007) như ô ngày lịch hẹn: test so cả với `parseQuickDate`.
- [x] Seed giả lập ra đúng dữ liệu như trước: `seed.test.ts` xanh với `DEMO_HASH` `01f23ca6…` và `DEMO_ROW_COUNTS` không đổi.
- [x] `pnpm lint:deps` xanh (trong `pnpm verify`).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`: 36 mục "Trùng file".

Đã sửa (8 mục [T-285]):

- L42 API `nextKycVersion`: đã sửa, một tham số `previous: { version, profile } | null`.
- L47 `ai-panel-view.ts` `dayAndTime`: đã sửa, `formatLocalDayMonthTime` ở `period.ts`.
- L48 `isoDate` / `validDate`: đã sửa, `isIsoDate` ở `period.ts`.
- L57 `comparable` / `collapseSpaces`: đã sửa, `collapseSpaces` ở `text.ts`.
- L63 `newSessionId` / `newPage`: đã sửa, `toHex` ở `text.ts`.
- L79 `plain` ×2 + `slug`: đã sửa, `stripDiacritics` ở `text.ts`.
- L148 `parseDate` đọc `text.trim()`: đã sửa, đọc trên `normalizeText`.
- L213 DR6-67 phần `domain`, seed, bỏ dấu: đã sửa (`sameDayYearBefore`; seed qua `daysBetween` / `addDays`; bỏ dấu ×4 qua `stripDiacritics`).

Để lại, thuộc Issue ghi ở nhãn (ngoài phạm vi T-285):

- L12 hash `kyc_versions` khi nhập backup: để lại, T-291 #780.
- L43 ngày nhanh đầu năm: để lại, T-291 #780.
- L45 `phrase()` ghi tên mục vào `detail`, mục trùng phần nhau: để lại, T-290 #779.
- L65 tập provider không model: để lại, T-288 #777.
- L66 hai hằng 20 000: để lại, T-288 #777.
- L68 phạm vi export của `run.ts`: để lại, T-288 #777.
- L72 message `assistant` rỗng khi thử lại: để lại, T-290 #779 (cần lần gọi thật, G4).
- L88 `fillTrash` `res[0]!`: để lại, T-287 #776.
- L113 `normalizeKycValue` của `db`: để lại, T-286 #775.
- L119 `TRANSITION_BEFORE_LATEST` cùng ngày: để lại, T-296 #785.
- L120 cờ cùng ngày vào params: để lại, T-296 #785.
- L129 `optionalText` chỉ `trim()`: để lại, T-291 #780.
- L130 `normalizeNote` với VT / FF: để lại, T-291 #780.
- L131 `randomText` lặp ở test: để lại, T-287 #776.
- L135 `schemaDetail` nhánh `default`: để lại, T-288 #777.
- L136 REJECTED lưu `output_json` không qua V1: để lại, T-291 #780 (G2 / G5).
- L143 `purgedNotice` nối bằng `.join(' ')`: để lại, T-296 #785.
- L150 `parseVnd(normalizeText(text))` chuẩn hóa hai lần: để lại, T-297 #786.
- L157 *Shotgun Surgery* DR6-114: để lại, T-287 #776.
- L158 tên kind là chuỗi thô: để lại, T-287 #776.
- L171 `restoreLabel`: để lại, T-296 #785.
- L172 chữ trạng thái HĐ lặp: để lại, T-296 #785.
- L182 `hint` ô Case size: để lại, T-298 #787.
- L205 DR6-25 `zod/mini`: để lại, T-292 #781.
- L208 hàm `db` chỉ test dùng, `monthToDate`: để lại, T-286 #775.
- L212 `update<X>Row` / `nextSeq` / `find / live<X>`: để lại, T-286 #775.
- L216 hằng class / 17 cột báo cáo: để lại, T-301 #790.
- L226 *Data Clumps* `customerId` + `kycVersionId`: để lại, T-288 #777.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local. Lần chạy đầu trượt một ca đo thời gian không liên quan: `web.test.ts:445` (DR5-09, 61 ms > 50 ms), ca sổ đã ghi là chập chờn khi `pnpm verify` chạy song song (L193, [T-290 #779]); `web.ts` không đổi, file chạy riêng xanh 3/3, lần chạy lại xanh.
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:high`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-285 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #438, #448, #465, #469, #543, #738, mục Domain (R3) và DR6-67 phần domain / seed — T-285 (#774, PR #799, `REVIEW: PASS` @`3912db0`):
  - Domain (R3), `packages/domain/src/kyc.ts` (API `nextKycVersion`): một tham số `previous: { version, profile } | null` thay cặp `previous` + `before`; ba chỗ gọi (`packages/db/src/kyc.ts` ×2, `apps/desktop/src/routes/customers/kyc-view.ts`) truyền `latest ? { version, profile } : null`.
  - #438, `apps/desktop/src/routes/customers/ai-panel-view.ts` (`dayAndTime`): bỏ; dùng `formatLocalDayMonthTime` (`dd/mm HH:MM`) của `packages/domain/src/period.ts`, chung phần giờ với `formatLocalDateTime`.
  - #448, `packages/ai/src/run.ts` (`newSessionId`) và `apps/desktop/src/data/tauri-storage.ts` (`newPage`): `toHex(crypto.getRandomValues(new Uint8Array(16)))`; `toHex` ở `packages/domain/src/text.ts` nhận byte, `domain` không gọi `crypto`.
  - #465, `packages/ai/src/schema.ts` (`isoDate`) và `packages/db/src/backup-validation.ts` (`validDate`): dùng `isIsoDate` của `packages/domain/src/period.ts`.
  - #469, `apps/desktop/src/routes/customers/extraction-view.ts` (`comparable`) và `packages/ai/src/validator.ts` (`collapseSpaces`): `collapseSpaces` (NFC, mỗi đoạn `\s` thành một dấu cách) ở `packages/domain/src/text.ts`; `comparable` cắt hai đầu và hạ chữ thường như cũ. Bản chép thứ ba ở `tools/eval-ai-core.mjs`: xem mục review #799 ở OPEN.
  - #543, `apps/desktop/src/routes/trash-view.ts`, `apps/desktop/src/routes/appointments/appointment-form.ts` (`plain`) và `apps/desktop/src/routes/reports/report-workbook.ts` (`slug`): `stripDiacritics` của `packages/domain/src/text.ts`, mỗi chỗ tự hạ chữ thường trước.
  - #738, `packages/domain/src/period.ts` (`parseDate`, ô Từ / Đến của kỳ Tùy chọn): đọc trên `normalizeText(text)` như `parseQuickDate`; ngày kèm U+200B / U+2060 / U+0085 / U+0007 đọc được.
  - DR6-67 (deep review lượt 1), phần domain, seed và bỏ dấu: `sameDayYearBefore` của `packages/domain/src/period.ts` thay `yearBefore` (`packages/domain/src/evidence-level.ts`) và bản của `packages/domain/src/compare.ts` (dạng không kiểm 1900–2100; `comparisonWindows` không bao giờ tới năm 1900); `packages/db/src/seed.ts` tính ngày qua `daysBetween` / `addDays`, bỏ `DAY_MS`, seed ra đúng dữ liệu cũ (`DEMO_HASH` không đổi); `fold` của `packages/ai/src/text-match.ts` thay bằng `stripDiacritics`.

---

# Issue #775 — T-286: packages/db: gộp hàm lặp của lệnh, bỏ hàm chỉ test dùng (DR6-66, DR6-67)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

Gộp các đoạn lặp của lệnh `db` và bỏ hàm chỉ test dùng.

1. **DR6-67, phần db:**
   - `update<X>Row` ×5 thành một helper;
   - "seq lớn nhất theo KH" ×5 dùng một helper;
   - `find` / `live<X>` ×6 dùng một helper.
2. **DR6-66, phần db / domain:** bỏ hoặc thu hẹp các hàm chỉ test dùng; test đọc lại bằng hàm `list*` / truy vấn của test:
   - `getAppointment` (kèm `isCustomerLive`), `getPolicy`, `getTeam`, `getPerson`, `markKycVersionMaterial`;
   - bí danh export `liveCustomer` của module KH;
   - `monthToDate`;
   - `stageOn` (không còn chỗ gọi ngoài test từ #740; sửa luôn hai doc comment nhắc tên nó).
3. **`createCustomer`** kiểm nhóm một lần, không kiểm trong câu chèn rồi kiểm lại ở `checkTransition`.
4. **`normalizeKycValue` của `db`** chỉ kiểm `isStorableText`, không chạy `cleanText` rồi bỏ kết quả.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Issue này gom các mục OPEN gắn **[T-286]**:
- DR6-67 phần db, DR6-66 phần db / domain (lượt 1, Owner 15/10 hoãn; 23/10 đổi thành sửa trước v1.0);
- `stageOn` (review #740);
- `createCustomer` (review #640);
- `normalizeKycValue` (review #640).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-286]
- `packages/db/CLAUDE.md`; `packages/domain/CLAUDE.md`
- `packages/db/src/{common.ts,team.ts,customers.ts,appointments.ts,policies.ts,kyc.ts,ai-analyses.ts,index.ts}`
- `packages/domain/src/{period.ts,customer-lifecycle.ts}`
- DR6-66 / DR6-67: `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §8.5; vị trí: `docs/reviews/raw/2026-10-15/home-pc/claude/A.md`

##### File / thư mục được phép sửa

- `packages/db/src/{common.ts,team.ts,customers.ts,appointments.ts,policies.ts,kyc.ts,ai-analyses.ts,index.ts}` + test của chúng, `packages/db/src/test-support.ts`
- `packages/domain/src/{period.ts,customer-lifecycle.ts,index.ts}` + test
- `packages/db/CLAUDE.md`, `packages/domain/CLAUDE.md` (khối codemap)

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-286]**: gộp. Mục khác trùng file, nhất là phần `customers.ts`, `team.ts` của T-287 và cờ E20 của T-296, để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Lệnh giữ nguyên hành vi và mã lỗi; app không dùng hàm nào bị bỏ (DR6-66: chỉ test dùng; kiểm lại bằng rg trong PR).
- Một transaction mỗi lệnh như cũ.

##### Test chấp nhận

- [ ] Test db / domain xanh. Kỳ vọng nào phải đổi thì nêu trong PR (chỉ chỗ test gọi hàm bị bỏ).
- [ ] Không còn các export trong danh sách DR6-66 phần db / domain (rg ghi trong PR).
- [ ] `createCustomer` với nhóm sai ra đúng mã lỗi cũ; với nhóm đúng ghi đúng một chuyển nhóm đầu.
- [ ] `normalizeKycValue` với NUL / nửa surrogate vẫn ra `INVALID_TEXT`.

Ước lượng: ≈ 200 dòng SP (phần lớn là xóa) + ≈ 150 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-286] đã sửa sang RESOLVED

##### Rủi ro

risk:med

##### Bị chặn bởi

#774 (T-285)

## PR #801 — refactor: share row, live-check and seq helpers in db, drop test-only exports (T-286)

Trạng thái: MERGED · merge 2026-10-23T18:37:52Z · commit `228acac5b40787be097b1b610c1e924cfc42a8de` · nhánh `task/T-286-db-shared-helpers` · nhãn: type:task, risk:med

Closes #775

#### Thay đổi

1. **DR6-67, phần db** (`packages/db/src/common.ts`):
   - `updateRow(db, table, id, changes)` thay năm hàm `updateTeamRow`, `updatePersonRow`, `updateCustomerRow`, `updatePolicyRow`, `updateAppointmentRow`. Hàm trả về đúng phần đã ghi (kèm `updatedAt` mới), như `updateAppointmentRow` trước đây.
   - `findRow` / `liveRow` thay sáu chỗ `find` / `live<X>`: `findTeam`, `findPerson`, `findCustomer`, `findAppointment`, câu tìm viết tay của `restorePolicy` / `livePolicy`, và thân của `liveTeam`, `livePerson`, `liveAppointment`, `livePolicy`, `liveCustomer`.
     - Mỗi bảng một truy vấn prepared (`perTable` nhớ hàm dựng truy vấn theo bảng, vì `prepared` nhận ra truy vấn qua hàm dựng). Trước đây chỉ `liveCustomer` được prepare.
     - Hàm bọc của từng thực thể giữ nguyên mã lỗi và params: `TEAM_NOT_FOUND`, `CUSTOMER_NOT_FOUND` nêu tên dòng đã xóa; `PERSON_NOT_FOUND`, `APPOINTMENT_NOT_FOUND`, `POLICY_NOT_FOUND` vẫn không có params, vì `PERSON_NOT_FOUND` chỉ có params khi đi đủ cặp `name` + `as`.
   - `lastSeq(db, table, customerId)` thay các câu "seq lớn nhất theo KH" của `stage_transitions`, `kyc_notes`, `kyc_facts`, `ai_analyses`. Riêng `kyc_versions` để nguyên: `save` vốn đã đọc dòng phiên bản mới nhất để làm `previous` nên lấy `seq` luôn từ dòng đó; đi qua helper thì thừa một truy vấn.
2. **DR6-66, phần db / domain:** bỏ `getAppointment` (kèm `isCustomerLive`), `getPolicy`, `getTeam`, `getPerson`, `markKycVersionMaterial`, bí danh `export { liveCustomer }` của `customers.ts` (`appointments.ts`, `policies.ts` nay import từ `common.ts`), `monthToDate`, `stageOn`. Hai doc comment của `customers.ts` từng nhắc `stageOn` nay nói "stage snapshot của domain".
   - Test đọc lại bằng hai helper trong `test-support.ts`:
     - `byId(list*(db), id)`: đọc qua hàm `list*` cùng loại;
     - `snapshotStage(customer, transitions, date)`: `stageSnapshot` của domain, đọc chuyển nhóm theo ngày, nên vẫn kiểm được D10 như `stageOn` cũ.
3. **`createCustomer`** gọi `checkTransition` một lần, trước câu INSERT; `writeTransition` là nửa "ghi" của `appendTransition`. Thứ tự gọi `db.now()` / `db.random` không đổi.
4. **`normalizeKycValue` của db** gọi `storable(value)` (nay export từ `common.ts`, cùng đường ném `INVALID_TEXT` như `cleanText`) thay cho `cleanText` rồi bỏ kết quả.

**Hành vi giữ nguyên:** mã lỗi và params như cũ, mỗi lệnh vẫn một transaction. Em so SHA-256 của `db.export()` sau `seedDemoData` trước và sau refactor, bằng một test tạm không commit:

| Bộ dữ liệu | Trước | Sau |
|---|---|---|
| demo (neo 15/09/2026, seed 11) | `de8c45ca…` | `de8c45ca…` (trùng) |
| tải nhỏ có Thùng rác (`seed-invariants`) | `cad63fed…` | `cad63fed…` (trùng) |

Test tạm đó chạy 5,1 s sau refactor so với 5,6 s trước (chỉ một lần đo, không phải số đo hiệu năng): các truy vấn tìm theo id nay được prepare.

**Kỳ vọng test phải đổi** (chỉ chỗ test gọi hàm bị bỏ):
- `kyc.test.ts`: bỏ 2 test của `markKycVersionMaterial`, gồm cả dòng kiểm "chỉ một lệnh Material".
- `period.test.ts`: bỏ 4 test của `monthToDate`.
- `customer-lifecycle.test.ts`: khối "stage on a day" chuyển sang `stageAtEndOf(sortedByDate(…))`, giữ cả 4 ca. Bỏ hai kỳ vọng lọc theo KH (`'unknown'`, `c2`), vì bộ lọc đó đi cùng `stageOn`.
- Các file còn lại: kỳ vọng giữ nguyên, chỉ đổi cách đọc lại.

**File ngoài danh sách của Issue** (đều là test, buộc phải sửa vì chính danh sách hàm bị bỏ):
- `packages/db/src/trash.test.ts`, `backup-invariants.test.ts`: đọc lại thay `getAppointment`. `trash.test.ts` gom 4 dòng kiểm RF vào helper cục bộ `isRf`.
- `packages/db/src/seed-invariants.test.ts`: thay `stageOn`.
- `packages/domain/src/golden/metrics.fixture.test.ts`: một dòng, `monthToDate(MTD_VIEWING_DATE)` → `customPeriod({ ...MTD_VIEWING_DATE, day: 1 }, MTD_VIEWING_DATE)`, cùng giá trị. Fixture `*.fixture.ts` và kỳ vọng của G18 không đổi.

**Tài liệu còn nhắc `stageOn`** (ngoài file của Issue, PR này không sửa): `docs/design/phase-3-du-lieu.md` (dòng D10, dòng `recordMeetingOutcome`, mục "Bất biến"), `docs/design/phase-4-chi-so.md:44`, `docs/golden/kh-theo-nhom.md:5`. Đề xuất một PR docs trỏ sang `stageAtEndOf` / `stageSnapshot`; có tài liệu golden nên chờ Owner quyết.

**Kiểm bằng rg** (cả hai lệnh không ra dòng nào, exit 1):
- `git grep -n -E '\b(getAppointment|isCustomerLive|getPolicy|getTeam|getPerson|markKycVersionMaterial|monthToDate|stageOn)\b' -- . ':!docs'`
- `git grep -n -E "export \{ liveCustomer \}|liveCustomer[^(]*from './customers'" -- packages apps`

**Cỡ:**
- SP +205 / −227 (432 dòng, net −22), nhỉnh hơn ngưỡng ~400: mỗi lời gọi đổi tên tính một dòng − và một dòng +, và prettier bẻ các import dài thành nhiều dòng.
- Test +182 / −171.
- Tổng 785, không tính khối codemap sinh tự động ở hai `CLAUDE.md` (+9 / −9).

#### Test chấp nhận

- [x] Test db / domain xanh; các kỳ vọng phải đổi nêu ở trên.
- [x] Không còn export nào trong danh sách DR6-66 phần db / domain (rg ở trên).
- [x] `createCustomer` với nhóm sai (`ON_HOLD`, `LOST`, `N9`) ra `INVALID_TRANSITION` với params `{ to }` như cũ, DB không đổi, `persist` không được gọi; với nhóm đúng (N4…N1) ghi đúng một chuyển nhóm đầu `[null, stage, ngày]`. Test: "checks the stage of a new customer once, writing only its first transition".
- [x] `normalizeKycValue` (của `@p2c/db`) với NUL, nửa surrogate cao / thấp, hoặc nửa lẻ đứng sau ký tự vô hình đều ra `INVALID_TEXT`; trường số `'2\0'` cũng `INVALID_TEXT`; chỉ ký tự vô hình ra `INVALID_KYC_VALUE`. Test: "normalizes a value the database can store, and refuses one it cannot as a text". Cả hai test được thêm và chạy xanh trước khi sửa code sản phẩm, để ghim hành vi cũ.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `d558a29`, 15 mục "Trùng file":

- L42 `period.ts` (ngày nhanh đầu năm): để lại, của T-291 #780.
- L82 `seed-invariants.test.ts:36` (bộ tải nhỏ chỉ kiểm bản ghi đang dùng): để lại, của T-287 #776.
- L105 `customers.ts` (`createCustomer` kiểm nhóm hai lần): **đã sửa** (mục 3).
- L106 `kyc.ts` (`normalizeKycValue` gọi `cleanText` rồi bỏ kết quả): **đã sửa** (mục 4).
- L112 `appointments.ts` (cờ E20 của `checkTransition`): để lại, của T-296 #785.
- L122 `common.ts:59` (`optionalText` chỉ `trim()`): để lại, của T-291 #780 (luật Owner duyệt 23/10, cổng riêng).
- L130 `ai-analyses.ts` (G5 §11.8, `output_json` khi nhập backup): để lại, của T-291 #780.
- L145 `appointments.ts:309` (`checkRestoreAppointment`, nhánh E7 chưa có test phía "trước ngày"): để lại, của T-287 #776.
- L147 `customer-lifecycle.ts` / `customers.ts` (`stageOn` chỉ test dùng): **đã sửa** (mục 2).
- L149 `packages/db/CLAUDE.md` / `team.ts` / `team.test.ts` (Shotgun Surgery, DR6-114): để lại, của T-287 #776.
- L150 `team.ts` (tên kind là chuỗi thô): để lại, của T-287 #776.
- L202 DR6-66 phần db / domain: **đã sửa** (mục 2).
- L206 DR6-67 phần db (`update<X>Row` ×5, seq ×5, `find` / `live<X>` ×6): **đã sửa** (mục 1; `kyc_versions` giữ `seq` từ dòng phiên bản đã đọc, lý do ở mục 1).
- L213 `customers.ts` (`liveAppointmentsOf` đọc mọi lịch sống): để lại, của T-287 #776.
- L214 `team.ts` (`inTrash` chỉ nêu tên): để lại, của T-287 #776.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (119 file, 3618 test, coverage đạt ngưỡng). Lần chạy đầu, test đo thời gian DR5-09 của `packages/ai/src/web.test.ts` chạy 52 ms so với ngưỡng 50 ms. PR không đụng `packages/ai`, ngưỡng test của `ai` đã có trong T-290 #779; chạy lại thì xanh.
- [x] Không thêm dependency ngoài ADR-0005
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #804 — docs: replace stageOn with stageAtEndOf / stageSnapshot in the specs and golden (T-286)

Trạng thái: MERGED · merge 2026-10-24T04:35:08Z · commit `931b9b8dab0414e37ce879d882b2e9d4dfdd7391` · nhánh `docs/T-286-stageon-names` · nhãn: type:task, risk:high, gate

Refs #775

PR docs riêng theo quyết định Owner 24/10 (mục sổ L195 **[T-286 #775]**): PR #801 bỏ `stageOn` của domain, nhưng spec Phase 3, spec Phase 4 và golden còn nhắc tên. PR này chỉ đổi tên hàm trong phần giải thích sang hàm còn lại; luật không đổi.

#### Thay đổi

- `docs/design/phase-3-du-lieu.md`:
  - `:25` (D10): `customers.stage` = `stageOn()` → `stageAtEndOf()`;
  - `:182` (`recordMeetingOutcome`): nhóm của KH tại ngày cuộc hẹn (`stageOn` → `stageAtEndOf`: cuối ngày đó, …);
  - `:250` (§8, "Bất biến"): `stageOn(ngày neo)` → `stageAtEndOf(ngày neo)`.
- `docs/design/phase-4-chi-so.md:44` (§2 ý 2, định nghĩa): `stageOn(transitions, kh, mốc)` → `stageAtEndOf(sortedByDate(transitions của KH), mốc)`, vẫn ở `packages/domain/src/customer-lifecycle.ts`; thêm nơi đếm: `stageSnapshot` của `packages/domain/src/stage-snapshot.ts`.
- `docs/golden/kh-theo-nhom.md:5`: (`stageOn`, ADR-0007) → (`stageSnapshot`, ADR-0007). Đây là hàm mà golden S01–S09 kiểm (`packages/domain/src/stage-snapshot.test.ts`); đầu file `stage-snapshot.ts` trỏ về golden này.

Tương đương: `stageOn` (bản trước #801) đúng là `stageAtEndOf(sortedByDate(transitions.filter((t) => t.customerId === customerId)), date)`, cũng trả null trước lần chuyển nhóm đầu. Chỗ nói về nhóm của một KH dùng `stageAtEndOf`; chỗ nói về số KH theo nhóm dùng `stageSnapshot`.

Không sửa: `docs/reviews/**` (báo cáo gốc, giữ nguyên văn) và `docs/state/review-notes.md` (PR sổ sau review).

#### Test chấp nhận

- [x] Không còn `stageOn` trong `docs/design/**`, `docs/golden/**` (tìm `stageOn\b`: không kết quả). Tên này chỉ còn ở `docs/reviews/**` và sổ.
- [x] Diff chỉ đổi tên hàm, 5 dòng (`git diff --word-diff`): không đổi số, mã lỗi, ngày quyết định hay kết quả mong đợi của golden.
- [x] Tên mới có trong code: `sortedByDate`, `stageAtEndOf` (`packages/domain/src/customer-lifecycle.ts:41`, `:46`), `stageSnapshot` (`packages/domain/src/stage-snapshot.ts:34`).

Chỉ sửa `docs/**`, không file nào thuộc `CODE_DOCS` → không chạy CI.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `aaf5c79`): 1 mục "Trùng file".

- L195 **[T-286 #775]** (tài liệu còn nhắc `stageOn`, hàm PR #801 bỏ): **đã sửa**, cả năm chỗ. Ở `phase-3-du-lieu.md:182`, lệnh đọc nhóm của ngày cuộc hẹn bằng `stagesOfDay(…).at(-1)` (`packages/db/src/customers.ts`, `applyOutcome` của `packages/db/src/appointments.ts`): bằng `stageAtEndOf` từ ngày tạo KH trở đi; trước ngày tạo là nhóm tạo KH, đúng câu DR-43 đứng ngay sau trong cùng ô. Vì vậy ô giữ nguyên cấu trúc như khi còn `stageOn`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (không đổi dependency)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:high`, vì chạm `docs/golden/**` (bảng nâng mức của `review-pr`). Spec G2 và golden → Owner merge (`merge-pr --owner`).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-286 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #801, phần tài liệu — T-286 (#775, PR #804, `REVIEW: PASS` @`6f03f4e`):
  - `docs/design/phase-3-du-lieu.md:25`, `:182`, `:250`, `docs/design/phase-4-chi-so.md:44`, `docs/golden/kh-theo-nhom.md:5`: tên `stageOn` đổi sang `stageAtEndOf` / `stageSnapshot`; luật và giá trị golden không đổi (Owner merge 24/10, G2).

- Ghi chú review PR #640, #740 và DR6-66 / DR6-67 phần `db` — T-286 (#775, PR #801, `REVIEW: PASS` @`d558a29`):
  - #640, `packages/db/src/customers.ts` (`createCustomer`): nhóm kiểm một lần, `checkTransition` trước câu INSERT; `writeTransition` là nửa "ghi" của `appendTransition`. Mã lỗi và params như cũ (ON_HOLD / LOST / N9 → `INVALID_TRANSITION` + `{ to }`).
  - #640, `packages/db/src/kyc.ts` (`normalizeKycValue` của `db`): gọi `storable` của `packages/db/src/common.ts` (`isStorableText`, sai thì `INVALID_TEXT`) thay `cleanText` rồi bỏ kết quả.
  - #740, `packages/domain/src/customer-lifecycle.ts` (`stageOn`): bỏ. Test đọc nhóm cuối ngày qua `snapshotStage` (`packages/db/src/test-support.ts`, `stageSnapshot` của domain) hoặc `stageAtEndOf(sortedByDate(…))`; hai doc comment của `packages/db/src/customers.ts` nói "stage snapshot của domain". Tài liệu thiết kế / golden: PR #804 đổi tên (xem RESOLVED, T-286 phần tài liệu); PR #805 đổi `snapshotStage` thành `stageAtEndOfDay`.
  - DR6-66 (deep review lượt 1), phần `db` / `domain`: bỏ `getAppointment` (kèm `isCustomerLive`), `getPolicy`, `getTeam`, `getPerson`, `markKycVersionMaterial`, bí danh `export { liveCustomer }` của `packages/db/src/customers.ts` và `monthToDate` (`packages/domain/src/period.ts`); test đọc lại qua `byId(list*)` (`packages/db/src/test-support.ts`).
  - DR6-67 (deep review lượt 1), phần `db`: `updateRow`, `findRow` / `liveRow` (một truy vấn prepared theo id cho mỗi bảng) và `lastSeq` ở `packages/db/src/common.ts` thay năm `update<X>Row`, các bản `find` / `live<X>` và bốn câu "seq lớn nhất theo KH" (`stage_transitions`, `kyc_notes`, `kyc_facts`, `ai_analyses`). `kyc_versions` giữ `seq` của dòng phiên bản mới nhất mà `save` vốn đã đọc (`packages/db/src/kyc.ts`), cùng giá trị `MAX(seq)`; review chấp nhận. Dữ liệu seed (demo và tải nhỏ có Thùng rác) trùng từng byte trước / sau.

---

# Issue #776 — T-287: packages/db: tham chiếu nhân sự, Thùng rác / Dọn sạch, đếm RF, seed và test

Trạng thái: CLOSED · nhãn: type:task, risk:high, ready-for-agent

##### Mục tiêu

Làm chặt danh sách cột trỏ tới nhân sự, bớt việc thừa của Thùng rác / Dọn sạch, sửa phép đếm RF, làm seed và test chắc hơn.

1. **`PERSON_REFERENCES`:**
   - tên kind thành một hằng (`PERSON_REFERENCE_KINDS`), dùng ở SQL, đếm theo kind và luật nhập 5;
   - `usageCounts` ném khi gặp kind lạ (hoặc `isPersonInUse` đếm tổng mọi tham chiếu sống);
   - câu truy vấn sang module riêng, `schema.ts` giữ comment trỏ tới;
   - câu hứa ở schema và `CLAUDE.md` của `db` nói đủ các bước khi thêm cột.
2. **Mở DB:**
   - comment `enableConnectionPragmas` nêu ngoại lệ của bảng chỉ-thêm (TR-11 / D11);
   - gộp hai khối `try/catch sqlite.close()` của `openDatabase`;
   - test "runs the triggers of the rows REPLACE removes…" đổi tên theo điều nó kiểm, hoặc bỏ.
3. **Thùng rác / Dọn sạch:**
   - `refs` chỉ đọc id mà bản ghi xóa trỏ tới, không đọc cả ba bảng mỗi lần;
   - chỉ mục từng phần cho lịch đã xóa / `rescheduled_from_id` để `KEPT_APPOINTMENTS` không quét cả bảng (migration mới qua `pnpm db:generate`).
4. **Đếm RF:** đếm `COUNT(DISTINCT t.appointment_id)`, khớp định nghĩa "cuộc hẹn".
5. **Hai mục đưa lại từ ACCEPTED (Owner 23/10):**
   - `liveAppointmentsOf` lọc trong SQL (MET, ngày ≥ ngày chuyển nhóm, lịch chưa có chuyển nhóm);
   - KH đã xóa trùng tên trong `inTrash` (hộp 9b) phân biệt được, vd. kèm mã KH.
6. **Seed:**
   - `seedDemoData` kiểm quy mô trước khi chạy (≥ 1 team, ≥ 1 RE, `meetingDays` tăng dần);
   - bộ test bất biến của seed có ca cho bản ghi đã xóa.
7. **Test:**
   - test migration `ai_analyses` dựng DB cũ bằng `MIGRATIONS.filter` thay `DROP INDEX` theo tên;
   - helper cho ba ca `raw_output`;
   - `rescheduledFromFile` gọi `deleteInFile`;
   - ca E7 phía "trước ngày" của khôi phục cuộc gặp;
   - helper lật byte khóa chỉ mục dùng chung giữa test `db` và test app, hoặc ghi lý do giữ;
   - `randomText` dùng chung giữa test `db` và test `domain`, hoặc ghi lý do giữ.
8. **Ba mục của review #801 (Owner 24/10 gộp vào đây):**
   - một helper "dòng có hay mã lỗi" cạnh `liveRow` ở `common.ts` cho năm lệnh `restore*` (`team.ts` ×2, `customers.ts`, `policies.ts`, `appointments.ts`), thay cặp `findRow` + `throw` lặp lại;
   - đổi tên `snapshotStage` (`test-support.ts`, gần trùng `stageSnapshot` của domain mà nó gọi) và kiểu `Tracked` (`common.ts`) cho nói đúng điều chúng là;
   - comment của `lastSeq` (`common.ts`): Dọn sạch xóa hẳn chuyển nhóm đã rút của KH còn sống, nên `seq` đó có thể được cấp lại; câu "never gives one twice" chỉ đúng với xóa mềm.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Issue này gom các mục OPEN gắn **[T-287]**:
- review #742 (sáu mục), #539 (`refs`), #709 (`KEPT_APPOINTMENTS`), #541 (`counts.ts`), #566 (seed), #630 (test migration), #738 (`raw_output`), #740 (ca E7), #674 (lật byte), #686 (`randomText`), #184 (`openDatabase`);
- hai mục đưa lại từ ACCEPTED: `liveAppointmentsOf` (#667), `inTrash` (#669);
- ba mục của review #801 (T-286): không Issue nào của đợt được sửa đủ các file đó, Owner 24/10 chọn gộp vào T-287 và thêm `common.ts`, `policies.ts`, `appointments.ts`, `test-support.ts` vào danh sách file.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-287]
- `packages/db/CLAUDE.md` (migration "dựng lại bảng", trigger của `0011`, `PERSON_REFERENCES`)
- `docs/design/phase-3-du-lieu.md` §6 (luật nhập 5); `docs/design/phase-6-hoan-thien.md` §4.2 (TR-5, TR-11, D11)
- `packages/db/src/{schema.ts,team.ts,backup-validation.ts,database.ts,trash.ts,purge.ts,counts.ts,customers.ts,seed.ts,migrations.ts,common.ts,policies.ts,appointments.ts,test-support.ts}`
- `packages/db/src/{database.test.ts,trash.test.ts,purge.test.ts,team.test.ts,seed-invariants.test.ts,ai-analyses.test.ts,backup.test.ts,counts.test.ts}`; `packages/domain/src/text.test.ts`; `apps/desktop/src/data/app-data.test.ts`
- `apps/desktop/src/routes/team/team-view.ts` (`inUseHelp`, câu 9b)

##### File / thư mục được phép sửa

- `packages/db/src/{schema.ts,person-references.ts (mới),team.ts,backup-validation.ts,database.ts,trash.ts,purge.ts,counts.ts,customers.ts,seed.ts,migrations.ts,index.ts}` + test của chúng
- `packages/db/src/{common.ts,policies.ts,appointments.ts,test-support.ts}` + test của chúng: chỉ cho mục 8 (review #801, Owner 24/10)
- `packages/db/migrations/**` (sinh bằng `pnpm db:generate`)
- `packages/db/CLAUDE.md`
- `packages/domain/src/text.test.ts`, `apps/desktop/src/data/app-data.test.ts`
- `apps/desktop/src/routes/team/team-view.ts` + test, `apps/desktop/src/i18n/vi.ts` (nếu chữ 9b đổi)

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-287]**: gộp. Mục khác trùng file để lại cho Issue ghi ở nhãn, vd.:
- `backup-validation.ts`: T-291 (luật nhập mới);
- `customers.ts`, `appointments.ts`: T-296 (cờ E20);
- `common.ts`: T-291 (`optionalText`);
- `seed.ts`: T-285 (số ngày).

Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Dữ liệu giả lập (R2-02): migration chỉ thêm chỉ mục, không đổi dữ liệu.
- Một danh sách cột trỏ tới nhân sự như `packages/db/CLAUDE.md` hứa; thêm cột thì test chỉ ra mọi chỗ phải sửa.

##### Test chấp nhận

- [ ] Thêm vào `PERSON_REFERENCES` một dòng kind mới mà không thêm field / kind ở luật nhập 5 → test đỏ (đột biến ghi trong PR).
- [ ] `listTrash` khi Thùng rác trống không đọc bảng teams / people / customers. Query plan của `KEPT_APPOINTMENTS` dùng chỉ mục mới. Số đo `listTrash` / `previewPurge` trên dữ liệu tải (trước / sau) ghi trong PR.
- [ ] Migration mới: test mở DB cũ có dữ liệu; `pnpm db:generate` không còn diff.
- [ ] Hai chuyển nhóm RF cùng một cuộc hẹn (dựng tay) đếm 1 RF.
- [ ] `seedDemoData` với `teams: 0` kèm `trash: true` ném lỗi rõ, không `TypeError`.
- [ ] Ca E7 "trước ngày": cuộc gặp 05/10 đã xóa, chuyển tay N2 ngày 03/10 → khôi phục được, `stageKept`, không thêm chuyển nhóm.
- [ ] Hộp 9b: hai KH đã xóa trùng tên hiện phân biệt được.
- [ ] Mục 8: năm lệnh `restore*` với id không có vẫn ra đúng mã cũ (`TEAM_NOT_FOUND`, `PERSON_NOT_FOUND`, `CUSTOMER_NOT_FOUND`, `POLICY_NOT_FOUND`, `APPOINTMENT_NOT_FOUND`), không có `params`.

Ước lượng: ≈ 150 dòng SP (mục 8 ≈ 20) + ≈ 360 dòng test (migration sinh tự động không tính).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-287] đã sửa sang RESOLVED

##### Rủi ro

risk:high

##### Bị chặn bởi

#775 (T-286)

## PR #805 — fix: tie person references to one typed list, read the trash by id, index deleted appointments (T-287)

Trạng thái: MERGED · merge 2026-10-24T06:35:05Z · commit `597c63275f59c9bdfefa9cbd40cefa4f9b09a8f6` · nhánh `task/T-287-db-references-trash-seed` · nhãn: risk:high

Closes #776

#### Thay đổi

1. **Một danh sách tham chiếu nhân sự** (`packages/db/src/person-references.ts`, mới; review #742, DR6-114):
   - `PERSON_REFERENCE_KINDS` (5 kind) và `PERSON_REFERENCES` sinh từ một bảng `Record<PersonReferenceKind, …>`: mỗi kind đúng một nhánh `UNION ALL`, tên cột nêu một lần ở đầu CTE `refs (kind, person_id, appointment_id, customer_id, live)`. `schema.ts` chỉ giữ comment trỏ tới (ở `people`).
   - `team.ts`: `USAGE_FIELDS: Record<PersonReferenceKind, keyof PersonCounts>`; `usageCounts` ném `Error` khi gặp kind không field nào đếm; `isPersonInUse` đếm mọi kind thay vì tự cộng 5 field.
   - Luật nhập 5 (`backup-validation.ts`): `POINTS_TO: Record<PersonReferenceKind, 're' | 'supporting'>`; `pointedTo` nhận danh sách kind và tự đặt nháy (`quotedKinds`), như danh sách vai trò. Kind không có trong `POINTS_TO` vẫn được kiểm như người hỗ trợ, không bị bỏ qua.
   - Câu hứa ở `schema.ts`, đầu `person-references.ts` và `packages/db/CLAUDE.md` nêu đủ các bước khi thêm cột: kind và dòng của nó, field đếm nó ở `PersonUsage` (kèm dòng ở 9b), vai trò ở luật 5.
   - Test mới `person-references.test.ts` thay test so hai danh sách viết tay ở `team.test.ts`:
     - đọc mọi khóa ngoại trỏ `people` từ schema, mỗi cột một người riêng trong dữ liệu;
     - mỗi giá trị của cột phải ra đúng một tham chiếu, cùng một kind;
     - người của mỗi kind không xóa được, và luật 5 bắt khi người đó bị xóa trong file.

     Thêm cột vào schema mà danh sách chưa đọc thì cột hiện là một khóa mang `[]`, nên chỉ sửa kỳ vọng thì không xanh được.
2. **Mở DB** (`database.ts`; #184, review #742):
   - hai khối `try/catch sqlite.close()` thành một (phần dựng `Database` tách ra `connect`);
   - comment `enableConnectionPragmas` nêu ngoại lệ TR-11 / D11;
   - bỏ test "runs the triggers of the rows REPLACE removes…" của `database.test.ts`: nó chỉ đọc `PRAGMA recursive_triggers`. Hành vi đã có test ở `purge.test.ts` "refuse to replace those of a live customer, as the file is opened and after it was exported" (chạy cả sau `db.export()`).
3. **Thùng rác / Dọn sạch:**
   - `trash.ts` (#539): đọc dòng đã xóa của năm bảng trước, rồi `refs` chỉ đọc theo id các KH / nhân sự / team mà những dòng đó trỏ tới: mỗi bảng một câu `json_each`, không câu nào khi không có id. Thùng rác trống không đọc tên nào.
   - Migration `0012_trash_lookups` (`pnpm db:generate`; chỉ thêm chỉ mục, không đổi dữ liệu): `appointments_deleted` (`deleted_at`, `WHERE deleted_at IS NOT NULL`) và `appointments_rescheduled_from` (`WHERE rescheduled_from_id IS NOT NULL`).
   - `KEPT_APPOINTMENTS` (`purge.ts`; #709, CL3-A29): bước gốc đi từ lịch đã xóa bằng `CROSS JOIN` (SQLite luôn để bảng bên trái làm vòng ngoài). Plan, kiểm ở test `database.test.ts`: `SEARCH f USING INDEX appointments_deleted` → `SEARCH a USING INDEX appointments_rescheduled_from (rescheduled_from_id=?)`. Đo riêng câu này trên dữ liệu tải, cùng kết quả:
     - không chỉ mục: ≈ 4,5 ms (CL3-A29);
     - có chỉ mục, để planner tự chọn: 0,83 ms (`SCAN a USING INDEX appointments_rescheduled_from`);
     - `CROSS JOIN`: 0,06 ms.
   - Comment của `purgeTrash` (cột không chỉ mục) và của `keptRecords` (bỏ số 4,5 ms cũ) sửa theo.
4. **Đếm RF** (`counts.ts`, #541): đếm cuộc hẹn RF khác nhau theo `appointment_id`; luật RF vẫn là `isRfTransition` của domain, không chép vào SQL.
5. **Hai mục đưa lại từ ACCEPTED:**
   - `customers.ts` (#667): `liveAppointmentsOf` → `unmovedMeetingsFrom`, lọc trong SQL: `MET`, ngày ≥ ngày chuyển nhóm, khác lịch của chính chuyển nhóm, không có chuyển nhóm sống. `meetingKeepingMove` vẫn là luật duy nhất và vẫn kiểm đủ điều kiện, nên hành vi không đổi; các test T-232 / H·CL-F3 giữ nguyên, xanh.
   - Hộp 9b (#669): `PersonUsage.inTrash` thành `{ name, code }[]` (sắp theo tên như màn, trùng tên thì theo mã); `team-view.ts` thêm mã KH chỉ cho tên trùng, khóa mới `person.inUseTrashCoded` = `{name} ({code})`.
     - Câu Thùng rác không có trong mockup 9b (chữ của T-250); Issue ghi "vd. kèm mã KH". E2E `team.spec.ts` dùng tên không trùng nên không đổi.
     - Kiểm trên bản web (`pnpm dev:web`): hai KH "Trần Thị Lan" có lịch Dự kiến của RE Võ Quốc Lan, xóa cả hai, mở Xóa nhân sự → "Có cả dữ liệu của KH đã xóa: Trần Thị Lan (K-4T8B), Trần Thị Lan (K-JJHV). …".
6. **Seed** (`seed.ts`, #566):
   - `seedDemoData` kiểm quy mô trước mọi việc: ≥ 1 team, ≥ 1 RE mỗi team, số nguyên ≥ 0, `meetingDays` từ ít đến nhiều. Sai thì ném `Error` nêu rõ (lỗi của nơi gọi, không phải `DbError` cần i18n).
   - `seed-invariants.test.ts` thêm hai ca cho bản ghi đã xóa:
     - mỗi chuyển nhóm đã rút là của một cuộc gặp đã xóa cùng KH, cùng ngày, cùng nhóm sau, rút đúng lúc xóa (D7);
     - dữ liệu, kể cả bản ghi đã xóa, qua mọi luật nhập (`validateBackupValues`, `validateBackupInvariants`).
   - `DEMO_HASH` không đổi.
7. **Test** (#630, #738, #740, #674, #686, review #742):
   - `ai-analyses.test.ts` "the ai_analyses migration": DB cũ dựng bằng `MIGRATIONS.filter((m) => m.id < first)`, rồi chép vào đó các dòng của DB đã seed (bảng và cột mà DB cũ có, helper `copyRows`), thay `DROP INDEX` theo tên. Không seed thẳng trên DB cũ được vì seed ghi phân tích AI.
   - `ai-analyses.test.ts`: helper `keptRawOutputs` cho ba ca `raw_output`; ca NUL nay cũng kiểm qua xuất / nhập.
   - `purge.test.ts`: `rescheduledFromFile` gọi `deleteInFile`; test 0011 dựng DB cũ theo tag `0011_trash_purge` thay `slice(0, -1)` (sai từ khi có migration sau).
   - `trash.test.ts`: ca E7 "trước ngày": lịch 05/10 đã xóa, chuyển tay N2 ngày 03/10 → khôi phục được, `stageKept`, không thêm chuyển nhóm. Đột biến `> 0` → `!== 0` ở `appointments.ts:299` nay đỏ đúng ca này.
   - Lật byte khóa chỉ mục (`database.test.ts` / `app-data.test.ts`) và `randomText` (`backup.test.ts` / `text.test.ts`): **giữ hai bản**, lý do ghi ở comment. Package chỉ export `index.ts`, test của package khác không import được file con (domain không import gì); hai `randomText` khác bảng ký tự theo điều mỗi test dò.
8. **Ba mục review #801:**
   - `requireRow(db, table, id, code)` ở `common.ts` (dòng có, kể cả đã xóa, hoặc mã lỗi; `liveRow` dùng lại) cho năm lệnh `restore*`;
   - đổi tên `Tracked` → `SoftDeletable`, `snapshotStage` → `stageAtEndOfDay`;
   - comment `lastSeq` nói đúng ca Dọn sạch cấp lại `seq`.

**Test đổi vì migration mới / kích thước trang:** `purge.test.ts` "gives the file back the room of what it purged…". Với hai chỉ mục mới, file của 11a có 42 trang cả trước lẫn sau VACUUM (bỏ hai chỉ mục thì còn 40): phần bị dọn không đủ một trang sau khi xếp lại. Test thêm cho một KH bị dọn một ghi chú dài hơn một trang, để phép so kích thước luôn có nghĩa; kiểm "không còn chữ bí mật" giữ nguyên.

**File ngoài danh sách của Issue:**
- `packages/db/src/ai-analyses.test.ts` (test của `ai-analyses.ts`, không có trong danh sách): mục 7 của Issue nêu đích danh hai thay đổi ở file này (test migration, helper `raw_output`), và file có trong "Tài liệu cần đọc".
- `appointments.test.ts`, `customers.test.ts`: chỉ đổi tên `stageAtEndOfDay` (mục 8).

**Số đo** (Node, Home PC, dữ liệu tải `LOAD_SCALE`, neo 2026-10-12, seed 6, trung vị 40 lần; script tạm ngoài repo):

| | Trước (`main` `931b9b8`) | Sau |
|---|---|---|
| `listTrash`, 113 dòng | 24,7 ms | 17,9 ms |
| `previewPurge` | 5,7 ms | 0,7 ms |
| `listTrash`, Thùng rác trống (sau `purgeTrash`) | 3,3 ms | 0,3 ms |
| `previewPurge`, Thùng rác trống | 1,4 ms | 0,3 ms |

Kết quả `listTrash` / `previewPurge` giống hệt trước và sau (sha256 JSON `3d750dec…` / `0bfbf5f9…`). Câu đếm của `personUsage` dạng CTE mới: cùng plan, cùng kết quả, 1,81 so với 1,79 ms.

**Cỡ** (không tính file sinh: `0012_trash_lookups.sql`, `meta/0012_snapshot.json`, `meta/_journal.json`, khối codemap của `CLAUDE.md`):
- SP +283 / −137;
- test +412 / −120 (`person-references.test.ts` 96 dòng, test migration 0012, `copyRows`);
- tổng ≈ 950, vượt ngưỡng ~800 (Issue ước ≈ 150 SP + 360 test): 8 mục và 18 ghi chú sổ trong một Issue. PR đã `risk:high` nên mức review không đổi; ghi vào bảng PR vượt ngưỡng của G7.

#### Test chấp nhận

- [x] Thêm vào `PERSON_REFERENCES` một kind mới mà không thêm field / vai trò ở luật 5 → đỏ. Đột biến M1: thêm `'lead'` vào `PERSON_REFERENCE_KINDS` và `ROWS`, đọc lại `outcome_reviewer_id`.
  - `pnpm --filter @p2c/db typecheck`: 2 lỗi TS2741, ở `team.ts` (`USAGE_FIELDS` thiếu `lead`) và `backup-validation.ts` (`POINTS_TO` thiếu `lead`).
  - vitest: 7 test đỏ ở 3 file: `person-references.test.ts` 2 (cột `outcome_reviewer_id` đọc hai lần; `usageCounts` ném), `team.test.ts` 2 và `appointments.test.ts` 3 (`usageCounts` ném).
  - Test luật 5 của `person-references.test.ts` vẫn xanh **có chủ ý**: kind không có trong `POINTS_TO` được kiểm như người hỗ trợ. Vì vậy thiếu "kind ở luật nhập 5" do kiểu báo (TS2741), không do test.
- [x] `listTrash` khi Thùng rác trống không đọc bảng teams / people / customers (ngoài ba câu tìm dòng đã xóa): `trash.test.ts` "reads the teams, people and customers only for their deleted rows while the trash is empty" (đỏ với `refs` cũ). Query plan `KEPT_APPOINTMENTS` dùng chỉ mục mới: `database.test.ts` "adds the lookups of Thùng rác to a database with data, which the purge starts from (CL3-A29)". Số đo ở trên.
- [x] Migration mới: cùng test trên mở DB cũ (phiên bản 12) có dữ liệu, giữ nguyên dòng, `previewPurge` như trước, `foreign_key_check` rỗng. `pnpm db:generate` chạy lại: "No schema changes, nothing to migrate", prettier không đổi file nào.
- [x] Hai chuyển nhóm RF cùng một cuộc hẹn (dựng tay) đếm 1 RF: `counts.test.ts` "counts one RF for a meeting with two RF transitions, made by hand" (code cũ ra 2).
- [x] `seedDemoData` với `teams: 0` kèm `trash: true` ném lỗi rõ, không `TypeError`: `seed.test.ts` "refuses a scale without a team or an RE, or with meeting days the wrong way round, writing nothing" (cả `resPerTeam: 0`, `meetingDays: [3, 2]`, `customersPerRe: 1.5`; DB không đổi).
- [x] Ca E7 "trước ngày": `trash.test.ts` "E7: restores it the same once the customer reached that stage before its day".
- [x] Hộp 9b: `team.test.ts` "names two customers of one name in the trash apart, by their codes"; `team-view.test.ts` "tells two customers of one name apart by their codes, also one of them only counted"; kiểm trên bản web ở mục 5.
- [x] Mục 8: `trash.test.ts` "has each restore command refuse a record that is not there, by the code of its kind" (năm mã cũ, không có `params`).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `2c92361`, 34 mục "Trùng file":

- L12 `backup-validation.ts` (S-1 / D-1, hash KYC khi nhập): để lại, của T-291 #780.
- L16 `database.ts` (#184, hai `try/catch sqlite.close()`): **đã sửa** (mục 2).
- L52 `vi.ts` (dấu `:` của `KycExtraction.tsx`): để lại, của T-297 #786.
- L59 `schema.ts` (`AI_ANALYSIS_NO_MODEL`): để lại, của T-288 #777.
- L60 `schema.ts` (hai hằng 20 000): để lại, của T-288 #777.
- L68 `trash.ts` (`refs` đọc cả ba bảng): **đã sửa** (mục 3).
- L71 `counts.ts` (`rf` đếm chuyển nhóm): **đã sửa** (mục 4).
- L73 `vi.ts` (`trash.customer.with` dùng slot `{count}`): để lại, của T-296 #785.
- L81 `seed.ts` (`fillTrash` dùng `res[0]!`): **đã sửa** (mục 6).
- L82 `seed-invariants.test.ts` (chỉ kiểm bản ghi đang dùng): **đã sửa** (mục 6).
- L96 `ai-analyses.test.ts` (test migration gỡ ngược bằng `DROP INDEX`): **đã sửa** (mục 7).
- L109 `appointments.ts` (câu `TRANSITION_BEFORE_LATEST` của ca E7 ở `trash-view.ts`): để lại, của T-296 #785; luật E7 không đổi.
- L114 `database.test.ts` / `app-data.test.ts` (lật byte chép hai nơi): **giữ hai bản, lý do ghi ở comment** (mục 7).
- L119 `common.ts` / `backup-validation.ts` (`optionalText` chỉ `trim()`): để lại, của T-291 #780.
- L121 `text.test.ts` (`randomText` chép hai nơi): **giữ hai bản, lý do ghi ở comment** (mục 7).
- L129 `purge.ts` / `trash.ts` (`KEPT_APPOINTMENTS` quét mọi lịch): **đã sửa** (mục 3).
- L140 `ai-analyses.test.ts` (ba ca `raw_output`): **đã sửa** (mục 7).
- L142 `appointments.ts` / `trash.test.ts` (E7 phía "trước ngày"): **đã sửa** (mục 7).
- L145 `schema.ts` / `CLAUDE.md` / `team.ts` / `backup-validation.ts` / `team.test.ts` (Shotgun Surgery, DR6-114): **đã sửa** (mục 1).
- L146 `schema.ts` / `team.ts` / `backup-validation.ts` (tên kind là chuỗi thô): **đã sửa** (mục 1).
- L147 `schema.ts` (`PERSON_REFERENCES` nằm ở schema): **đã sửa** (mục 1).
- L148 `database.ts` / `schema.ts` (comment `enableConnectionPragmas`): **đã sửa** (mục 2).
- L149 `database.test.ts` / `purge.test.ts` (test REPLACE chỉ đọc pragma): **đã sửa**, bỏ test (mục 2).
- L150 `purge.test.ts` (`deleteInFile` lặp câu UPDATE): **đã sửa** (mục 7).
- L154 `team-view.ts` (JSDoc của `inUseHelp` còn "come back first"): để lại, của T-299 #788; PR chỉ sửa thân hàm, không đụng JSDoc đó.
- L158 `vi.ts` (`policies.editLabel` thiếu trạng thái): để lại, của T-296 #785.
- L170 `vi.ts` (`outcome.caseSizeRead` dưới 1 triệu): để lại, của T-298 #787.
- L196 `team.ts` / `customers.ts` / `policies.ts` / `appointments.ts` / `common.ts` (năm `restore*` lặp): **đã sửa** (mục 8).
- L197 `test-support.ts` / `common.ts` (`snapshotStage`, `Tracked`): **đã sửa** (mục 8).
- L198 `common.ts` / `purge.ts` (comment `lastSeq`): **đã sửa** (mục 8).
- L202 `backup-validation.ts` (DR6-25, `zod/mini`): để lại, của T-292 #781.
- L206 `vi.ts` (mã chết phần app): để lại, của T-301 #790.
- L214 `customers.ts` (`liveAppointmentsOf`): **đã sửa** (mục 5).
- L215 `team.ts` (`inTrash` chỉ nêu tên): **đã sửa** (mục 5).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (120 file, 3 631 test, coverage đạt ngưỡng)
- [x] Không thêm dependency ngoài ADR-0005; không chạm Rust / `package.json` / cấu hình build nên không cần `build-exe`
- [ ] E2E: chạy ở CI (không chạy `pnpm e2e` ở local)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:high`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-287 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #184, #539, #541, #566, #630, #667, #669, #674, #686, #709, #738, #740, #742 và #801 phần `db` — T-287 (#776, PR #805, `REVIEW: PASS` @`2c92361`):
  - #184, `packages/db/src/database.ts` (`openDatabase`): một khối `try/catch sqlite.close()`; phần dựng `Database` tách ra `connect`.
  - #539, `packages/db/src/trash.ts` (`refs`): đọc dòng đã xóa của năm bảng trước, rồi chỉ đọc theo id các KH / nhân sự / team mà chúng trỏ tới (`rowsById`, mỗi bảng một câu `json_each`, không câu nào khi không có id). Thùng rác trống không đọc tên nào (test ở `packages/db/src/trash.test.ts`).
  - #541, `packages/db/src/counts.ts` (`rf`): đếm cuộc hẹn RF khác nhau theo `appointment_id`, khớp `rfMatcher` của domain; luật RF vẫn là `isRfTransition`, không chép vào SQL.
  - #566, `packages/db/src/seed.ts` (`fillTrash` dùng `res[0]!`): `seedDemoData` kiểm quy mô trước mọi việc (`assertScale`: ≥ 1 team, ≥ 1 RE mỗi team, số nguyên ≥ 0, `meetingDays` từ ít đến nhiều); sai thì ném `Error` nêu rõ, DB không đổi.
  - #566, `packages/db/src/seed-invariants.test.ts`: hai ca cho bản ghi đã xóa (chuyển nhóm đã rút khớp cuộc gặp đã xóa cùng KH, ngày, nhóm, lúc xóa, D7; dữ liệu kể cả bản ghi đã xóa qua mọi luật nhập).
  - #630, `packages/db/src/ai-analyses.test.ts` (test migration `ai_analyses`): DB cũ dựng bằng `MIGRATIONS.filter((m) => m.id < first)` rồi chép dòng của DB đã seed vào (`copyRows`), thay `DROP INDEX` theo tên.
  - #667, `packages/db/src/customers.ts` (`liveAppointmentsOf`): thành `unmovedMeetingsFrom`, lọc trong SQL (MET, ngày ≥ ngày chuyển nhóm, khác lịch của chính chuyển nhóm, không có chuyển nhóm sống); `meetingKeepingMove` vẫn là luật duy nhất, hành vi không đổi.
  - #669, `packages/db/src/team.ts` (`inTrash`): `PersonUsage.inTrash` thành `{ name, code }[]`; hộp 9b (`apps/desktop/src/routes/team/team-view.ts`) thêm mã KH cho tên trùng (khóa `person.inUseTrashCoded`).
  - #674, `packages/db/src/database.test.ts` / `apps/desktop/src/data/app-data.test.ts` (lật byte khóa chỉ mục): giữ hai bản, comment ghi lý do (package chỉ export `index.ts`, test app không import được file con của `db`).
  - #686, `packages/domain/src/text.test.ts` (`randomText`): giữ hai bản, comment ghi lý do (domain không import gì, không package nào export code test; bảng ký tự khác theo điều mỗi test dò).
  - #709, `packages/db/src/purge.ts` (`KEPT_APPOINTMENTS`): migration `0012_trash_lookups` thêm chỉ mục từng phần `appointments_deleted`, `appointments_rescheduled_from`; bước gốc đi từ lịch đã xóa bằng `CROSS JOIN`. Plan kiểm ở `packages/db/src/database.test.ts`; trên dữ liệu tải câu này từ ≈ 4,5 ms còn 0,06 ms.
  - #738, `packages/db/src/ai-analyses.test.ts` (ba ca `raw_output`): helper `keptRawOutputs`; ca NUL nay cũng kiểm qua xuất / nhập.
  - #740, `packages/db/src/appointments.ts` (`checkRestoreAppointment`, E7 "trước ngày"): ca ở `packages/db/src/trash.test.ts` (lịch 05/10 đã xóa, chuyển tay N2 ngày 03/10 → khôi phục được, `stageKept`, không thêm chuyển nhóm); đột biến `> 0` → `!== 0` nay đỏ.
  - #742, DR6-114 (`packages/db/src/schema.ts`, `packages/db/src/team.ts`, `packages/db/src/backup-validation.ts`, `packages/db/CLAUDE.md`): `PERSON_REFERENCES` (`packages/db/src/person-references.ts`, mới) sinh từ một bảng theo kind; `USAGE_FIELDS` (`team.ts`) và `POINTS_TO` (luật 5) là `Record` theo kind nên thiếu kind thì kiểu báo; `usageCounts` ném khi gặp kind lạ; `packages/db/src/person-references.test.ts` đọc mọi khóa ngoại trỏ `people` từ schema. Phần `ownsRecords`: xem mục review #805 ở OPEN.
  - #742, tên kind là chuỗi thô: hằng `PERSON_REFERENCE_KINDS`; `pointedTo` nhận danh sách kind và tự đặt nháy (`quotedKinds`).
  - #742, `PERSON_REFERENCES` nằm ở `packages/db/src/schema.ts`: sang `packages/db/src/person-references.ts`, `schema.ts` giữ comment trỏ tới.
  - #742, `packages/db/src/database.ts` (comment `enableConnectionPragmas`): nêu ngoại lệ TR-11 / D11.
  - #742, `packages/db/src/database.test.ts` (test "runs the triggers of the rows REPLACE removes…"): bỏ; hành vi giữ ở ca REPLACE của `packages/db/src/purge.test.ts`, chạy cả sau `export`.
  - #742, `packages/db/src/purge.test.ts` (`rescheduledFromFile`): gọi `deleteInFile`.
  - #801, năm lệnh `restore*`: `requireRow(db, table, id, code)` ở `packages/db/src/common.ts` (`liveRow` dùng lại); mã lỗi như cũ, không `params` (test ở `packages/db/src/trash.test.ts`).
  - #801, tên: `snapshotStage` → `stageAtEndOfDay` (`packages/db/src/test-support.ts`), `Tracked` → `SoftDeletable` (`packages/db/src/common.ts`).
  - #801, `packages/db/src/common.ts` (comment `lastSeq`): nói đúng ca Dọn sạch cấp lại `seq`.

---

# Issue #777 — T-288: packages/ai: hằng dùng chung với db, tách logic khỏi retry.ts, phạm vi export, version prompt trong test

Trạng thái: CLOSED · nhãn: type:task, risk:high, ready-for-agent

##### Mục tiêu

Sắp lại cấu trúc `packages/ai`: hằng dùng chung một nơi, chữ G5 tách khỏi logic, API công khai gọn, test không ghim version prompt rải rác.

1. **Hằng dùng chung với `db`:** tập "provider không có model / token" và giới hạn 20 000 ký tự đặt một nơi ở `@p2c/ai/schema`; `db` import lại (`AI_ANALYSIS_NO_MODEL`, `MAX_AI_RAW_OUTPUT`).
2. **Module chữ thử lại:** chỉ còn chữ G5. `checkAnswer` / `nextRetry` (lấy JSON + đếm lần thử) sang module riêng.
3. **Phạm vi export:** các hàm nội bộ mà ChatGPT web dùng chung với lần gọi OpenCode (`takeAnalysisInput`, `checkAnalysisAnswer`, `analysisOutcome`, `ANALYSIS_PROMPTS`, `MAX_RAW_OUTPUT`) sang module không re-export từ `index.ts`.
4. **`schemaDetail`:** message đặt ở nguồn schema (vd. `z.string().regex(FACT_CODE, '…')`), `detail` đọc `issue.message`. Chữ `detail` giữ đúng G5 §11.6.
5. **ChatGPT web:** `ownLine` bỏ `.replace(/\s+/gu, ' ')` thừa. NIT test: dùng `ZWSP` của test-support.
6. **Version prompt trong test:**
   - unit lấy từ `PROMPT_VERSIONS` / `<mode>Prompt.version`;
   - e2e dùng một hằng chung;
   - test so chữ prompt vẫn ghim nguyên văn (G5).
7. **DR6-66 / 67, phần ai:**
   - bỏ export `AI_LOCAL_ERROR_CODES` không ai import;
   - kiểu "lỗi AI có mã HTTP" (×5) và phép chép `httpStatus` / `serverMessage` (×3) thành một kiểu / helper.
8. ***Data Clumps* `customerId` + `kycVersionId`** (yêu cầu phân tích, dòng phân tích, phiên ChatGPT web) thành một kiểu (đưa lại từ ACCEPTED, Owner 23/10).

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Issue này gom các mục OPEN gắn **[T-288]**:
- review #455 (bốn mục ChatGPT web ở `ai` / `db`);
- review #698 (`schemaDetail`);
- review #766 (`ownLine`, `ZWSP`, version prompt);
- DR6-66 / 67 phần ai;
- *Data Clumps* (#455) đưa lại từ ACCEPTED.

Không đổi chữ nào của G5: không cần cổng.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-288]
- `packages/ai/CLAUDE.md` (ranh giới, `ai-schema-standalone`, coverage 100 %)
- `docs/design/phase-5-prompts.md` §5 (message thử lại), §11.6 (`detail` V1)
- `packages/ai/src/{schema.ts,run.ts,web.ts,prompts/retry.ts,validator.ts,errors.ts,index.ts,test-support.ts}`
- `packages/db/src/{schema.ts,ai-analyses.ts}`
- `apps/desktop/src/data/{ai-analysis.ts,ai-tauri.ts}`
- `e2e/fixtures.ts`, `e2e/customer-ai.spec.ts`, `e2e/customer-ai-web.spec.ts`, `e2e/full-cycle.spec.ts`
- DR6-66 / 67: `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §8.5

##### File / thư mục được phép sửa

- `packages/ai/src/**` (riêng `prompts/*.ts`: chỉ được dời logic ra khỏi `retry.ts`, không đổi chữ prompt), `packages/ai/CLAUDE.md`
- `packages/db/src/{schema.ts,ai-analyses.ts}` + test, `packages/db/CLAUDE.md`
- `apps/desktop/src/data/{ai-analysis.ts,ai-tauri.ts}` + test, `apps/desktop/src/routes/customers/ai-panel-view.test.ts`, `apps/desktop/CLAUDE.md`
- `e2e/{fixtures.ts,customer-ai.spec.ts,customer-ai-web.spec.ts,full-cycle.spec.ts}`
- Owner 24/10 thêm (phiên làm task: mục 2, 3, 7 đụng các file này): `tools/eval-ai-core.mjs` + `tools/eval-ai-core.test.mjs` (import `checkAnswer`, `takeAnalysisInput`, `checkAnalysisAnswer`, `ANALYSIS_PROMPTS` theo đường mới), `apps/desktop/src/routes/customers/ai-panel-view.ts` (`ANALYSIS_PROMPTS[mode].version`), `apps/desktop/src/routes/ai-error-view.ts` + test (2 / 5 kiểu "lỗi AI có mã HTTP", 1 / 3 phép chép `httpStatus` / `serverMessage`)
- Owner 24/10 thêm sau review PR #812 (test chấp nhận "Đột biến trong PR": đổi version prompt làm đỏ `DEMO_HASH`): `packages/db/src/seed.test.ts`, để hash dữ liệu demo không đổi theo giá trị `prompt_version` (`seed.test.ts:251` đã ghim `promptVersion` = `PROMPT_VERSIONS[mode]`)

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-288]**: gộp. Mục khác trùng file để lại cho Issue ghi ở nhãn, vd.:
- `text-match.ts`, `extract-json.ts`, `run.ts` (`assistant` rỗng): T-290;
- §11.8: T-291;
- Mock: T-289.

Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- `@p2c/db` vẫn chỉ import đúng `@p2c/ai/schema` (rule `db-only-on-domain-and-ai-schema`).
- Không đổi schema SQL (hằng TS, không migration).
- `prompts.test.ts` xanh không sửa.

##### Test chấp nhận

- [ ] `retry.ts` chỉ còn chữ G5; test so chữ prompt không đổi.
- [ ] `index.ts` không re-export các hàm nội bộ ở mục 3 (codemap của `packages/ai/CLAUDE.md` cho thấy).
- [ ] Đột biến trong PR: đổi version một prompt chỉ cần sửa file prompt, golden và một hằng; unit / e2e khác không phải sửa.
- [ ] `detail` của V1 đúng chữ G5 §11.6 (test hiện có không đổi kỳ vọng); thêm một `regex` mới ở schema không làm `detail` sai.
- [ ] Một định nghĩa cho giới hạn 20 000 và tập provider không model (rg trong PR).

Ước lượng: ≈ 150 dòng SP + ≈ 150 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-288] đã sửa sang RESOLVED

##### Rủi ro

risk:high

##### Bị chặn bởi

#776 (T-287)

## PR #812 — refactor: share the AI analysis limits with db, narrow the API of ai, read more questions in the Mock (T-288)

Trạng thái: MERGED · merge 2026-10-24T16:58:17Z · commit `a5ff382ac7ea0a1dccae354a5eed5c115095fd87` · nhánh `task/T-288-ai-structure` · nhãn: risk:high

Closes #777

#### Thay đổi

1. **Hằng dùng chung với `db`** (mục 1; L56, L57): `AI_ANALYSIS_NO_MODEL` (kiểu `readonly AiAnalysisProvider[]`) và `MAX_AI_RAW_OUTPUT` (20 000) chỉ định nghĩa ở `@p2c/ai/schema`.
   - `db` import lại cho hai CHECK của `ai_analyses` và `toRow`. `@p2c/db` không export hai hằng nữa vì không ai ngoài `db` dùng. SQL của CHECK giữ nguyên: `pnpm --filter @p2c/db db:generate` không sinh migration.
   - `ai` ghi `row` theo danh sách: `runAnalysis` dùng `AI_ANALYSIS_NO_MODEL.includes(provider) ? NO_MODEL : …` thay cho `mock`, `checkWebAnswer` dùng `...NO_MODEL`. `MAX_RAW_OUTPUT` của `run.ts` bỏ.
2. **`prompts/retry.ts` chỉ còn chữ G5 §5** (mục 2; L58): `RETRY_TEMPLATE`, `retryMessage`. `MAX_ATTEMPTS`, `CheckedAnswer`, `checkAnswer`, `lastAnswer`, `nextRetry` dời nguyên văn sang `src/attempts.ts` (mới).
3. **Phạm vi export** (mục 3; L59): `ANALYSIS_PROMPTS`, `takeAnalysisInput`, `checkAnalysisAnswer`, `AnalysisOutcome`, `analysisOutcome` cùng `EMPTY_RAW_OUTPUT` dời sang `src/analysis-steps.ts` (mới, `index.ts` không re-export).
   - `AnalysisOutcome` thành interface riêng, `AnalysisRow` (run.ts) kế thừa nó, nên không có import vòng (`no-circular` tính cả import kiểu).
   - App: chip 4e của `ai-panel-view.ts` đọc `webPromptVersion(mode)`, hàm mới của `web.ts`. Hàm này cũng dựng `prompt_version` của dòng ChatGPT web, nên cách ghép `<mode>@<n>+web@1` chỉ còn một chỗ.
   - `tools/eval-ai-core.mjs` và test của nó import `analysis-steps.ts` / `attempts.ts` theo đường file, như vẫn làm với `prompts/extraction.ts`.
4. **`schemaDetail`** (mục 4; L109):
   - Mẫu mã dữ kiện là `factCodeString = z.string().regex(FACT_CODE, 'sai định dạng, cần mã dữ kiện dạng F12')`, dùng ở `evidence` và mã của đầu vào. Union `value` của trích xuất mang message `'cần string, number hoặc boolean'`.
   - `schemaDetail`: nhánh `default` (refine, `invalid_format`…) đọc `issue.message`. Nhánh `invalid_union` tìm phương án mà giá trị đúng kiểu nhưng sai luật (lỗi đầu không phải `invalid_type`) và nêu luật đó; không có thì ghi `thiếu` / `sai kiểu` + message của union. Không còn giả định "union duy nhất là `value`" hay "mẫu duy nhất là mã dữ kiện".
5. **ChatGPT web** (mục 5; L146, L147): `ownLine` bỏ `.replace(/\s+/gu, ' ')`, vì `cleanText` đã gộp khoảng trắng và cắt hai đầu, còn bỏ tiền tố `^[\s>]*>` không tạo dãy khoảng trắng mới. `validator.test.ts:83`, `schema.test.ts:302`, `:304` dùng `ZWSP`.
6. **Version prompt trong test** (mục 6; L148):
   - Unit đọc `PROMPT_VERSIONS.<mode>` (cộng `WEB_WRAPPER.version` cho ChatGPT web): `run.test.ts` ×2, `web.test.ts` ×3, `ai-analysis.test.ts` ×2, `ai-panel-view.test.ts` ×1.
   - E2E đọc `PROMPT` của `e2e/fixtures.ts`, lấy từ `PROMPT_VERSIONS` của `packages/ai/src/schema.ts`, cộng `WEB_WRAPPER.version` của `packages/ai/src/web.ts` cho ChatGPT web như unit (lần đầu e2e import mã nguồn package; Playwright và `tsc -p e2e` nạp được). Để chữ của test chấp nhận "một hằng" là `PROMPT_VERSIONS`: một hằng chữ riêng trong e2e sẽ thành hằng thứ hai phải sửa mỗi đợt G5.
   - `pattern` (tagged template, cũng ở `fixtures.ts`) giữ nguyên các regex cũ, chỉ escape giá trị chèn vào (dấu `+` của `discovery@4+web@1`).
   - `prompts.test.ts` vẫn ghim chữ như G5 và không sửa.
7. **DR6-66 / 67 phần `ai`** (mục 7; L178, L181):
   - `AI_LOCAL_ERROR_CODES` không export nữa; nay là kiểu nội bộ `AiLocalErrorCode`.
   - Kiểu "lỗi AI có mã HTTP": `AiErrorDetails` (`httpStatus?`, `serverMessage?`) và `AiErrorResult` (+ `code`). Các chỗ dùng:
     - `Failed` của `run.ts` và nhánh `error` của `AnalysisOutcome` (app) là `AiErrorResult & { kind: 'error' }`;
     - `AiFailure` của `ai-error-view.ts` kế thừa `AiErrorDetails`, kiểu `Failed` riêng của file đó bỏ;
     - `AiError implements AiErrorResult`, tham số của constructor là `AiErrorDetails`.
   - Phép chép: `errorDetails(source)` giữ mã HTTP là số, câu là chuỗi, không có khóa cho cái thiếu. Ba chỗ dùng: `run.ts` (`attempt`), `ai-error-view.ts` (`aiFailure`), `ai-tauri.ts` (`aiError`, đọc thứ Rust gửi).
8. **Data Clumps** (mục 8; L186): `AnalysisSubject` (`customerId`, `kycVersionId`, ở `analysis-steps.ts`); `AnalysisRequest`, `AnalysisRow`, `WebSession`, `WebAnalysisRequest` kế thừa nó. Ba chỗ chép cặp dùng `subjectOf`. Dạng phẳng giữ nguyên (`recordAiAnalysis` nhận phẳng), nên app không đổi.
9. **Mock trích xuất: năm ghi chú của review #809 gắn [T-288]** (L169–L173; commit riêng `43b347c`):
   - `NOT_ASKED` dùng `[^\S\n]` thay `\s`: dòng sau mở bằng "Không / Chưa / Hay…" không còn hỏi cụm ở dòng trên ("\n" hết câu, N19d).
   - "hoặc" đọc như "hay" (`EITHER`, `NOT_ASKED`). `NOT_YET` nhận thêm "nha / hả / à" sau "chưa / không".
   - `GUESSED` thêm "à / hả" và "thì phải" đứng cuối câu, cùng "chắc" nói không chắc (`UNSURE`, xem mục 11).
   - `OF_SOMEONE_ELSE`: sau "của", chữ số lượng (`HOW_MANY`: một … mười, mấy, vài, các, những, chữ số) hay "người" cũng là người khác.
   - `NEGATED` thêm "bác bỏ", "phủ nhận".
   - Mỗi danh sách một hằng: `MARRY` (đuôi của `WITH_PARTNER`, phần thứ hai của `OWN_PARTNER`), `NOT_SO` (`NOT_ASKED`, `NOT_YET`), `OR` (`NOT_ASKED`, `EITHER`).
   - Test: 14 câu không đề xuất (mọi câu ví dụ của L169–L172), 8 câu giữ đề xuất. Bốn câu L169 trước đây mất đề xuất; bốn câu đối chứng ("chắc chắn", "vững chắc", "ạ", "của mình") đã xanh trước khi sửa. Mục 11 thêm 3 + 5 câu.
10. **Tài liệu**: `packages/ai/CLAUDE.md` cập nhật mã lỗi, `attempts.ts` / `analysis-steps.ts` (nội bộ) và trần dán của ChatGPT web. Phần chữ được viết gọn lại để bản đồ export đủ vừa giới hạn 8 000 ký tự của `codemap` (nay 7 903). Nếu không, codemap lùi về danh sách file và không còn cho thấy `index.ts` re-export gì (commit `a9cf497`). `packages/db/CLAUDE.md` chỉ đổi khối codemap.
11. **Sửa theo review `a9cf497` (REVIEW: CHANGES)**, commit `de7280a`:
   - [chặn] Đột biến version làm đỏ `DEMO_HASH`: Owner chọn hướng 2, thêm `packages/db/src/seed.test.ts` vào #777. `contentHash` tính `prompt_version` của `ai_analyses` là một dấu cố định, nên `DEMO_HASH` dời một lần ở PR này rồi không dời theo đợt G5 nữa. Version vẫn được ghim ở ca "has a few Mock analyses" (`promptVersion` = `PROMPT_VERSIONS[mode]`). Đột biến chạy lại: xem Test chấp nhận.
   - E2E: `PROMPT.webDiscovery` ghép `WEB_WRAPPER.version` (import `../packages/ai/src/web`) thay chữ `web@1` viết tay, nên đợt G5 đổi chữ bọc (`web@2`) cũng không phải sửa spec.
   - `AiFailed` đổi tên thành `AiErrorResult`, khỏi lẫn với `AiFailure` của app (mã `AiShownCode`, có `GENERAL`).
   - Mock, `GUESSED` (mục 9): "chắc" của từ nghĩa chắc chắn / vững không còn là phỏng đoán (`UNSURE`: "chắc chắn", "chắc ăn", "biết / nắm chắc", "vững / săn / rắn chắc"). Bốn câu review nêu ra lại đề xuất như `main`. Hai chỗ khác ý review:
     - "Cho chắc, KH đã kết hôn." vẫn không đề xuất: "cho chắc" là để kiểm lại ("hỏi lại cho chắc"), tức chưa chắc, nên giữ là phỏng đoán (hướng an toàn).
     - Chỉ thêm "biết / nắm chắc" thì "KH đã có 2 con, nhưng chưa biết chắc." sẽ ra Số con 2. Vì vậy "không / chưa / chẳng" đứng ngay trước "chắc" (có thể kèm "biết / nắm") là nghi ngờ, vẫn bỏ đề xuất. Luật này đóng luôn chỗ hở "KH đã kết hôn, nhưng không chắc chắn." (ra Đã kết hôn trên cả `main` lẫn head cũ). Đổi lại, nghi ngờ nằm ở mệnh đề khác cũng làm bỏ đề xuất, vd. "KH chưa nắm chắc tài chính, đã có 2 con." (`main`: Số con 2). Đây là hướng an toàn, như mọi phỏng đoán khác của `GUESSED`.
     - Test: 3 câu không đề xuất ("hỏi lại cho chắc", "không chắc chắn", "chưa biết chắc") và 5 câu giữ đề xuất (bốn câu của review, cộng "rắn chắc"). Năm câu giữ đề xuất cùng câu "không chắc chắn" đỏ trước khi sửa. Seed không có chữ "chắc", nên ghi chú RE của K5 không đổi.
   - Để lại:
     - `apps/desktop/src/i18n/vi.ts:228` ("20.000" viết trong câu): ngoài danh sách file, gộp vào lần chạm sau của `vi.ts`;
     - cỡ PR: ghi vào bảng của `phase-6.md` ở PR docs G7 **[G7]**.

**File ngoài danh sách ban đầu của Issue:** Owner duyệt thêm trong phiên 24/10 và mục "File được phép sửa" của #777 đã ghi lại:
- `tools/eval-ai-core.mjs` + test: mục 2, 3 dời các hàm này import;
- `apps/desktop/src/routes/customers/ai-panel-view.ts`: dùng `ANALYSIS_PROMPTS`;
- `apps/desktop/src/routes/ai-error-view.ts`: 2 / 5 kiểu và 1 / 3 phép chép của mục 7. Test của file này không đổi;
- `packages/db/src/seed.test.ts` (Owner thêm sau review, mục 11): `DEMO_HASH` không đổi theo `prompt_version`.

#### Test chấp nhận

- [x] `retry.ts` chỉ còn chữ G5: codemap `src/prompts/retry.ts — RETRY_TEMPLATE, retryMessage`. `prompts.test.ts` không sửa, xanh.
- [x] `index.ts` không re-export các hàm nội bộ của mục 3: codemap `src/index.ts — re-exports ./errors, ./models, ./adapter, ./extract-json, ./schema, ./mock-adapter, ./validator, ./input, ./run, ./settings, ./web`. Bốn hàm / hằng nằm ở `src/analysis-steps.ts`. `MAX_RAW_OUTPUT` không còn; giới hạn là `MAX_AI_RAW_OUTPUT` của `@p2c/ai/schema` (mục 1: `db` import nó), nên công khai như các hằng khác của module schema.
- [x] Đột biến trên `de7280a` (đã hoàn lại): đổi `discovery@4` → `discovery@5` ở `prompts/discovery.ts`, `PROMPT_VERSIONS` và ghim G5 của `prompts.test.ts`; cùng lúc đổi chữ bọc `web@1` → `web@2` ở `WEB_WRAPPER.version` và ghim G5 của `web.test.ts`.
  - `pnpm vitest run`: 3 785 / 3 785 xanh. Trước mục 11: 3 776 / 3 777, đỏ ca `DEMO_HASH` của `packages/db/src/seed.test.ts`.
  - E2E `customer-ai.spec.ts`, `customer-ai-web.spec.ts`, `full-cycle.spec.ts` trên bản build có `discovery@5` / `web@2`: 28 / 28 xanh, không sửa spec nào (20 chỗ kiểm version đọc `PROMPT`).
- [x] `detail` của V1 đúng chữ G5 §11.6: các test hiện có của `validator.test.ts`, `run.test.ts` ("names the right form of each V1 issue…") giữ kỳ vọng và xanh.
  - Đột biến (đã hoàn lại): thêm `.regex(/^[^"]*$/u, 'không có dấu nháy kép')` vào `quote` của trích xuất. `quote` `"Ý"` cho `detail` `không có dấu nháy kép`, mã `F01` vẫn ra chữ §11.6.
  - Cùng ca với `validator.ts` của `main` cho `sai định dạng, cần mã dữ kiện dạng F12`.
- [x] Một định nghĩa (`git grep` mã sản phẩm `packages/*/src`, `apps/desktop/src`): `packages/ai/src/schema.ts:47` `AI_ANALYSIS_NO_MODEL`, `:53` `MAX_AI_RAW_OUTPUT = 20_000`.

#### Ghi chú OPEN liên quan

- L41 [T-290] `phrase()` / mục trùng phần nhau (`text-match.ts`, `validator.ts`): để lại, thuộc T-290 (#779).
- L56 [T-288] tập provider không model / token: đã sửa (mục 1).
- L57 [T-288] hai hằng 20 000: đã sửa (mục 1).
- L58 [T-288] `retry.ts` Divergent Change: đã sửa (mục 2).
- L59 [T-288] phạm vi export của `run.ts`: đã sửa (mục 3).
- L63 [T-290] message `assistant` rỗng (`run.ts`): để lại, thuộc T-290.
- L83 [T-295] `startChatGptWeb` chụp `generation` (`ai-analysis.ts`): để lại, thuộc T-295 (#784).
- L109 [T-288] `schemaDetail`: đã sửa (mục 4).
- L110 [T-291] REJECTED lưu output lớn (§11.8): để lại, thuộc T-291 (#780), cần G2.
- L111 [T-291] nhập backup lưu nguyên chuỗi `output_json` (`ai-analyses.ts`): để lại, thuộc T-291.
- L145 [T-290] ngưỡng 50 ms của `isOwnMessage`: để lại, thuộc T-290.
- L146 [T-288] `ownLine`: đã sửa (mục 5).
- L147 [T-288] NIT `ZWSP`: đã sửa (mục 5).
- L148 [T-288] version prompt ghim chữ trong test: đã sửa (mục 6).
- L160 [T-291] `ownsRecords` (`packages/db/CLAUDE.md`): để lại, thuộc T-291; PR chỉ đổi khối codemap của file.
- L161 [T-291] `quotedKinds` / `list` (`packages/db/src/schema.ts`): để lại, thuộc T-291.
- L169 [T-288] `NOT_ASKED` qua dòng: đã sửa (mục 9).
- L170 [T-288] "hoặc", tiểu từ, phỏng đoán: đã sửa (mục 9).
- L171 [T-288] `OF_SOMEONE_ELSE` với chữ số lượng / "người": đã sửa (mục 9).
- L172 [T-288] "bác bỏ", "phủ nhận": đã sửa (mục 9).
- L173 [T-288] danh sách lặp của Mock: đã sửa (mục 9).
- L175 [T-292] DR6-25 `zod/mini` (`schema.ts`): để lại, thuộc T-292 (#781).
- L178 [T-288] `AI_LOCAL_ERROR_CODES`: đã sửa (mục 7).
- L181 [T-288] kiểu / phép chép lỗi HTTP: đã sửa (mục 7).
- L186 [T-288] Data Clumps `customerId` + `kycVersionId`: đã sửa (mục 8).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (Home PC) trên `de7280a`: 3 785 test, đạt ngưỡng coverage (`packages/ai` 100 %).
- [x] `pnpm e2e` ở local trên `de7280a`: 273 / 273 xanh. Mọi spec nạp `fixtures.ts` (nay kéo thêm `web.ts`), nên chạy đủ bộ.
- [x] `pnpm --filter @p2c/db db:generate`: không sinh migration (SQL của CHECK không đổi).
- [x] Không thêm dependency ngoài ADR-0005 (không đụng `package.json`, Cargo, cấu hình build: không cần `build-exe`).
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

**Cỡ** (không tính hai khối codemap):
- sản phẩm +376 / −290, trong đó khoảng 130 dòng dời nguyên văn sang `attempts.ts` / `analysis-steps.ts`, mỗi dòng tính hai lần;
- test +164 / −56 (e2e 60 / 23);
- chữ `CLAUDE.md` khoảng 14 dòng.

Tổng khoảng 900 dòng (865 trước khi sửa theo review, mục 11 thêm khoảng 35), vượt ngưỡng ~800 / ~400 SP. Lý do: tám mục của Issue (ước lượng ≈ 150 + 150 chưa tính phần dời code), cộng năm ghi chú Mock của review #809 sổ gắn [T-288] sau khi viết Issue (+51 / −19 SP, +41 test, commit riêng). Không tách PR: các mục cùng đụng `run.ts` / `web.ts` / `schema.ts`, phần dời code là một khối. Ghi vào bảng "Kích thước PR vượt ngưỡng" của `phase-6.md` ở G7.

**Quan sát ngoài phạm vi:** `apps/desktop/src/i18n/vi.ts:228` viết số 20.000 trong câu từ chối dán (`aiPanel.web.refused.TOO_LONG`). Đây là chữ UI, không phải hằng; muốn theo `MAX_AI_RAW_OUTPUT` thì phải nội suy, mà `vi.ts` ngoài danh sách file.

Rủi ro: `risk:high`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-288 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #455, #698, #766, #809 và DR6-66 / DR6-67 phần `ai` — T-288 (#777, PR #812, `REVIEW: PASS` @`de7280a`):
  - #455, tập provider không có model / token: `AI_ANALYSIS_NO_MODEL` chỉ ở `packages/ai/src/schema.ts` (`@p2c/ai/schema`); `db` import lại cho hai CHECK của `ai_analyses` (SQL không đổi) và `toRow`, `runAnalysis` ghi `row` theo danh sách (`NO_MODEL` của `packages/ai/src/analysis-steps.ts`).
  - #455, giới hạn 20 000: một hằng `MAX_AI_RAW_OUTPUT` (`packages/ai/src/schema.ts`) cho `db`, `analysis-steps.ts` và `web.ts`; `MAX_RAW_OUTPUT` của `run.ts` bỏ.
  - #455, `packages/ai/src/prompts/retry.ts` chỉ còn chữ G5 §5 (`RETRY_TEMPLATE`, `retryMessage`); luật lần thử và kiểm một câu trả lời dời sang `packages/ai/src/attempts.ts`.
  - #455, phạm vi export: `ANALYSIS_PROMPTS`, `takeAnalysisInput`, `checkAnalysisAnswer`, `analysisOutcome`, `EMPTY_RAW_OUTPUT` ở `packages/ai/src/analysis-steps.ts`, `index.ts` không re-export; chip 4e của app dựng version bằng `webPromptVersion` (`packages/ai/src/web.ts`).
  - #698, `schemaDetail` (`packages/ai/src/validator.ts`): message đặt ở nguồn (`factCodeString` cho mã dữ kiện, message của union `value`); nhánh `default` đọc `issue.message`, nhánh `invalid_union` nêu luật của phương án đúng kiểu. Đột biến thêm `regex` cho đúng `detail` (review @`de7280a`). Phần union cùng kiểu: mục review #812 ở OPEN.
  - #766, `ownLine` (`packages/ai/src/web.ts`): chỉ còn `.trim()` sau `cleanText`.
  - #766, NIT ZWSP: `packages/ai/src/validator.test.ts`, `packages/ai/src/schema.test.ts` dùng `ZWSP` của `test-support.ts`.
  - #766, version prompt trong test: unit đọc `PROMPT_VERSIONS` (cộng `WEB_WRAPPER.version` cho ChatGPT web), e2e đọc `PROMPT` của `e2e/fixtures.ts`; `contentHash` của `packages/db/src/seed.test.ts` coi `prompt_version` là một dấu (Owner thêm file 24/10). Đột biến `discovery@5` / `web@2` chỉ sửa file prompt, `PROMPT_VERSIONS` và ghim G5: 3 785 / 3 785 test xanh.
  - #809, `NOT_ASKED` (`packages/ai/src/mock-adapter.ts`): `[^\S\n]` thay `\s`, không đọc qua xuống dòng (N19d).
  - #809, loại L140 cũ: "hoặc" đọc như "hay" (`EITHER`, `NOT_ASKED`); `NOT_YET` nhận thêm "nha / hả / à"; `GUESSED` thêm "à / hả / thì phải" cuối câu và "chắc" nói không chắc (`UNSURE`). Phần "chắc" còn hở: mục review #812 ở OPEN.
  - #809, `OF_SOMEONE_ELSE`: sau "của", chữ số lượng (`HOW_MANY`) hay "người" cũng là người khác.
  - #809, `NEGATED` thêm "bác bỏ", "phủ nhận".
  - #809, mùi *Duplicated Code*: mỗi danh sách một hằng (`MARRY`, `NOT_SO`, `OR`).
  - DR6-66 phần `ai`: `AI_LOCAL_ERROR_CODES` thành kiểu nội bộ `AiLocalErrorCode` (`packages/ai/src/errors.ts`), không export.
  - DR6-67 phần `ai`: kiểu `AiErrorDetails` / `AiErrorResult` và phép chép `errorDetails` (`packages/ai/src/errors.ts`), dùng ở `run.ts`, `apps/desktop/src/data/ai-tauri.ts`, `apps/desktop/src/data/ai-analysis.ts`, `apps/desktop/src/routes/ai-error-view.ts`.
  - #455 (đưa lại từ ACCEPTED), *Data Clumps* `customerId` + `kycVersionId`: `AnalysisSubject` và `subjectOf` (`packages/ai/src/analysis-steps.ts`); `AnalysisRequest`, `AnalysisRow`, `WebSession`, `WebAnalysisRequest` kế thừa nó.

---

# Issue #778 — T-289: Mock trích xuất: bớt đề xuất sai còn lại của review #753

Trạng thái: CLOSED · nhãn: type:task, risk:high, ready-for-agent

##### Mục tiêu

Mock trích xuất bớt các đề xuất sai còn lại của review #753, theo CX-A4 (đề xuất sai tệ hơn thiếu đề xuất). Đề xuất của Mock không tự lưu, RE bấm Xác nhận.

1. **`PEOPLE` (từ ghép được miễn):** các câu ví dụ trong sổ ("Đàn ông trong nhà KH…", "Cô dâu…", "Chú thích…", "Bác bỏ…", "Em Bé…", "Em bé nhất…") không còn ra đề xuất sai.
2. **`OWN_SPOUSE`:** vợ / chồng / bạn sau "có / cùng / với / lấy / cưới / kết hôn với" không được miễn khi người đó là chủ ngữ của cụm ngay sau, hoặc là vợ / chồng của người thứ ba (các câu ví dụ trong sổ).
3. **`MARRYING`:** đảo danh sách loại trừ thành danh sách cho phép, để chỗ sót chỉ làm mất đề xuất (vd. "cưới" chỉ miễn khi ngay trước là "KH / đã / vừa / mới / sắp / sẽ").
4. **"của <người khác>" sau số con:** danh sách riêng cho chữ sau "của", có cờ `i`, không mang ngoại lệ nghề / từ ghép của `PEOPLE`.
5. **`ASKED` / `GUESSED`:**
   - các câu hỏi / phỏng đoán trong sổ (tiểu từ cuối câu, "chưa" giữa vế, "hay", "Có thể / Có vẻ / Dường như…") không ra đề xuất;
   - câu kể một vế kết thúc bằng "thì chưa" vẫn ra đề xuất.
6. **Hai mục đưa lại từ ACCEPTED (Owner 23/10):**
   - `AFTER_CHO`: "cho 2 con sắp sinh / tương lai" không ra Số con;
   - `NOT_OF_ANYONE`: "KH là người độc thân…" ra Độc thân, còn "gói dành cho khách là người độc thân" không ra.
7. ***Data Clumps* `(part, start)`** qua các hàm đọc câu / vế thành một `{ text, start }`.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Issue này gom các mục OPEN gắn **[T-289]**: sáu mục của review #753, cộng hai mục đưa lại từ ACCEPTED. Câu ví dụ của từng mục nằm trong sổ (chạy lại trên `main` `cbdb590`).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-289] (mỗi mục có câu ví dụ và kết quả mong đợi)
- `packages/ai/CLAUDE.md` (Mock, coverage 100 %)
- `packages/ai/src/mock-adapter.ts`, `packages/ai/src/mock-adapter.test.ts`
- Issue #727 (T-276, DR6-121, CX-A4) và thân PR #753 (Lệch 1, Lệch 7)

##### File / thư mục được phép sửa

- `packages/ai/src/{mock-adapter.ts,mock-adapter.test.ts}`

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-289]**: gộp. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Chỉ đổi luật đọc câu của Mock; giao diện adapter, schema và câu trả lời mẫu không đổi.
- Không cần G5 (Mock không phải prompt).

##### Test chấp nhận

- [ ] Mỗi câu ví dụ của tám mục trong sổ là một ca test, ra đúng mong đợi (đề xuất đúng, hoặc không đề xuất).
- [ ] Các câu mà `main` đang đúng (ghi trong sổ) vẫn đúng.
- [ ] Test cũ của Mock xanh. Kỳ vọng nào đổi thì nêu trong PR, kèm lý do theo CX-A4.
- [ ] Coverage `packages/ai` vẫn 100 %.

Ước lượng: ≈ 120 dòng SP + ≈ 250 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-289] đã sửa sang RESOLVED

##### Rủi ro

risk:high

##### Bị chặn bởi

Không

## PR #809 — fix: spare kin words and partners in the Mock extraction only after the KH, read questions after a phrase (T-289)

Trạng thái: MERGED · merge 2026-10-24T14:00:44Z · commit `33f78917d35434f1c446842de4bd51851a39b2eb` · nhánh `task/T-289-mock-extraction` · nhãn: risk:high

Closes #778

#### Thay đổi

T-289: Mock trích xuất bớt các đề xuất sai còn lại của review #753, theo CX-A4 (đề xuất sai tệ hơn thiếu đề xuất; đề xuất không tự lưu, RE bấm Xác nhận). Chỉ sửa hai file được phép (`packages/ai/src/mock-adapter.ts`, `packages/ai/src/mock-adapter.test.ts`). Giao diện adapter, schema và câu trả lời mẫu không đổi. Không cần G5 vì Mock không phải prompt. Bốn commit: `3055d77` refactor *Data Clumps* (mục 7, làm khi test còn xanh), `dabb50e` các luật, `e9a073a` sửa theo review @`dabb50e` và `5f17324` thay một câu test của nó (xem "Vòng sửa 1"; `mock-adapter.ts` của `5f17324` y hệt `e9a073a`).

Gốc chung của mục 1–3 (sổ L138, "Gốc chung với hai mục trên"): luật miễn làm **thêm** đề xuất đang là danh sách loại trừ. PR đảo thành danh sách cho phép: một chữ chỉ người chỉ được miễn **ngay sau "KH" mở đầu vế**, tức KH là chủ ngữ của vế. Sót chữ nào thì chỉ mất đề xuất, không ra đề xuất sai.

##### Vòng sửa 1 (review @`dabb50e`)

- **[chặn] "thì chưa / thì không" ngay sau cụm** ("KH độc thân thì không." → Độc thân): `NOT_ASKED` nhận thêm câu trả lời (`ANSWERED`: "thì" hoặc ":" ngay trước "chưa / không"), đúng gợi ý của review.
  - Cùng loại mà gợi ý chưa đóng: có chữ giữa cụm và câu trả lời. Head `dabb50e` ra đề xuất, `main` thì không: "KH đã kết hôn chính thức thì chưa.", "KH có 2 con riêng thì chưa.", "KH độc thân thật thì không.".
  - Luật mới `DENIED` (theo vế): vế kết thúc bằng câu trả lời phủ định **chủ đề** của nó, từ đầu vế hoặc từ sau "nhưng / mà / còn" cuối cùng của vế (`BUT`), tới "thì / :". "KH có 2 con nhưng bảo hiểm thì chưa." vẫn ra Số con 2 (Issue mục 5).
- **[chặn] `NOT_OF_ANYONE` nhận "KH là" ở mọi chỗ** ("Người yêu của KH là người độc thân." → Độc thân): `KH_SUBJECT` neo ở đầu vế, `NOT_OF_ANYONE` dựng từ `KH_SUBJECT` (Lệch 6). Bốn câu của review không còn đề xuất; "Theo chị Lan, KH là người độc thân.", "Ghi chú: KH là người độc thân." vẫn ra Độc thân.
- **[không chặn] Test giữ thứ tự hai lần che:** thêm "KH sống cùng vợ chồng anh Nam, đã kết hôn." và hai câu cùng loại vào nhóm không đề xuất.
  - Neo đầu vế (mục chặn thứ hai) lộ ra chỗ thứ tự này đang che giùm: khi "KH" không mở đầu vế, "vợ" không còn được đọc là vợ của KH, nên "vợ chồng" của `NAMES_NO_ONE` miễn cả cặp: "Năm 2015 KH cùng vợ chồng anh Nam, đã kết hôn." → Đã kết hôn (`dabb50e`: không đề xuất).
  - Sửa ở gốc (Lệch 7): "vợ chồng" ngay sau "có / cùng / với / lấy / cưới / kết hôn với" là cặp được nêu, không miễn. Hai lần che nay không còn chung chữ nào, nên đổi thứ tự là đột biến tương đương thật: fuzz 200 000 ghi chú, 0 khác.
  - Gỡ luật này thì "Năm 2015 KH cùng vợ chồng anh Nam, đã kết hôn." và "Khách mới ở với vợ chồng anh Nam, có 2 con." đỏ. "KH sống cùng vợ chồng anh Nam, đã kết hôn." (câu của review) vẫn không đề xuất ở mọi thứ tự che.
- **[không chặn] *Duplicated Code* "KH là chủ ngữ":** một định nghĩa, `KH_SUBJECT`, cho mọi chỗ. "KH hiện là người độc thân." → Độc thân.
- **[không chặn] "Người yêu của KH đã có vợ và 2 con." → Số con 2** (giống `main`): hết đề xuất, cùng nhờ neo đầu vế.
- **[không chặn] Mất đề xuất chưa có trong bảng:**
  - ":" là câu trả lời như "thì" (Lệch 8): "KH đã kết hôn, có 2 con, bệnh nền: không." → Đã kết hôn, Số con 2 như `main`.
  - "có vẻ" và "KH có 2 con chưa đi học." ghi vào bảng "Đề xuất mất đi". Không đổi "có vẻ" thành "chỉ tính khi đứng trước cụm": cách đó biến "KH đã kết hôn, có vẻ vậy." (một phỏng đoán) thành đề xuất, mà vẫn không giữ được "KH có vẻ quan tâm, đã kết hôn, có 2 con." (vì "có vẻ" đứng trước cụm).

##### Cấu trúc

- `PEOPLE` nay chỉ còn danh sách chữ chỉ người, không còn ngoại lệ trong regex. Những chỗ chữ ấy không chỉ người khác nằm ở hai regex riêng. Khi tìm người khác trong câu, `namingPeople` đọc các chữ đó thành dấu cách, giữ nguyên vị trí:
  - `NAMES_NO_ONE`, mọi nơi và mọi kiểu chữ, như `main`: "bác sĩ", "cô giáo", "cô đơn", "chú ý", "chú trọng", "ghi chú", tiêu đề "Chú thích:", "vợ chồng", "và vợ / chồng". Trừ "vợ chồng" ngay sau một chữ của `WITH_PARTNER` ("có / cùng / với / lấy / cưới / kết hôn với").
  - `SAID_OF_THE_KH`, chỉ ngay sau `KH_SUBJECT`: "KH là đàn ông / cô dâu", "KH có em bé", "KH bác bỏ", và vợ / chồng / bạn của KH (`OWN_PARTNER`). `KH_SUBJECT` gồm:
    - "KH" mở đầu vế: trong vế, trước nó không có chữ cái; vế kết thúc ở dấu của `CLAUSE_END` hoặc ":";
    - có thể sau "Hiện / Hiện tại / Hiện nay";
    - và tối đa 2 chữ đệm "đã / đang / hiện / vừa / mới / sống / ở".
  - Hai regex khác nhau về hoa thường là có chủ ý:
    - `NAMES_NO_ONE` có cờ `i`, giữ cách đọc của `main`, vì các chữ này mở được câu ("Chú ý:", "Vợ chồng KH…", "Bác sĩ nói…").
    - `SAID_OF_THE_KH` không có cờ `i`: "KH" luôn viết hoa, chữ đứng sau nó không bao giờ mở câu, và "bé" phải viết thường ("Em Bé" là tên, sổ L136).
  - Hai regex không chung chữ nào: vợ / chồng ngay sau `WITH_PARTNER` chỉ ở `OWN_PARTNER`. Thứ tự đọc không đổi kết quả.
- Danh sách sau "của" (mục 4) dùng lại `PEOPLE` (đã hết ngoại lệ) cộng "ba", có cờ `i`, qua một regex sticky thử ở chỗ số con kết thúc (`OF_SOMEONE_ELSE`). Đây cũng là chỗ sửa *Divergent Change* của L139: ngoại lệ của vai "đứng trước cụm" không còn nằm trong danh sách dùng chung.
- Câu hỏi và câu trả lời (mục 5) dùng chung `NOT_YET`: "chưa / không", có thể kèm "nhé / nhỉ / ạ", ở cuối vế.
  - `ASKED` (theo câu): `NOT_YET` không đứng sau câu trả lời → hỏi mọi thứ đứng trước nó trong câu.
  - `DENIED` (theo vế): `ANSWERED` + `NOT_YET` → phủ định chủ đề, từ sau `BUT` cuối cùng của vế (hoặc đầu vế) tới câu trả lời.

##### Từng mục

1. **Từ ghép (L136).** "đàn ông", "cô dâu", "bác bỏ", "em bé" chỉ được miễn ngay sau KH: "KH là đàn ông / cô dâu", "KH bác bỏ", "KH có em bé". "chú thích" chỉ được miễn khi là tiêu đề "Chú thích:".
   - "em bé" còn phải có "bé" viết thường và không kèm "nhất / hơn". Các chữ này ở trong regex riêng không có cờ `i`, nên không cần `(?-i:…)` (ES2025).
   - Ở chỗ khác chúng là người khác, như trước #753. Sáu câu của sổ không còn đề xuất. Không đề xuất cả các câu cùng họ: "Trong nhà KH, đàn ông…", "Hôm qua cô dâu…", "Khách mới là cô dâu…", "Hôm qua bác bỏ thuốc lá…", "Nhà bên có em bé…", "KH có em bé nhất / hơn…", "KH có em Bé…", "Người yêu của KH là đàn ông…".
2. **Vợ / chồng / bạn (L137).**
   - Vợ / chồng là của KH chỉ khi đứng ngay sau "KH [≤ 2 chữ đệm] có / cùng / với / lấy / cưới / kết hôn với", với "KH" mở đầu vế. Bạn / đồng nghiệp… là người KH lấy chỉ khi đứng ngay sau "KH [≤ 2 chữ đệm] lấy / cưới / kết hôn với". "của" ngay sau vợ / chồng → vợ / chồng của người khác.
   - Vợ / chồng / bạn của KH đứng trước cụm trong **cùng vế** là chủ ngữ của cụm (`PARTNER_FIRST`, đọc theo vế), trừ khi "và" nối ngay sau ("KH đã có vợ và 2 con").
   - "và vợ / chồng" và "vợ chồng" vẫn được miễn như `main`, trừ "vợ chồng" ngay sau "có / cùng / với / lấy / cưới / kết hôn với" (Lệch 7). Chín câu của sổ và "Người yêu của KH đã có vợ và 2 con." không còn đề xuất.
3. **`MARRYING` (L138).** Bỏ danh sách loại trừ "đám / ăn / tiệc / thiệp / lễ / mừng / đi". "cưới" chỉ tính là KH cưới khi "KH" và chữ đệm đứng ngay trước (dùng chung `KH_SUBJECT` với mục 2). Ba câu của sổ và câu "KH đi dự cưới đồng nghiệp, đã có 2 con." không còn đề xuất; 8 câu đám cưới của vòng 2 #753 vẫn không đề xuất.
4. **"của <người khác>" (L139).** `OF_SOMEONE_ELSE` = "của" + một chữ của `PEOPLE` (không ngoại lệ) hoặc "ba", cờ `i`. Bảy câu của sổ và câu "KH nuôi 2 con của ba người bạn." không còn đề xuất. "KH có 2 con của anh ấy." vẫn ra Số con 2, vì "anh" / "chị" đứng riêng có thể là KH.
5. **Câu hỏi, phỏng đoán (L140).**
   - `NOT_ASKED`: có "chưa / không / hay" **ngay sau cụm** thì không đề xuất, dù vế còn tiếp ("…chưa để tư vấn", "…chưa rõ", "…hay còn độc thân"). Cả khi trước "chưa / không" là "thì" hoặc ":" ("KH độc thân thì không.", "Đã kết hôn: chưa rõ.").
   - `ASKED`, tính theo câu: vế kết thúc bằng "chưa / không" (có thể kèm "nhé / nhỉ / ạ") hỏi **mọi thứ đứng trước nó trong câu**, như "Cần hỏi KH đã kết hôn, có con chưa.". Ngoại lệ: câu trả lời "thì / :", chỉ phủ định chủ đề của nó (`DENIED`).
   - `DENIED`: "KH đã kết hôn chính thức thì chưa.", "KH có 2 con riêng: không." → không đề xuất. "KH có 2 con nhưng bảo hiểm thì chưa.", "KH đã kết hôn mà bảo hiểm thì chưa.", "KH độc thân, nợ: không." → giữ đề xuất.
   - `EITHER`: "hay" đứng trước cụm trong vế ("…hay còn độc thân").
   - Thêm "có vẻ / dường như" vào `GUESSED` (cả câu, như "hình như"). Thêm "có thể" vào `SUPPOSED`, chỉ tính khi đứng trước cụm, vì sau cụm nó thường là "có thể đóng phí".
   - Các câu của sổ không còn đề xuất.
6. **`AFTER_CHO` (L187), `NOT_OF_ANYONE` (L188).**
   - "cho" ngay trước số chỉ miễn từ ước muốn khi ngay sau số là hết vế hoặc "ăn học" (`forTheChildren`, `NOTHING_MORE`). "cho 2 con sắp sinh / tương lai" không còn đề xuất. Bốn câu cũ ("đầu tư cho 2 con.", "lo cho 2 con ăn học."…) vẫn ra Số con 2.
   - "người" ngay trước cụm không tính khi ngay trước nó là `KH_SUBJECT` + "là": "KH là người độc thân, sống một mình.", "KH hiện là người độc thân." → Độc thân. "Gói dành cho khách là người độc thân.", "Người giới thiệu KH là người độc thân." vẫn không đề xuất.
7. ***Data Clumps* (L141).** `type Part = { text, start }` đi qua `readerOf`, `firstEnd`, `lastStart`, `readSentence`, `readClause` (commit `3055d77`).

Cỡ (so với `main`): sản phẩm +216 / −78, test +187 / −2 (gồm refactor mục 7), dưới trần ~400 / ~800. Riêng vòng sửa 1: sản phẩm +57 / −23, test +65.

##### Lệch so với Issue / sổ

1. **Chữ đệm giữa "KH" và động từ.** Issue mục 3 lấy ví dụ "cưới chỉ miễn khi ngay trước là KH / đã / vừa / mới / sắp / sẽ". PR dùng một danh sách cho mọi động từ của mục 2–3 và neo ở "KH" mở đầu vế (Lệch 6): "KH" + tối đa 2 chữ "đã / đang / hiện / vừa / mới / sống / ở".
   - Neo ở "KH" vì "đã cưới" đứng riêng không cho biết ai cưới ("Khách mới đã cưới vợ…").
   - Không có "sắp / sẽ": với chúng, "KH sắp có vợ và 2 con" ra Số con 2, trong khi con chưa có.
   - Giới hạn 2 chữ là để giữ hiệu năng: lookbehind được thử ở mọi vị trí của câu.
2. **Mục 1 rộng hơn sáu câu của sổ.** Đây là đảo thành danh sách cho phép theo L138, nên mọi chỗ không đứng ngay sau KH đều là người khác, không riêng đầu câu. Các chữ miễn từ trước #753 thì giữ nguyên (xem "Quan sát ngoài phạm vi").
3. **"chưa / không" cuối vế tính lại theo câu, trừ câu trả lời "thì / :".** Issue #727 ghi "cùng câu"; #753 đổi thành theo vế để giữ câu "bảo hiểm thì chưa" (Lệch 1 của #753).
   - PR này về lại theo câu: một vế kết thúc bằng "chưa / không" hỏi mọi thứ đứng trước nó trong câu, kể cả khi vế đó ở giữa câu ("KH đã kết hôn, có con chưa, cần hỏi lại." → không đề xuất).
   - Cụm đứng sau vế hỏi thì không bị hỏi: "Hỏi KH đã mua bảo hiểm chưa, KH có 2 con." → Số con 2.
   - Lời kể giữ được vì câu trả lời "thì / :" chỉ phủ định chủ đề của nó (`DENIED`, vòng sửa 1). Ở `dabb50e`, "thì" tha mọi thứ đứng trước, cả chính cụm (mục chặn của review).
4. **`AFTER_CHO` đảo thành danh sách cho phép** (hết vế / "ăn học") thay vì liệt kê "sắp sinh / tương lai". Theo gốc chung L138, sót chữ chỉ làm mất đề xuất.
5. **Regex sticky dùng lại.** Review #753 bỏ `matchesAt` vì "cho " là chuỗi cố định. Lần này có hai thứ chuỗi cố định không làm được: danh sách "của" cờ `i` không ghép được vào mẫu số con (mẫu đó phân biệt hoa thường: "2 con Lexus"), và `AFTER_CHO` cần nhìn sau số. Vì vậy thêm helper `startsAt` hai dòng. Bất biến: `lastIndex` được đặt ngay trước mỗi lần `test`, không chỗ nào đọc nó ở giữa, và Mock chạy đồng bộ.
6. **"KH" mở đầu vế cho mọi chỗ dùng `KH_SUBJECT` (vòng sửa 1).** Review gợi ý chỉ neo "KH là" của `NOT_OF_ANYONE`, ở `(?:^|[.!?;,:\n]) ?`.
   - PR neo chính `KH_SUBJECT`, dùng cho vợ / chồng, từ ghép và "là người". Lý do: mùi *Duplicated Code* và mục "Người yêu của KH đã có vợ…" của review; L137 cũng ghi "chỉ miễn khi chủ ngữ của vế là KH".
   - Neo rộng hơn gợi ý: trong vế không có chữ cái nào đứng trước "KH". Nhờ vậy gạch đầu dòng, số thứ tự, ngoặc, ngoặc kép vẫn qua ("- KH đã có vợ…", "1) KH…").
   - Nhận thêm "Hiện / Hiện tại / Hiện nay" mở vế, như "hiện" sau KH ("Hiện KH đã có vợ và 2 con." → Số con 2).
   - Mở đầu khác ("Năm 2015 KH…", "Chị Lan nói KH…") thì mất đề xuất (bảng dưới).
   - Phần nhìn lùi tìm đầu vế chỉ chạy ở chỗ có "KH", và lười: dừng ở chữ cái đầu tiên. Bản tham lam cho cùng kết quả (fuzz 100 000: 0 khác) nhưng mất 447 ms ở hàng DR6-79 "KH có vợ và" × 3 000.
7. **"vợ chồng" ngay sau "có / cùng / với / lấy / cưới / kết hôn với" không còn được miễn (vòng sửa 1).**
   - Đây là một phần của "vợ chồng" mà PR để như `main` (ngoài phạm vi). Phải thu hẹp, vì neo đầu vế (Lệch 6) mở đường cho đề xuất sai mới so với `dabb50e`: "Năm 2015 KH cùng vợ chồng anh Nam, đã kết hôn." → Đã kết hôn.
   - Ở `dabb50e`, "vợ" ở đó được che là vợ của KH, nên "chồng" còn lại là người khác.
   - Cũng hết "Khách mới có vợ chồng anh Nam, có 2 con." → Số con 2 (`main` và `dabb50e`).
8. **":" là câu trả lời như "thì" (vòng sửa 1, gợi ý không chặn của review).** Cùng `NOT_ASKED` và luật chủ đề: "Đã kết hôn: chưa rõ." → không đề xuất (`main`: Đã kết hôn), "KH độc thân, nợ: không." → Độc thân như `main`.

##### Kỳ vọng test đổi (1)

- `KH đã kết hôn, có 2 con không đi nhà trẻ.` (nhóm DR6-121, dòng 322): [Đã kết hôn, Số con 2] → [Đã kết hôn]. "không" ngay sau "2 con" có thể là câu hỏi ("có 2 con không?"). Sổ L140 đã nêu trước cái giá này của luật "chưa / không ngay sau cụm" (CX-A4).

##### Đề xuất mất đi (âm tính giả mới, CX-A4)

Chạy ở phiên này, qua adapter:

| Câu | `main` | nhánh | Vì |
|---|---|---|---|
| Anh ấy đã cưới vợ, có 2 con. | Số con 2 | — | "vợ" không đứng ngay sau "KH" |
| KH 35 tuổi, có vợ và 2 con. / KH là bác sĩ, có vợ và 2 con. / Chị Lan đã có chồng và 2 con. | Số con 2 | — | vế "có vợ" không có KH làm chủ ngữ |
| KH hiện đang sống cùng vợ và 2 con. | Số con 2 | — | 3 chữ đệm |
| KH cưới vợ năm 2015 và có 2 con. | Số con 2 | — | "và" không đứng ngay sau "vợ" |
| KH sắp cưới vợ, có 2 con. | Số con 2 | — | "sắp" không là chữ đệm |
| KH đã kết hôn chưa lâu. | Đã kết hôn | — | "chưa" ngay sau cụm |
| KH có 2 con chưa đi học. | Số con 2 | — | "chưa" ngay sau cụm, cùng loại dòng 322 |
| KH có thể đóng phí, đã kết hôn. | Đã kết hôn | — | "có thể" đứng trước cụm |
| KH hay đi công tác nên vẫn độc thân. | Độc thân | — | "hay" đứng trước cụm trong vế |
| KH muốn mua bảo hiểm cho 2 con nhỏ. | Số con 2 | — | sau số còn chữ "nhỏ" |
| KH có vẻ quan tâm, đã kết hôn, có 2 con. / KH đã kết hôn, có 2 con, có vẻ quan tâm gói học vấn. | Đã kết hôn, Số con 2 | — | "có vẻ" tính cả câu, như "hình như" |
| Năm 2015 KH cưới vợ, có 2 con. / Sau đó KH cưới vợ, có 2 con. / Chị Lan nói KH đã có vợ và 2 con. / Theo hồ sơ thì KH đã có vợ và 2 con. | Số con 2 | — | "KH" không mở đầu vế (Lệch 6) |
| KH độc thân thì không phải lo cho ai. / KH đã kết hôn thì không cần giấy này. / KH có 2 con thì chưa cần gói học vấn. | Độc thân / Đã kết hôn / Số con 2 | — | "thì không / thì chưa" ngay sau cụm (mục chặn của review) |

"KH độc thân và hay đi du lịch." vẫn ra Độc thân, vì "hay" đứng sau cụm nhưng không ngay sau. Mở đầu vế bằng dấu phẩy, hai chấm, gạch đầu dòng, số thứ tự hay "Hiện…" vẫn ra đề xuất ("Năm 2015, KH cưới vợ, có 2 con.", "Chị Lan nói: KH đã có vợ và 2 con." → Số con 2).

##### Quan sát ngoài phạm vi (giống `main`, không có trong sổ)

- "Bác sĩ Lan đã kết hôn." / "Cô giáo đã kết hôn." → Đã kết hôn; "Vợ chồng anh Nam có 2 con." → Số con 2.
  - Các chữ miễn có từ trước #753 ("bác sĩ", "cô giáo", "cô đơn", "chú ý", "chú trọng", "vợ chồng", "và vợ") vẫn được miễn mọi nơi. Riêng "vợ chồng" ngay sau động từ của `WITH_PARTNER` thì không (Lệch 7).
  - Chúng cùng gốc với mục 1 và đảo được như "cô dâu" nếu Owner muốn; PR giữ nguyên vì ngoài sổ và ngoài Issue.
- "KH có 2 con sắp sinh." → Số con 2. Câu không có từ ước muốn; "sắp sinh" sau số chỉ được đọc qua `AFTER_CHO`.

#### Test chấp nhận

- [x] Mỗi câu ví dụ của tám mục trong sổ là một ca test và ra đúng mong đợi.
  - Ba nhóm "(the notes of PR #753)": 38 câu không đề xuất vì có thể nói về người khác, 23 câu không đề xuất vì là câu hỏi / phỏng đoán / ước muốn, 15 câu ra đúng đề xuất.
  - Ba nhóm "(the review of PR #809)": 22 câu không đề xuất (câu trả lời, KH không là chủ ngữ, cặp vợ chồng được nêu), 13 câu ra đúng đề xuất, 7 ca "KH" mở vế sau từng dấu (`. ! ? ; , : \n`).
  - Mỗi chữ của danh sách mới có một ca đỏ khi gỡ (xem kiểm đột biến).
- [x] Các câu `main` đang đúng (ghi trong sổ) vẫn đúng: "Gói dành cho khách là người độc thân." không đề xuất; các câu đúng về KH của #753 ("KH đã có vợ và 2 con.", "KH và vợ đã kết hôn…", "KH cưới vợ năm 2015, có 2 con."…) vẫn xanh.
- [x] Test cũ của Mock xanh. Một kỳ vọng đổi (dòng 322), lý do ở trên.
- [x] Coverage `packages/ai` 100 % (`pnpm verify`).
- [x] Kiểm đột biến, chạy chính `mock-adapter.test.ts` trên từng bản đột biến (bản sao, không sửa worktree):
  - `dabb50e`: 78 bản, gồm từng chữ của mỗi danh sách mới, từng cờ, từng điều kiện, và luật dùng / không dùng. 76 bị diệt; một bản lúc đầu sống ("bạn" sau "có / cùng / với") bị diệt sau khi thêm câu "KH sống với bạn, có 2 con.". `{0,2}` → `{0,3}` của `KH_SUBJECT` sống vì đây là giới hạn hiệu năng. Đổi thứ tự hai lần che sống, nhưng ở `dabb50e` nó **không** tương đương như thân PR khi đó ghi (review chỉ ra); xem dòng dưới.
  - Vòng sửa 1: 55 bản trên phần đổi (neo đầu vế từng dấu, "Hiện / tại / nay", câu trả lời "thì / :", `NOT_YET` từng chữ, `DENIED`, `BUT` từng chữ, "vợ chồng" sau từng động từ của `WITH_PARTNER`…). 51 bị diệt. 4 bản sống, mỗi bản so với nhánh bằng fuzz 100 000–200 000 ghi chú:
    - đổi thứ tự hai lần che: 0 khác (không còn chữ chung);
    - "thì" bỏ ranh giới chữ đứng trước: 0 khác (âm tiết tiếng Việt không có chữ cái đứng trước "th");
    - `<` → `<=` ở đầu chủ đề: 0 khác (cụm không bao giờ bắt đầu ở "nhưng / mà / còn");
    - cho chữ số đứng sau "chưa / không" cuối vế: 2 khác, đều ở chuỗi vô nghĩa ("1 con đi học không 1)"); cùng lớp ký tự với `ASKED` của `dabb50e`.
- [x] K5, chạy lại trên mã của head (`e9a073a`; `5f17324` chỉ đổi test), script tạm không commit. Lấy mọi ghi chú `kyc_notes` nguồn RE của dữ liệu tải (`LOAD_SCALE`, mốc 12/10/2026, seed 6, có Thùng rác: 2 292 ghi chú khác nhau) và của seed demo ở 3 ngày neo (20/10/2026, 28/02/2026, 31/12/2027, seed 1: thêm 1 259). Trên **3 551 ghi chú: 0 khác `main` và 0 khác `dabb50e`**, 1 332 = 1 332 đề xuất (670 Độc thân, 662 Đã kết hôn).
- [x] Fuzz vi sai, ghi chú ghép ngẫu nhiên và theo mẫu câu, từ bộ từ vựng có mọi chữ của các luật:
  - `dabb50e`: bản nhánh gỡ đúng hai luật thêm đề xuất ("KH là người…", "… thì chưa / không"), 200 000 ghi chú, hai seed: 0 đề xuất mới so với `main`. Bản nhánh đủ, 100 000 ghi chú: 1 087 ghi chú có đề xuất mới, ghi chú nào cũng có "KH là người" hoặc "thì chưa / không".
  - `e9a073a`, 400 000 ghi chú (200 000 ghép ngẫu nhiên, 200 000 theo mẫu câu). So với `main`: 4 171 ghi chú có đề xuất mới, ghi chú nào cũng thuộc hai luật cố ý — câu trả lời "thì / :" mà cụm ở ngoài chủ đề (vế khác, hoặc trước "nhưng / mà / còn"), hoặc "KH … là người". So với `dabb50e`: đề xuất thêm chỉ ở câu trả lời ":" (`dabb50e` đọc là câu hỏi cả câu) và "KH <chữ đệm> là người".
- [x] Ghi chú một dòng 36 000 ký tự vẫn < 50 ms. Test DR6-79 có thêm bốn hàng: "KH có vợ và" × 3 000 rồi "độc thân"; "KH" + "đã" × 12 000 + "có vợ và 2 con"; "chưa" + 36 000 dấu cách; "- " × 18 000 rồi "KH là người độc thân" (vòng sửa 1).
  - Số đo best of 5 trên Home PC, `main` → `e9a073a`: "độc thân" × 4 000 3,9 → 3,9 ms; "KH là người độc thân." × 1 650 0,8 → 4,6 ms; "KH lấy chồng đã có 2 con riêng." × 1 130 2,3 → 4,1 ms.
  - Các hàng nhắm vào vòng sửa 1 (gạch nối × 36 000 rồi "KH có vợ", "Hiện KH là người" × 1 300, "có 2 con mà" × 3 000 rồi ": không", "thì chưa" × 4 000, "nhưng" × 5 000 rồi "thì chưa", "vợ chồng" × 4 000…): ≤ 3,0 ms. Mọi hàng khác ≤ 2,1 ms.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `4449696`): 8 mục "Trùng file", **đã sửa cả 8**.

- L136 (`PEOPLE`, từ ghép được miễn): đã sửa, mục 1.
- L137 (`OWN_SPOUSE`, vợ / chồng / bạn sau "có / cùng / với / lấy / cưới / kết hôn với"): đã sửa, mục 2 (KH mở đầu vế, Lệch 6).
- L138 (`MARRYING`): đã sửa, mục 3 (danh sách cho phép neo ở KH, xem Lệch 1).
- L139 ("của <người khác>" sau số con): đã sửa, mục 4; phần *Divergent Change* sửa bằng cấu trúc mới.
- L140 (`ASKED` / `GUESSED`): đã sửa, mục 5; kỳ vọng dòng 322 đổi như sổ đã nêu.
- L141 (*Data Clumps* `(part, start)`): đã sửa, mục 7.
- L187 (`AFTER_CHO`): đã sửa, mục 6.
- L188 (`NOT_OF_ANYONE`): đã sửa, mục 6.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (format, lint, ranh giới module, codemap, typecheck, 3 753 test, coverage `packages/ai` 100 %)
- [x] Không thêm dependency ngoài ADR-0005 (không đổi dependency)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:high`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-289 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #753 (sáu mục, cộng hai mục đưa lại từ ACCEPTED) — T-289 (#778, PR #809, `REVIEW: PASS` @`5f17324`), `packages/ai/src/mock-adapter.ts`. Gốc chung (L138 cũ): luật miễn làm thêm đề xuất đảo thành danh sách cho phép, neo ở `KH_SUBJECT` ("KH" mở đầu vế, có thể sau "Hiện / Hiện tại / Hiện nay", tối đa 2 chữ đệm). Đề xuất mất đi và Lệch 1–8 ghi ở thân PR #809.
  - #753, `PEOPLE` từ ghép được miễn: `PEOPLE` chỉ còn danh sách chữ; "đàn ông / cô dâu" chỉ miễn sau "KH là", "em bé" sau "KH có" ("bé" viết thường, không kèm "nhất / hơn"), "bác bỏ" sau KH (`SAID_OF_THE_KH`, không cờ `i`); "Chú thích" chỉ miễn khi là tiêu đề "Chú thích:" (`NAMES_NO_ONE`).
  - #753, `OWN_SPOUSE`: vợ / chồng là của KH chỉ ngay sau `KH_SUBJECT` + "có / cùng / với / lấy / cưới / kết hôn với" và không có "của" theo sau; bạn / đồng nghiệp… chỉ sau "lấy / cưới / kết hôn với" (`OWN_PARTNER`). Người đó đứng trước cụm trong cùng vế là chủ ngữ của cụm, trừ khi "và" nối ngay sau (`PARTNER_FIRST`). "vợ chồng" ngay sau các động từ đó không còn được miễn.
  - #753, `MARRYING`: bỏ danh sách loại trừ "đám / ăn / tiệc / thiệp / lễ / mừng / đi"; "cưới" chỉ tính là KH cưới khi ngay sau `KH_SUBJECT`. Không có "sắp / sẽ" (Lệch 1 của PR #809).
  - #753, "của <người khác>" sau số con: `OF_SOMEONE_ELSE` (sticky, cờ `i`) = "của" + chữ của `PEOPLE` (đã hết ngoại lệ) hoặc "ba"; hết *Divergent Change* vì ngoại lệ không còn nằm trong danh sách dùng chung.
  - #753, `ASKED` / `GUESSED`: "chưa / không / hay" ngay sau cụm, cả sau "thì / :" (`NOT_ASKED`); vế kết thúc bằng "chưa / không" (có thể kèm "nhé / nhỉ / ạ") hỏi mọi thứ đứng trước nó trong câu, trừ câu trả lời "thì / :" chỉ phủ định chủ đề của nó (`DENIED`, từ sau "nhưng / mà / còn"); "hay" trước cụm trong vế (`EITHER`); thêm "có vẻ / dường như" (`GUESSED`) và "có thể" trước cụm (`SUPPOSED`). Kỳ vọng `packages/ai/src/mock-adapter.test.ts:322` đổi như sổ đã nêu.
  - #753, mùi *Data Clumps* `(part, start)`: `type Part = { text, start }` qua `readerOf`, `firstEnd`, `lastStart`, `readSentence`, `readClause`.
  - #753 (đưa lại từ ACCEPTED), `AFTER_CHO`: "cho" ngay trước số chỉ tha khi sau số là hết vế hoặc "ăn học" (`forTheChildren`, `NOTHING_MORE`); "cho 2 con sắp sinh / tương lai" không ra đề xuất.
  - #753 (đưa lại từ ACCEPTED), `NOT_OF_ANYONE`: "người" ngay trước cụm không tính khi ngay trước nó là `KH_SUBJECT` + "là" ("KH là người độc thân, sống một mình." → Độc thân); "Gói dành cho khách là người độc thân.", "Người yêu của KH là người độc thân." vẫn không đề xuất.

---

# Issue #779 — T-290: packages/ai: cụm khớp trong detail, trích JSON khi bị cắt, ngưỡng test, message assistant rỗng (G4)

Trạng thái: CLOSED · nhãn: type:task, risk:high, gate, ready-for-agent

##### Mục tiêu

1. **V3–V6:**
   - `phrase()` ghi vào `detail` cụm model đã viết (như `pattern()`), không ghi tên mục có dấu;
   - các mục chặn trùng nhau ở cùng một chỗ chỉ sinh một issue (vd. "PRUDENTIAL" → một issue, không phải `prudential` + `pru…`);
   - G5 dòng 550 đã ghi đây là code, không thuộc G5; `detail` vẫn theo G5 §5: không lặp nguyên cụm bị chặn quá 40 ký tự.
2. **Trích JSON khi trả lời bị cắt.** Luật Owner duyệt 23/10, nguyên văn: "Trả lời AI bị cắt mà phía sau vẫn có khối JSON đủ thì dùng khối đó (sửa spec Phase 5 §6.1)."
   - Ví dụ: `Ghi chú { chưa đóng. {"a":1} rồi lời văn…` bị cắt → lấy `{"a":1}`, không tốn lần thử.
3. **Ngưỡng test:**
   - ca "braces in a long text" của test trích JSON tăng độ dài đầu vào, để giữ biên với bản bậc hai;
   - ca DR5-09 của ChatGPT web đo bằng số dòng được đọc, hoặc nới ngưỡng có số đo, không còn chập chờn khi máy bận.
4. **Message `assistant` rỗng ở lần thử lại.** Cổng G4 Owner duyệt 23/10, nguyên văn: "một lần gọi OpenCode thật (vài nghìn token, anh bấm) để thử message `assistant` rỗng. Nếu OpenCode từ chối thì sửa G5 §1."
   - Phiên chuẩn bị lệnh gọi; Owner chạy.
   - OpenCode nhận: ghi kết quả vào PR, không đổi code.
   - OpenCode từ chối: gửi một ký tự giữ chỗ, sửa chữ G5 §1 trong PR docs của bước dưới.

**Thứ tự:**
1. PR docs: chữ spec `phase-5-ai.md` §6.1 theo luật mục 2 (và G5 §1 nếu mục 4 cần). Owner duyệt và merge.
2. Lần gọi thật của mục 4 (Owner chạy).
3. PR code.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301 và các luật / cổng ở trên. Issue này gom các mục OPEN gắn **[T-290]**:
- còn lại của ghi chú #420;
- `extract-json.ts` (#521), `run.ts` lần thử lại (#521);
- ngưỡng test (#570);
- DR5-09 (#766);
- hai ghi chú không chặn của review #812 (Owner 25/10): `UNSURE` của Mock trích xuất, NIT nhánh `invalid_union` của `schemaDetail`.

Cổng: G2 / spec cho mục 2, G4 (và có thể G5) cho mục 4. Theo mẫu #728: PR docs Owner duyệt trước, PR code sau.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-290]
- `docs/design/phase-5-ai.md` §6.1 (cách đọc khối JSON, bị cắt), §5.1–§5.3
- `docs/design/phase-5-prompts.md` §1 (message), §5 (thử lại), §7 (so khớp), dòng 550
- `packages/ai/CLAUDE.md`
- `packages/ai/src/{text-match.ts,validator.ts,extract-json.ts,run.ts,web.ts}` + test tương ứng (`validator-blocklists.test.ts`, `extract-json.test.ts`, `web.test.ts`, `run.test.ts`)
- `tools/eval-ai.mjs`, `tools/eval-ai-core.mjs` (cách gọi OpenCode thật bằng key của máy, nếu dựa vào đó cho lần gọi thử)

##### File / thư mục được phép sửa

- `packages/ai/src/{text-match.ts,validator.ts,extract-json.ts,run.ts,web.ts}` + test
- `docs/design/phase-5-ai.md` (§6.1), `docs/design/phase-5-prompts.md` (§1 nếu mục 4 cần, G5)
- `tools/` (script gọi thử một lần, nếu cần; phần thuần có test theo luật `tools/*-core.mjs`)
- Owner 25/10 thêm (ghi chú review PR #812, `UNSURE` của Mock trích xuất; không Issue nào còn mở được sửa file này): `packages/ai/src/mock-adapter.ts` + test

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-290]**: gộp. Mục khác trùng file (T-288 cấu trúc `ai`, T-291 §11.8) để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Chữ prompt §2–§6 không đổi trừ khi mục 4 cần (khi đó tăng version, qua G5).
- Khối JSON đủ đầu tiên vẫn được ưu tiên như §6.1 hiện tại.

##### Test chấp nhận

- [ ] `detail` V3–V6 ghi đúng cụm như model viết (ca có dấu, ca không dấu); "PRUDENTIAL" ra một issue.
- [ ] Ví dụ của mục 2 bị cắt → lấy khối đủ. Trả lời bị cắt thật (khối chưa đóng) vẫn ra `CUT_ANSWER`.
- [ ] Ca DR5-09 không phụ thuộc thời gian máy (hoặc biên ≥ 10 lần, có số đo).
- [ ] Kết quả lần gọi thật ghi trong PR. Nếu đổi G5 §1 thì test so chữ prompt so chữ mới.

Ước lượng: ≈ 80 dòng SP + ≈ 150 dòng test + ≈ 20 dòng spec.

##### Định nghĩa hoàn thành

- [ ] PR docs (§6.1, và §1 nếu cần): mang nhãn `risk:high` như Issue (không `risk:low`), để `merge-pr` không cho Claude tự merge; Owner duyệt, Owner merge
- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-290] đã sửa sang RESOLVED

##### Rủi ro

risk:high

##### Bị chặn bởi

#777 (T-288)

## PR #820 — docs: take a whole JSON block after a prose brace of a cut answer, spec Phase 5 §6.1 (T-290)

Trạng thái: MERGED · merge 2026-10-24T20:18:14Z · commit `ccd07d7a58b55200a6d11a73934a54a2cdecc93f` · nhánh `task/T-290-cut-json-docs` · nhãn: type:task, risk:high, gate

Refs #779 (PR docs đi trước; PR code đi sau và đóng Issue)

Mục 2 của #779. Luật Owner duyệt 23/10/2026, nguyên văn: "Trả lời AI bị cắt mà phía sau vẫn có khối JSON đủ thì dùng khối đó (sửa spec Phase 5 §6.1)." PR này viết luật đó vào spec §6.1 để Owner duyệt chữ trước khi có PR code (theo mẫu #728).

#### Thay đổi

`docs/design/phase-5-ai.md` §6.1, ý **Trả lời bị cắt** (chỉ ý này):

- Dấu `{` chưa đóng **mở đầu như một object** (sau nó, bỏ khoảng trắng, là `"`) có thể là chính câu trả lời bị cắt. Khối nằm trong nó là mảnh của câu trả lời đó: không lấy, không đọc lại từ sau nó. Như hiện nay.
- Dấu `{` chưa đóng **của lời văn** (sau nó không phải `"`) đọc như ở trả lời không bị cắt: khối JSON đủ nằm sau nó vẫn lấy, kể cả khi chỗ cắt ở lời văn sau khối. Ví dụ của Issue: `Ghi chú { chưa đóng. {"a":1} rồi lời văn…` bị cắt → lấy `{"a":1}`, không tốn lần thử.
- Ghi rõ giới hạn: lời văn có `{` mà ngay sau là `"` (vd. `{"mẫu" …`) vẫn tính là mở object, nên khối sau nó không lấy. Ca hiếm, tốn một lần thử như hôm nay.
- "không có khối ngoài cùng đủ" đổi thành "Không lấy được khối nào", vì khối lấy được nay có thể nằm trong dấu `{` của lời văn.

**Vì sao phải phân biệt hai loại `{`.** Xét cấu trúc, `Ghi chú { chưa đóng. {"a":1} rồi…` và câu trả lời bị cắt `{"hypotheses": [{"text": "…", "evidence": ["F1"]}, ` giống hệt nhau: một `{` chưa đóng chứa một khối đủ. Chỉ ký tự đứng sau dấu `{` cho biết đó là lời văn hay object JSON. `extract-json.ts` đã dùng đúng phép kiểm này để bỏ qua "{theo mẫu}" mà không gọi `JSON.parse`.

**Đã thử trước khi đề xuất** (nhánh code `task/T-290-ai-match-cut-json`, chưa mở PR):

| Ca (trả lời bị cắt) | Hôm nay | Theo chữ mới |
|---|---|---|
| `Ghi chú { chưa đóng. {"a":1} rồi lời văn` (ví dụ của Issue) | `CUT_ANSWER` | lấy `{"a":1}` |
| `Ghi chú { chưa đóng. JSON: {"a": 1}` | `CUT_ANSWER` | lấy `{"a":1}` |
| `Ghi chú { một { hai. {"a":1} rồi` | `CUT_ANSWER` | lấy `{"a":1}` |
| `Lưu ý {mẫu "x. Kết quả: {"a":1} rồi` (dấu `"` lẻ, đọc lại) | `CUT_ANSWER` | lấy `{"a":1}` |
| `{"hypotheses": [{…, "evidence": ["F1"]}, {"text": "K` | `CUT_ANSWER` | `CUT_ANSWER` |
| `Ghi chú { chưa đóng. ` + câu trả lời bị cắt ở trên | `CUT_ANSWER` | `CUT_ANSWER` |
| `Lưu ý {mẫu "x. ` + câu trả lời bị cắt ở trên | `CUT_ANSWER` | `CUT_ANSWER` |
| `Lưu ý {"mẫu" chưa đóng. {"a":1} rồi` (giới hạn đã ghi) | `CUT_ANSWER` | `CUT_ANSWER` |

Toàn bộ 1 308 test của `packages/ai` và `tools/eval-ai-core.test.mjs` xanh trên nhánh đó. Code vẫn đọc một lượt (tối đa 4 lần đọc như hiện nay).

#### Test chấp nhận

- [ ] Owner duyệt chữ §6.1 (G2 / spec, #779 mục 2) trước PR code.
- Các mục còn lại của #779 là việc của PR code.

#### Lần gọi OpenCode thật (#779 mục 4, G4)

Đã chạy 25/10/2026 (Owner nhập key; script và kết quả ở các comment dưới):

- Gói Go: cả ba model bị 403 `AI_UNAUTHORIZED` ("An active OpenCode Go subscription is required…"). Gói Go của key đã hết hạn, nên lần này chưa trả lời được câu hỏi.
- Gói Credit, chỉ `deepseek-v4.1-flash` (Owner chọn, để đỡ tốn credit): **OpenCode nhận** message `assistant` rỗng (HTTP 2xx).

Theo #779 mục 4, OpenCode nhận thì không đổi code, không đổi G5 §1: **PR này giữ nguyên**, chỉ sửa §6.1. `glm-5.3` và `kimi-k3` chưa kiểm.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff`: không có mục nào nêu `docs/design/phase-5-ai.md`. Mục L54 [T-290] (`extract-json.ts`, chính luật này) là việc của PR code.

#### Kiểm tra

- [x] `pnpm verify`: không áp dụng. PR chỉ sửa `docs/design/phase-5-ai.md`, không test nào đọc file này, CI không chạy.
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

**Thứ tự:**

1. ✅ Lần gọi thử của mục 4 (G4): OpenCode nhận, PR này không thêm G5 §1.
2. Anh gõ "review PR #820" ở phiên sạch. Đạt thì anh merge (`risk:high`, `node tools/merge-pr.mjs 820 --owner`).
3. Sau đó mới mở PR code của #779.

Rủi ro: `risk:high` (như Issue; nhãn `gate`, Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #822 — fix(ai): quote V3–V6 as written, one issue per place, read a cut answer past a prose brace (T-290)

Trạng thái: MERGED · merge 2026-10-24T21:01:36Z · commit `d1a75e7efa9973efa5d20d3ac19e43745e8931fa` · nhánh `task/T-290-ai-match-cut-json` · nhãn: type:task, risk:high

Closes #779

Đi sau PR docs #820 (spec §6.1; `REVIEW: PASS`, Owner merge 25/10/2026). Lần gọi OpenCode thật của mục 4 (Owner 25/10/2026): OpenCode nhận message `assistant` rỗng, nên không đổi code (chi tiết ở mục 4).

#### Thay đổi

1. **V3–V6: `detail` ghi đúng đoạn model viết, một chỗ một issue** (`text-match.ts`, `validator.ts`; ghi chú #420, G5 §10.10: code, không thuộc G5).
   - Mỗi mục chặn trả vị trí (`Span`) thay vì chữ. `detail` trích đúng đoạn đó trong chữ của model, sau khi làm sạch như bước 0 của G5 §7 (bỏ ký tự vô hình, NFKC, dấu lạc thành dấu cách), giữ hoa thường, dấu và `-` / `_`: "Xac suat KH…" → `có "Xac suat"` (trước: `có "xác suất"`), "Hợp đồng Dai-ichi" → `có "Dai-ichi"`.
   - Các mục của cùng một luật tìm thấy ở những chỗ chồng nhau gộp thành một issue, nêu cả chỗ: "PRUDENTIAL" → một V4 `có "PRUDENTIAL"` (trước: `prudential` + `prud`); "nhóm máu AB" → một V5; "khoản 2 Điều 35" → một V6; "Gói bảo hiểm liên kết đơn vị" → một V4. Chỗ tách rời vẫn là nhiều issue (C1, C11). Trong một luật, issue theo thứ tự vị trí trong chữ.
   - Khớp / chặn không đổi: vẫn so trên bản có dấu và bản gốc như cũ, chỉ đổi phần báo. Bản có dấu gộp khoảng trắng, và chữ thường viết "İ" thành hai code unit, nên `inOriginal` đổi vị trí về bản gốc.
   - `blocklists.test.ts` kiểm từng mục bằng chỗ chính nó tìm thấy, để chỗ gộp ở validator không che một mục bị xóa.
2. **Trả lời bị cắt** (`extract-json.ts`; spec §6.1 theo #820): dấu `{` chưa đóng mở đầu như object (sau nó, bỏ khoảng trắng, là `"`) mới là mảnh của câu trả lời cụt; dấu `{` của lời văn đọc như ở trả lời không bị cắt, kể cả đọc lại khi có dấu `"` lẻ (vẫn tối đa 3 lần). `Ghi chú { chưa đóng. {"a":1} rồi lời văn…` bị cắt → lấy `{"a":1}`; câu trả lời cụt thật vẫn ra `CUT_ANSWER`, kể cả khi in thụt dòng (`{\n  "hypotheses"…`).
   - Chữ §6.1 (`docs/design/phase-5-ai.md:205`) theo hai ghi chú của review #820, luật không đổi: phép kiểm "mở đầu như object" viết một cách ("sau nó, bỏ khoảng trắng, …") ở cả ba câu; câu về `{` của lời văn ghi rõ "trừ khối nằm trong một dấu `{` mở đầu như object".
3. **Ngưỡng test** (ghi chú #570, #766):
   - `extract-json.test.ts`: ca "braces in a long text" dài 300 000 ký tự. Bản bậc hai trước T-199 mất 11,8–17 s (ngưỡng 500 ms → biên ≥ 23 lần; trước đây 1,2–1,8 s trên 100 000 ký tự, biên ≈ 2,4 lần); bản nay ≈ 1–2 ms. Số đo Home PC, 25/10/2026.
   - `web.test.ts` DR5-09: kiểm phần được đọc thay vì thời gian. Dòng khung `=== ĐẦU VÀO ===` đặt trọn trong 40 000 code unit đầu → `OWN_MESSAGE`; đặt ngay sau → `TOO_LONG`. Không còn phụ thuộc máy. Đo trên Home PC: đọc cả câu dán một dòng 0,11 s, nhiều dòng 2,4 s; đọc phần đầu 4–15 ms. Ngưỡng thời gian nới 10 lần (≈ 150 ms) sẽ không còn bắt được ca một dòng, nên không giữ.
4. **Message `assistant` rỗng ở lần thử lại** (`run.ts`, mục 4): lần gọi thật 25/10/2026, Owner nhập key, kết quả ở các comment của #820. Gói Go: cả ba model bị 403 `AI_UNAUTHORIZED` vì gói Go của key đã hết hạn. Gói Credit, chỉ `deepseek-v4.1-flash` (Owner chọn, để đỡ tốn credit): **OpenCode nhận** (HTTP 2xx). Theo Issue: không đổi code, không đổi G5 §1. `glm-5.3` và `kimi-k3` chưa kiểm.
5. **Mock trích xuất, `UNSURE`** (ghi chú review #812): thêm "chắc nịch", "bền chắc", "ăn chắc (mặc bền)" vào danh sách chữ chắc chắn; "cho / để chắc" và "không / chưa / chẳng" + tối đa hai chữ + "chắc" là nghi ngờ, kể cả trước "chắn". Sáu câu của ghi chú cho kết quả như ghi chú muốn.
   - Khác gợi ý "đảo luật" của ghi chú: giữ "mọi "chắc" là phỏng đoán, trừ danh sách". Lý do: đảo luật thì "KH chắc đã kết hôn." (đoán) sẽ ra đề xuất, ngược hướng an toàn CX-A4. Câu này có test.
   - Danh sách loại trừ xét ranh giới từ: "căn chắc" không phải "ăn chắc".
6. **`schemaDetail`, nhánh `invalid_union`** (NIT review #812): từ hai phương án trở lên nhận đúng kiểu của giá trị thì `detail` là message của union, không còn là luật của phương án đầu. Schema hiện tại không có union như vậy, nên `validator-union.test.ts` thay schema trích xuất bằng một union hai mẫu chuỗi (`vi.mock`).

#### Test chấp nhận

- [x] `detail` V3–V6 ghi đúng cụm như model viết (có dấu, không dấu, lẫn); "PRUDENTIAL" ra một issue (`validator-blocklists.test.ts`).
- [x] Ví dụ của mục 2 bị cắt → lấy khối đủ; trả lời bị cắt thật (khối chưa đóng) vẫn ra `CUT_ANSWER` (`extract-json.test.ts`).
- [x] Ca DR5-09 không phụ thuộc thời gian máy (`web.test.ts`).
- [x] Kết quả lần gọi thật ghi trong PR (mục 4; comment của #820). OpenCode nhận nên không đổi G5 §1.

Đột biến đã thử (đỏ đúng chỗ, rồi khôi phục): bỏ `inOriginal` → 3 ca "quotes the phrase as written" đỏ; bỏ gộp chỗ trùng → 8 ca đỏ; `isOwnMessage` đọc cả câu dán → 2 ca DR5-09 đỏ.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (9 mục "Trùng file"):

- L38 [T-290] (`text-match.ts` `phrase()` ghi tên mục; mục trùng sinh hai issue): **đã sửa** (mục 1).
- L54 [T-290] (`extract-json.ts`, khối đủ sau dấu `{` của lời văn khi bị cắt): **đã sửa** (mục 2).
- L68 [T-290] (ngưỡng 500 ms của "braces in a long text"): **đã sửa** (mục 3).
- L91 [T-297 #786] (chuỗi có ký tự vô hình thô trong `kyc-view.test.ts`): **để lại**. File cần sửa là `apps/desktop/src/routes/customers/kyc-view.test.ts`, ngoài danh sách file của #779. `validator-blocklists.test.ts` chỉ được nêu làm mẫu viết escape; PR này không thêm ký tự vô hình thô.
- L135 [T-290] (DR5-09 đo bằng thời gian): **đã sửa** (mục 3).
- L151 [T-290] (`UNSURE` của Mock): **đã sửa**, khác hướng gợi ý (mục 5).
- L152 [T-290] (NIT `schemaDetail` union): **đã sửa** (mục 6).
- L163 [T-290] (§6.1 viết phép kiểm "mở đầu như object" ba cách; thiếu ca trả lời cụt in thụt dòng): **đã sửa** (mục 2: chữ một cách, ca test mới).
- L164 [T-290] (§6.1 chưa nói câu nào thắng khi `{` mở object nằm sau `{` của lời văn): **đã sửa** (mục 2: "trừ khối nằm trong một dấu `{` mở đầu như object").
- L55 [T-290] (`run.ts`, message `assistant` rỗng; không ở danh sách "Trùng file" vì PR không sửa `run.ts`): **đã xử lý theo Issue**. Lần gọi thật cho thấy OpenCode nhận (`deepseek-v4.1-flash`, gói Credit), nên không đổi code (mục 4). Hai model còn lại chưa kiểm.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Cỡ: sản phẩm +106 / −34 (140 dòng), test +165 / −65 (230 dòng), spec 2 dòng, khối codemap 2 dòng; tổng 374 dòng.

Rủi ro: `risk:high` (như Issue; Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-290 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #420, #521, #570, #766, #812, #820 — T-290 (#779, PR #822, `REVIEW: PASS` @`b98b2b0`):
  - #420 (phần code), `packages/ai/src/text-match.ts`, `packages/ai/src/validator.ts`: mỗi mục chặn trả vị trí (`Span`) trong chữ đã làm sạch như bước 0 của G5 §7; `detail` V3–V6 trích đúng đoạn đó, giữ hoa thường, dấu và `-` / `_` ("Xac suat", "Dai-ichi", "ENFP-A"). Bản có dấu gộp khoảng trắng và viết "İ" thành hai code unit, nên `inOriginal` đổi vị trí về bản gốc. Các mục của cùng một luật tìm thấy ở những chỗ chồng nhau gộp thành một issue (`placesOf`): "PRUDENTIAL" một V4; chỗ tách rời vẫn là nhiều issue (C1, C11). Khớp / chặn không đổi. `packages/ai/src/blocklists.test.ts` kiểm từng mục bằng matcher thay vì `detail`; phần còn hở: mục review #822 ở OPEN.
  - #521, `packages/ai/src/extract-json.ts` (`cut`), theo spec Phase 5 §6.1 của PR #820: `{` chưa đóng mở đầu như object (sau nó, bỏ khoảng trắng, là `"`) là chỗ câu trả lời cụt có thể bắt đầu (`piece`): khối nằm trong nó không lấy, không đọc lại từ sau nó. `{` của lời văn đọc như ở trả lời không bị cắt, kể cả đọc lại khi có `"` lẻ (tối đa 3 lần): `Ghi chú { chưa đóng. {"a":1} rồi lời văn…` bị cắt → `{"a":1}`. Ca `{}` trong chữ của câu trả lời sau `{` + `"` lẻ của lời văn: mục review #822 ở OPEN.
  - #521, `packages/ai/src/run.ts` (message `assistant` rỗng ở lần thử lại): lần gọi OpenCode thật 25/10/2026 (Issue #779 mục 4, hai comment trên PR #820): gói Credit, `deepseek-v4.1-flash` nhận `content: ""` (HTTP 2xx); gói Go trả 403 vì gói của key đã hết hạn. Không đổi code, G5 §1 giữ nguyên; `glm-5.3`, `kimi-k3` không kiểm (Owner chọn, đỡ tốn credit).
  - #570, `packages/ai/src/extract-json.test.ts`: ca "braces in a long text" dài 300 000 ký tự; bản bậc hai trước T-199 mất 11,8–17 s với ngưỡng 500 ms (biên ≥ 23 lần), bản nay ≈ 1–2 ms (Home PC, 25/10).
  - #766 (DR5-09), `packages/ai/src/web.test.ts`: kiểm phần được đọc thay vì thời gian: dòng khung `=== ĐẦU VÀO ===` trọn trong 40 000 code unit đầu → `OWN_MESSAGE`, đặt ngay sau → `TOO_LONG`; không còn phụ thuộc máy.
  - #812, `packages/ai/src/mock-adapter.ts` (`UNSURE`): "chắc nịch", "bền chắc", "ăn chắc (mặc bền)" vào danh sách chữ chắc chắn, xét ranh giới từ ("căn chắc" không phải "ăn chắc"); "cho / để chắc" và "không / chưa / chẳng" + tối đa hai chữ + "chắc" là nghi ngờ, kể cả trước "chắn". Sáu câu của ghi chú cho kết quả như ghi chú muốn (`packages/ai/src/mock-adapter.test.ts`). Không đảo luật: đảo thì "KH chắc đã kết hôn." (đoán) ra đề xuất, ngược hướng an toàn CX-A4; câu này có test.
  - #812, NIT `schemaDetail` (`packages/ai/src/validator.ts`, nhánh `invalid_union`): từ hai phương án trở lên nhận đúng kiểu của giá trị thì `detail` là message của union; một phương án thì vẫn là luật của nó. Test `packages/ai/src/validator-union.test.ts` thay schema trích xuất bằng một union hai mẫu chuỗi (`vi.mock`).
  - #820, `docs/design/phase-5-ai.md` §6.1: phép kiểm "mở đầu như object" viết một cách ("sau nó, bỏ khoảng trắng, …") ở cả ba câu; câu về `{` của lời văn ghi "trừ khối nằm trong một dấu `{` mở đầu như object". Ca trả lời cụt in thụt dòng ở `packages/ai/src/extract-json.test.ts`.

---

# Issue #780 — T-291: Bảy luật duyệt 23/10: hash KYC và output_json khi nhập backup, output REJECTED lớn, chữ chỉ có ký tự vô hình, ngày nhanh đầu năm, thứ tự tên, VT / FF

Trạng thái: CLOSED · nhãn: type:task, risk:high, gate, ready-for-agent

##### Mục tiêu

Làm bảy luật Owner duyệt ngày 23/10 (G2 / G5). Trích nguyên văn đề xuất đã duyệt:

1. "Khi nhập backup, tính lại hash phiên bản KYC; sai thì từ chối." (S-1)
   - Owner 25/10 thêm (review #824): hash của mọi phiên bản KYC đúng dạng `kycHash` ghi (14 chữ số hex thường).
2. "Khi nhập backup, chỉ nhận `output_json` đúng dạng app ghi." (G5 §11.8)
   - Owner 25/10 (PR #824): chỉ `output_json`; `input_json`, `validator_json` giữ kiểm như nay.
3. "Dòng REJECTED có output trên 20 000 ký tự thì không lưu output; panel báo 'output quá lớn'." (G5 §11.8)
4. "Bước tiếp theo hoặc ghi chú lịch hẹn chỉ có ký tự vô hình thì coi là rỗng, giống tên và KYC." (DR6-72)
   - Áp cho mọi chữ tùy chọn của lịch hẹn đi qua `optionalText` (ghi chú, bước tiếp theo, lý do dời), ở cả ba nơi: lệnh, kiểm của form, nhập backup.
5. "Gõ ngày nhanh đầu năm: nếu ngày đó năm nay chưa tới, mà năm trước mới qua không quá 60 ngày, thì gợi ý năm trước." (đối xứng DR-39)
6. "Sắp tên: đổi chữ số toàn khổ / Ả Rập về chữ số thường trước khi so." (DR-48 / DR-88)
7. "Ký tự VT / FF trong ghi chú cũng tính là xuống dòng." (`normalizeNote`, K25)
   - Nếu cách ChatGPT web nhận ra tin nhắn của app tách dòng theo cùng tập ký tự (G5 §6a), giữ hai nơi khớp.

**Ba mục `db` của review #805 (Owner 24/10 gộp vào đây):** chỉ PR code, không vào PR docs của bảy luật, luật không đổi.

8. **Ai được tham chiếu trỏ tới, một nguồn:** `ownsRecords` (`packages/db/src/team.ts`) đang cộng tay ba field RE, còn luật 5 đọc `POINTS_TO` (`packages/db/src/backup-validation.ts`). Đặt bảng "kind trỏ tới RE hay người hỗ trợ" ở `packages/db/src/person-references.ts` (cạnh `ROWS`), rồi suy cả `POINTS_TO` lẫn `ownsRecords` từ bảng đó; câu hứa ở `packages/db/CLAUDE.md` nhắc bước này.
9. **Một cách đặt nháy danh sách SQL:** `quotedKinds` (`person-references.ts`) và `supportingRoles` (`backup-validation.ts`) dùng chung một helper. `list` của `packages/db/src/schema.ts` dùng lại helper đó nếu không gây import vòng (`common.ts` import `schema.ts`); không được thì để lại và ghi lý do trong PR.
10. **`PERSON_REFERENCES` không bị `MATERIALIZE`:** dạng `WITH refs … SELECT * FROM refs` làm SQLite ghi mọi tham chiếu vào bảng tạm khi câu nằm trong `IN (…)` (`IN_TRASH` của `team.ts`, hai câu của luật 5). Dựng câu ghép thường, tên cột đặt bằng `AS` ở nhánh đầu, sinh từ danh sách cột. Số đo của review #805 (dữ liệu tải): `IN_TRASH` 1,87 → 6,02 ms; luật 5 4,45 → 8,42 ms và 9,62 → 14,74 ms.

**Hai mục `ai` của review #822 (Owner 25/10 gộp vào đây):** chỉ PR code, không vào PR docs của bảy luật; không đổi luật, không đổi chữ G5.

11. **`{}` trong chữ của câu trả lời không thay câu trả lời:** `packages/ai/src/extract-json.ts` thử các khối trong `{` chưa đóng trước khi đọc lại. Lời văn có `{` rồi một dấu `"` lẻ trước JSON thì ở lượt đầu dấu `{` của câu trả lời nằm trong chuỗi, còn một `{}` trong chữ của câu trả lời được lấy: trả lời cụt ra `{}` thay cho `CUT_ANSWER` (trái spec Phase 5 §6.1), trả lời đủ và đúng bị báo V1, tốn một lần thử. Hướng gợi ý của review: chỉ thử các khối trong `{` chưa đóng ở lượt đọc cuối (lượt không đọc lại nữa). Bản thử của review đổi kết quả của vài chuỗi ngẫu nhiên khác theo cả hai chiều, nên PR nêu các ca đổi, hoặc lý do giữ cách hiện tại.
12. **Bỏ một mục của danh sách chặn thì test đỏ:** `packages/ai/src/blocklists.test.ts` (`foundIn`) không còn đỏ khi bỏ "sunlife" / "daiichi" khỏi `blocklists.ts`, vì "sun life", "dai-ichi" tìm ra đúng chữ đó. Thêm ca đếm số matcher của mỗi luật so với bảng G5 §8, hoặc so theo vị trí của matcher.

Theo quy tắc R2-02: dữ liệu giả lập; không viết migration, cảnh báo hay UI cho dữ liệu cũ sai; Owner nạp lại dữ liệu.

**Thứ tự (mẫu #728):**
1. PR docs: chữ của bảy luật trong spec. Owner duyệt và merge (G2 / G5).
   - luật nhập: `phase-3-du-lieu.md` §6;
   - `ai_analyses`: `phase-5-ai.md` §7.3;
   - G5 §11.8;
   - luật chữ / ngày / tên ở nơi spec đang ghi luật đó.
2. PR code.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301 và bảy luật trên (phiên Home PC 23/10). Issue này gom các mục OPEN gắn **[T-291]**:
- S-1 / D-1;
- hai mục G5 §11.8 (review #698);
- `optionalText` (review #686);
- phần "ngày nhanh đầu năm" của Domain (R3);
- thứ tự tên (review #738);
- ba mục `db` của review #805 (T-287, mục 8–10): không Issue nào còn mở được sửa `person-references.ts` / `team.ts`, Owner 24/10 chọn gộp vào đây vì Issue đã được sửa `backup-validation.ts` và `common.ts`;
- hai mục `ai` của review #822 (T-290, mục 11–12): không Issue nào còn mở được sửa `extract-json.ts` / `blocklists.test.ts`, Owner 25/10 chọn gộp vào đây vì Issue đã được sửa `packages/ai`;
- `normalizeNote` VT / FF (review #686).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-291]
- `docs/design/phase-3-du-lieu.md` §4 (lệnh, chuẩn hóa chữ), §6 (xuất / nhập backup, các luật nhập)
- `docs/design/phase-5-ai.md` §7.1, §7.3; `docs/design/phase-5-prompts.md` §6a, §11.5, §11.8
- `docs/reviews/2026-10-06-deep-review-phase-1-4-tong-hop.md` (DR-39, DR-48, DR-88)
- `packages/db/src/{backup-validation.ts,backup.ts,ai-analyses.ts,common.ts,kyc.ts}`; `packages/db/CLAUDE.md`
- Mục 8–10: `packages/db/src/{person-references.ts,team.ts,person-references.test.ts}`; comment review #805
- `packages/ai/src/{run.ts,validator.ts,web.ts}`
- Mục 11–12: `packages/ai/src/{extract-json.ts,extract-json.test.ts,blocklists.test.ts}`, `docs/design/phase-5-ai.md` §6.1; comment review #822
- `packages/domain/src/{period.ts,name-order.ts,text.ts,kyc.ts}` (`parseQuickDate`, `byName`, `normalizeNote`, `kycHash`)
- `apps/desktop/src/routes/appointments/outcome-form.ts`; `apps/desktop/src/routes/customers/ai-panel-view.ts` (`issueLine`, dòng REJECTED)

##### File / thư mục được phép sửa

- `docs/design/{phase-3-du-lieu.md,phase-5-ai.md,phase-5-prompts.md}` (PR docs); luật 5 ghi ở `docs/decisions/0007-dinh-nghia-chi-so-va-vong-doi.md`, nơi W8 đang ghi (mục Thứ tự: "nơi spec đang ghi luật đó"; PR #824)
- `packages/db/src/{backup-validation.ts,backup.ts,ai-analyses.ts,common.ts,kyc.ts}` + test
- `packages/db/src/{person-references.ts,team.ts}` + test, `packages/db/CLAUDE.md`, dòng `list` của `packages/db/src/schema.ts`: chỉ cho mục 8–10 (review #805, Owner 24/10)
- `packages/ai/src/{run.ts,validator.ts,web.ts}` + test
- Owner 25/10 thêm (PR #812 dời `analysisOutcome` sang file này): `packages/ai/src/analysis-steps.ts` + test
- Owner 25/10 thêm (review #822, mục 11–12): `packages/ai/src/extract-json.ts` + test, `packages/ai/src/blocklists.test.ts`
- `packages/domain/src/{period.ts,name-order.ts,text.ts}` + test
- `apps/desktop/src/routes/appointments/outcome-form.ts`, `apps/desktop/src/routes/customers/ai-panel-view.ts` + test
- `apps/desktop/src/i18n/vi.ts` (câu "output quá lớn", câu gợi ý năm trước)
- `e2e/` (ca ngày nhanh, panel REJECTED nếu cần)
- Owner 25/10 thêm (PR #824, luật 5): `apps/desktop/src/routes/appointments/appointment-form.ts` + test, `apps/desktop/src/routes/appointments/AppointmentDialog.tsx` (đọc và hiện gợi ý năm trước)
- Owner 25/10 thêm (PR #824, luật 3): `apps/desktop/src/routes/customers/KycHistory.tsx` (hộp 2k, dòng "Output quá lớn…")
- Owner 25/10 thêm (review #824, luật 4 và luật 5): `apps/desktop/src/routes/appointments/RescheduleFields.tsx` (dòng xem trước lý do dời của 6e kiểm rỗng bằng cùng hàm; gợi ý năm trước ở 6e cả khi chưa tick "Nhập bù")
- `docs/user-guide/{03-lich-hen.md,06-ai.md,10-su-co.md}`, `docs/testing/nghiem-thu-v1.md` (nếu câu / hành vi người dùng thấy đổi)

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-291]**: gộp. Mục khác trùng file (T-285 hàm chung của `period.ts`, T-287 / T-288 phần `db` / `ai`, T-292 `zod/mini`) để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Mã lỗi nhập như hiện có (`BACKUP_INVALID`), không thêm mã nếu không cần.
- Golden không sửa "cho xanh". Ca golden nào đổi theo luật mới thì nêu trong PR docs để Owner duyệt (G2).

##### Test chấp nhận

- [ ] Backup sửa tay hash của một `kyc_versions` → `BACKUP_INVALID`; backup do app xuất → nhập được. Hash của một phiên bản cũ không đúng 14 chữ số hex thường (chữ hoa, dài hơn, chữ khác) → `BACKUP_INVALID` (Owner 25/10, review #824).
- [ ] Backup có `output_json` khác dạng app ghi → `BACKUP_INVALID` (G5 §13.5; làm rõ theo review #824, Owner 25/10):
  - dòng `ACCEPTED`: khoảng trắng thừa, khóa lạ, U+FEFF hai đầu một chuỗi, khóa đổi thứ tự, thiếu giá trị mặc định;
  - dòng `REJECTED`: khoảng trắng thừa, khóa trùng, không phải object, dạng lưu trên 20 000 ký tự;
  - dòng `REJECTED` có khóa lạ, khóa khác thứ tự, chuỗi chưa cắt khoảng trắng (như app ghi) → nhập được.
- [ ] Hai lần thử trả output > 20 000 ký tự → dòng REJECTED có `output_json` null; panel hiện "output quá lớn". Dòng REJECTED không có khối JSON (`[NO_JSON]` / `[CUT_ANSWER]`) không hiện dòng đó; test giữ bất biến của G5 §13.2 (review #824).
- [ ] Bước tiếp theo chỉ có U+3164 / U+2800 / U+FE0F / U+0085 → lệnh từ chối như rỗng, form báo rỗng, nhập backup ra `BACKUP_INVALID`. Lý do dời chỉ có các ký tự đó → hộp 6e không hiện dòng xem trước "… · Ghi chú: …", lệnh không ghi gì vào `note` (Owner 25/10, review #824).
- [ ] Ngày nhanh, hôm nay 02/01/2027:
  - "28/12" → gợi ý 28/12/2026;
  - "15/03" → 15/03/2027, không gợi ý;
  - các ca DR-39 cũ giữ nguyên;
  - Dời lịch (6e) chưa tick "Nhập bù", gõ "28/12" → gợi ý 28/12/2026; bấm → lỗi "đã qua" và hiện ô "Nhập bù", app không tự tick; ở 6h gõ "28/12" → không có gợi ý năm trước (Owner 25/10, review #824 lần 3).
- [ ] Khoảng 2 300 tên trộn chữ số ASCII / toàn khổ / Ả Rập, xáo 20 lần, ra một thứ tự.
- [ ] Ghi chú có VT / FF lưu thành nhiều dòng.
- [ ] Mục 8: thêm một kind trỏ tới RE mà không sửa gì ngoài bảng của `person-references.ts` → `ownsRecords` và luật 5 cùng tính nó (đột biến ghi trong PR); RE còn bản ghi sống của kind đó không rời vai trò được.
- [ ] Mục 10: query plan của `IN_TRASH` và hai câu luật 5 không còn `MATERIALIZE`; số đo trước / sau trên dữ liệu tải ghi trong PR, kết quả giống hệt.
- [ ] Mục 11: `Lưu ý { x "y. ` + câu trả lời có một `text` chứa "{}": bị cắt → `CUT_ANSWER`; không bị cắt → lấy câu trả lời đủ. Các ca hiện có của `extract-json.test.ts` giữ nguyên, hoặc PR nêu ca đổi và lý do.
- [ ] Mục 12: bỏ "sunlife" (và một mục bất kỳ khác) khỏi `blocklists.ts` → `blocklists.test.ts` đỏ (đột biến ghi trong PR).
- [ ] Spec ghi đủ bảy luật; test so chữ G5 khớp §11.8 mới.

Ước lượng: ≈ 180 dòng SP + ≈ 250 dòng test + ≈ 40 dòng spec; mục 8–10 thêm ≈ 30 dòng SP + ≈ 40 dòng test; mục 11–12 thêm ≈ 10 dòng SP + ≈ 30 dòng test.

##### Định nghĩa hoàn thành

- [ ] PR docs (spec bảy luật): mang nhãn `risk:high` như Issue (không `risk:low`), để `merge-pr` không cho Claude tự merge; Owner duyệt, Owner merge
- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-291] đã sửa sang RESOLVED

##### Rủi ro

risk:high

##### Bị chặn bởi

#779 (T-290), #776 (T-287)

## PR #824 — docs: write the seven rules of T-291 into the spec for Owner review (T-291)

Trạng thái: MERGED · merge 2026-10-25T05:46:25Z · commit `cc65196391875139922ab70558ddf8bfd1b1ec1f` · nhánh `task/T-291-seven-rules-docs` · nhãn: type:task, risk:high, gate

Refs #780 (PR docs đi trước; PR code đi sau và đóng Issue)

Bảy luật Owner duyệt ngày 23/10/2026 (G2 / G5, #780). PR này viết chữ của bảy luật vào spec để anh duyệt chữ trước khi có PR code (mẫu #728, #820). Mục 8–12 của Issue là việc của PR code, không vào đây.

#### Thay đổi

| # | Luật đã duyệt (nguyên văn) | Chỗ ghi |
|---|---|---|
| 1 | "Khi nhập backup, tính lại hash phiên bản KYC; sai thì từ chối." | `phase-3-du-lieu.md` §6 luật 7 |
| 2 | "Khi nhập backup, chỉ nhận `output_json` đúng dạng app ghi." | `phase-5-ai.md` §7.3 luật 3; G5 §11.8, §13.3 |
| 3 | "Dòng REJECTED có output trên 20 000 ký tự thì không lưu output; panel báo 'output quá lớn'." | `phase-5-ai.md` §7.1, §9.1; G5 §11.8, §13.2 |
| 4 | "Bước tiếp theo hoặc ghi chú lịch hẹn chỉ có ký tự vô hình thì coi là rỗng, giống tên và KYC." | `phase-3-du-lieu.md` §4 (dòng mới "Chữ tùy chọn của lịch hẹn"), §6 kiểm giá trị |
| 5 | "Gõ ngày nhanh đầu năm: nếu ngày đó năm nay chưa tới, mà năm trước mới qua không quá 60 ngày, thì gợi ý năm trước." | ADR-0007 mục Nhập liệu (W8) + phụ lục mới |
| 6 | "Sắp tên: đổi chữ số toàn khổ / Ả Rập về chữ số thường trước khi so." | `phase-3-du-lieu.md` §4 (đoạn mới "Thứ tự tên") |
| 7 | "Ký tự VT / FF trong ghi chú cũng tính là xuống dòng." | `phase-3-du-lieu.md` §4; G5 §6a, §13.4; `phase-5-ai.md` §3.1 mục 3 |

Thêm: dòng trạng thái đầu file của ba spec; G5 §13 mới (luật 2, 3, 7: lý do, version, ca kiểm cho PR code; §13.6 việc không làm); hai mục của G5 §11.8 trỏ sang §13.

**Chỗ em phải chọn cách hiểu — anh xem kỹ:**

1. **Luật 1:** chỉ tính lại được hash của **phiên bản mới nhất** mỗi KH, bằng `kycHash` trên các dữ kiện đang hiệu lực. Phiên bản cũ hơn thì không: trạng thái dữ kiện lúc đó không lưu (`resolveKycConflict` đổi trạng thái mà không thêm dòng nào). Lệnh cũng chỉ đọc phiên bản mới nhất (`nextKycVersion` so hash mới với nó), nên đó là chỗ hash sai gây hại: ghi thừa một phiên bản, hoặc bỏ sót một lần KYC đổi. Em thêm hai điều app luôn giữ, `seed-invariants.test.ts` đã kiểm cho seed: KH có dữ kiện đang hiệu lực ⇔ có phiên bản; hai phiên bản liền nhau khác hash. Theo review, Owner 25/10 thêm: hash của mọi phiên bản đúng dạng `kycHash` ghi (14 chữ số hex thường). Sai → `BACKUP_INVALID`, `rule` 7.
2. **Luật 2:** "dạng app ghi": `ACCEPTED` là đúng chuỗi `JSON.stringify` của kết quả schema đọc ra (khóa theo thứ tự schema, không khóa lạ, chuỗi đã cắt khoảng trắng hai đầu, mặc định đã điền); `REJECTED` là `null`, hoặc object JSON đúng chuỗi `JSON.stringify` viết lại, ≤ 20 000 ký tự. `recordAiAnalysis` kiểm cùng hàm, nên dòng nào lệnh nhận thì vẫn nhập lại được (DR5-13).
3. **Luật 3:** đo trên chuỗi lưu (`JSON.stringify`), theo code point như `raw_output`. Panel phân biệt "output quá lớn" với "không có khối JSON" bằng báo cáo validator: lần không có JSON luôn có đúng một lỗi V1 ở `$`, cách panel đã dùng cho lần thử trước. Câu em đề xuất: **"Output quá lớn (trên 20 000 ký tự), app không lưu."**, dưới lỗi của lần thử cuối trong hộp 2k.
4. **Luật 4:** chỉ đổi phép kiểm rỗng (`normalizeText`). Chữ lưu vẫn là chữ người dùng gõ, cắt khoảng trắng hai đầu; ghi chú vẫn giữ xuống dòng. Nhập backup kiểm cả ba cột chữ tùy chọn (`trigger_note`, `next_step`, `note`), không chỉ `next_step` của cuộc hẹn `MET` như nay.
5. **Luật 5:** viết ở ADR-0007 vì W8 đang ghi ở đó. Mục "Thứ tự" của Issue cho ghi luật ngày "ở nơi spec đang ghi luật đó", nhưng ADR-0007 không có trong danh sách file của Issue. Câu gợi ý đối xứng câu năm sau của mockup 6b: **"<dd/mm/yyyy> còn <n> ngày nữa. Ý anh là <dd/mm/yyyy năm trước>?"** + nút "Dùng …"; dòng hướng dẫn **"App không tự đổi năm. Giữ nguyên là lịch hẹn năm nay."** Ô có gợi ý: lịch hẹn mới (6b) và Dời lịch (6e) cả khi chưa tick "Nhập bù" lẫn khi đã tick; ở 6e chưa tick, bấm gợi ý thì ra lỗi "đã qua" và hiện ô "Nhập bù" để RE tự tick (Owner chọn hướng (a) của review lần 3). Ô chỉ nhận từ hôm nay (hẹn tiếp 6h) không gợi ý. Ô chỉ nhận ngày đã qua (ngày tạo KH, chuyển nhóm tay, ngày HĐ) giữ như nay: đã báo lỗi kèm nhắc gõ đủ năm. Ô ngày của hộp Sửa kết quả (6f) cũng giữ như nay, không gợi ý năm nào (thêm theo review).
6. **Luật 6:** chưa spec nào ghi thứ tự tên (chỉ doc comment của `byName`), nên em thêm đoạn "Thứ tự tên" ở `phase-3-du-lieu.md` §4, chỗ đọc dữ liệu.
7. **Luật 7:** G5 §6a tách dòng theo cùng tập ký tự với ghi chú KYC, nên thêm VT, FF ở cả hai nơi, theo điều kiện "giữ hai nơi khớp" của Issue.

**Version prompt:** không đổi (`analysis@4`, `discovery@4`, `extraction@1`, `web@1`; G5 §13.1). **Golden:** không ca nào đổi. Không ca golden nào đọc ngày nhanh, hash KYC hay `output_json`; golden, seed và e2e không có tên mang chữ số không phải ASCII.

#### Đã thử trước khi đề xuất

Script tạm ngoài repo, không commit. Dữ liệu giả lập hạt giống 1, hạt giống 6 có Thùng rác, và dữ liệu tải (`LOAD_SCALE`, neo 12/10/2026, hạt giống 6). Luật 5, 6 thử trên bản dựng thử của hàm.

| Luật | Đo trên | Kết quả |
|---|---|---|
| 1 | phiên bản KYC của 1 200 / 1 200 / 1 496 KH | 0 hash mới nhất sai, 0 KH có dữ kiện mà không có phiên bản (hay ngược lại), 0 cặp liền nhau trùng hash |
| 2 | 63 / 51 / 103 dòng `ai_analyses` (đều ACCEPTED: seed không có REJECTED) | 217 / 217 đúng dạng |
| 4 | 6 229 / 6 206 / 10 414 cuộc hẹn | 0 chữ tùy chọn sai dạng |
| 5 | mọi `d/m` (d 0–32, m 0–13) × mọi hôm nay 01/01/2026–31/12/2029 = 674 982 lần | 7 320 lần có gợi ý năm trước, 0 lần cùng gợi ý năm sau, muộn nhất hôm nay 01/03 |
| 6 | 2 300 tên trộn chữ số ASCII / toàn khổ / Ả Rập, xáo 20 lần | hôm nay ra 20 thứ tự; đổi chữ số trước khi so ra 1. 284 tên chỉ có chữ số ASCII: thứ tự như nay |

Dữ liệu do app ghi đã đúng các luật mới, nên không phải nạp lại dữ liệu giả lập vì PR code (R2-02).

#### Quyết định thêm của Owner (25/10/2026)

Owner trả lời trong chat 25/10/2026: "Đồng ý thêm appointment-form.ts + test, AppointmentDialog.tsx và KycHistory.tsx vào file được phép của Issue #780. input_json / validator_json giữ nguyên như em đề xuất."

- **File thêm cho PR code**, đã ghi vào Issue #780:
  - `apps/desktop/src/routes/appointments/appointment-form.ts` + test và `AppointmentDialog.tsx` (`DateSuggestion`): nơi đọc và hiện gợi ý ngày (luật 5);
  - `apps/desktop/src/routes/customers/KycHistory.tsx`: hộp 2k hiện dòng "Output quá lớn…" (luật 3).

  Issue #780 cũng ghi rõ luật 5 viết ở ADR-0007, theo mục "Thứ tự" của chính Issue.
- **`input_json`, `validator_json` giữ nguyên.** Hai cột này vẫn chỉ được kiểm "qua schema đầu vào" / "là JSON hợp lệ", nên backup sửa tay vẫn mang được khoảng trắng thừa ở đó, và `validator_json` nhận JSON bất kỳ. Luật 2 chỉ áp cho `output_json`. Ghi ở G5 §13.6 "Không làm trong đợt này", để review sau không nêu lại thành phát hiện mới.

#### Sửa theo review (`REVIEW: PASS` @`e63f44f`; Owner 25/10/2026: "đưa các chỗ làm rõ vào chữ được duyệt")

Review không có mục chặn. Owner bảo đưa các chỗ làm rõ vào chữ, nhất là tách ca kiểm §13.5 theo ACCEPTED / REJECTED và thêm một câu về ô 6f. Từng ghi chú của review:

- **Spec, ô 6f** (`0007-dinh-nghia-chi-so-va-vong-doi.md`): phụ lục thêm câu "ô ngày của hộp Sửa kết quả (6f) giữ như nay, không gợi ý năm nào", kể cả khi trạng thái KH hủy cho nhận ngày tương lai.
- **NIT, §13 thiếu mục Owner duyệt**: thêm G5 §13.7, có cả §13.6.
- **Mùi code, tập tách dòng ở hai nơi**: G5 §13.4 ghi cho PR code dùng một hằng ở `domain` (`text.ts`) cho cả `normalizeNote` lẫn `web.ts`. Đổi tập này vẫn là đổi §6a (G5) và spec Phase 3 §4 (G2).
- **Correctness 1, ca kiểm §13.5 không tách ACCEPTED / REJECTED**:
  - §13.5 tách ba nhóm: ACCEPTED sai dạng; REJECTED sai dạng (khoảng trắng, khóa trùng, không phải object, dạng lưu trên 20 000); REJECTED có khóa lạ / thứ tự khác / chuỗi chưa cắt vẫn nhập được.
  - §13.3 nói thẳng vì sao REJECTED giữ những thứ đó.
  - Test chấp nhận của Issue #780 sửa theo.
- **Correctness 2, bất biến mà cách nhận "output quá lớn" dựa vào**:
  - G5 §13.2 ghi bất biến và điều làm mất nó;
  - §13.5 thêm ca ngược (`[NO_JSON]` / `[CUT_ANSWER]` → không có dòng "Output quá lớn…") và test giữ bất biến ở `validator.test.ts`;
  - spec Phase 5 §9.1 trỏ tới §13.2; Issue #780 sửa theo.
- **Correctness 3, dạng hash của các phiên bản KYC cũ**: review ghi việc này nằm ngoài chữ luật 1 đã duyệt. Owner 25/10/2026 chọn thêm: "Thêm vào luật 1: hash của mọi phiên bản KYC đúng dạng kycHash ghi (14 chữ số hex thường)."
  - Spec Phase 3 §6 luật 7 ghi thêm luật này; Issue #780 thêm vào luật 1 và vào test chấp nhận.
  - Đã thử: 9 726 / 9 687 / 13 114 phiên bản của hai bộ dữ liệu giả lập và dữ liệu tải đều đúng 14 chữ số hex thường.
- **NIT 4, `trim` không cắt U+0085**: spec Phase 3 §4 và §6 ghi rõ cắt như `optionalText` (`trim` của JS, U+0085 ở hai đầu vẫn giữ). Như vậy kiểm khi nhập không từ chối dòng do app ghi.

#### Sửa theo review lần 2 (`REVIEW: PASS` @`8d8f3f8`)

Owner 25/10/2026, trong phiên review-2 (chuyển sang phiên code vì phiên review không commit): "Chưa merge. Thêm dòng xem trước lý do dời của 6e vào luật 4 (và thêm RescheduleFields.tsx vào file được phép của #780) trước, rồi review lại."

- **Spec, dòng xem trước lý do dời của 6e** (`phase-3-du-lieu.md` §4, dòng "Chữ tùy chọn của lịch hẹn"): dòng `reschedule.historyRead` của hộp Dời lịch cũng kiểm rỗng bằng `normalizeText`. Lý do rỗng thì không hiện dòng này, vì lệnh không ghi gì vào `note`. Lý do có chữ thì dòng hiện đúng chữ lệnh sẽ lưu. Hôm nay dòng này hiện khi `form.reason.trim() !== ''` (`RescheduleFields.tsx:132`), nên lý do chỉ có U+3164 / U+2800 / U+FE0F / U+0085 sẽ hứa một ghi chú mà lệnh không ghi.
- **Issue #780**: thêm `apps/desktop/src/routes/appointments/RescheduleFields.tsx` vào file được phép ("Owner 25/10 thêm (review #824, luật 4)"). Test chấp nhận của luật 4 thêm ca: lý do dời chỉ có các ký tự đó → không hiện dòng xem trước, lệnh không ghi gì vào `note`.
- Mùi tên "lý do hẹn" (`trigger_note`) cùng comment: Owner chưa quyết, để nguyên.

#### Sửa theo review lần 3 (`REVIEW: PASS` @`9e8e116`)

Owner 25/10/2026, trong phiên review-2 (chuyển sang phiên code): "Chưa merge. Sửa phụ lục ADR-0007 cho 6e theo hướng (a) trước, rồi review lại."

- **Correctness 1, gợi ý năm trước ở 6e** (`0007-dinh-nghia-chi-so-va-vong-doi.md`, bullet "Ô có gợi ý"). Ô "Nhập bù" chỉ hiện sau khi đã gõ một ngày đã qua (`RescheduleFields.tsx:102`; `backfill` khởi đầu `false`). Vì vậy chữ cũ ("dời lịch nhập bù") gần như không tới được ca luật nhắm tới: hôm nay 02/01/2027 gõ "28/12" thì đọc thành 28/12/2027, không có gợi ý, lưu được lịch dời sang năm sau. Theo hướng (a), phụ lục giờ ghi:
  - 6e có gợi ý cả khi chưa tick "Nhập bù" lẫn khi đã tick;
  - ở 6e chưa tick, bấm gợi ý thì ngày thành ngày đã qua: ô báo lỗi "đã qua" (`reschedule.past`) và hiện ô "Nhập bù". RE tự tick; app không tự tick, không tự đổi năm;
  - nhóm "chỉ nhận ngày từ hôm nay" chỉ còn 6h, vì ngày đó đã qua và ô không có đường nhập bù.
- **Issue #780**: test chấp nhận luật 5 thêm ca 6e / 6h; dòng file được phép `RescheduleFields.tsx` ghi thêm luật 5.
- Không làm (Owner chưa bảo): ngày ghi chú KYC trong danh sách ô chỉ nhận ngày đã qua; NIT về chữ số đầu của `kycHash`.

Head đổi sau `REVIEW: PASS` @`9e8e116`, nên cần review lại ở phiên sạch.

#### Test chấp nhận

- [ ] Owner duyệt chữ bảy luật (G2 / G5, #780) trước PR code: merge PR này
- Các mục còn lại của #780 là việc của PR code; ca kiểm của luật 2, 3, 7 ở G5 §13.5.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff`: không có mục OPEN nào nêu bốn file của PR này. Các mục [T-291] của sổ là việc của PR code.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (file G5 có test đọc nguyên văn, nên CI chạy)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

**Thứ tự:**

1. ✅ Owner trả lời hai câu thêm (25/10/2026): ba file vào Issue #780; `input_json` / `validator_json` giữ nguyên (G5 §13.6).
2. ✅ Review lần 1: PASS @`e63f44f`, không mục chặn. Mọi ghi chú đã vào chữ (mục "Sửa theo review"), gồm dạng hash của mọi phiên bản KYC (Owner chọn thêm 25/10/2026).
3. ✅ Review lần 2: PASS @`8d8f3f8`, không mục chặn. Owner bảo thêm dòng xem trước lý do dời của 6e vào luật 4 trước khi merge (mục "Sửa theo review lần 2").
4. ✅ Review lần 3: PASS @`9e8e116`, không mục chặn. Owner chọn hướng (a) cho gợi ý năm trước ở 6e (mục "Sửa theo review lần 3").
5. CI xanh trên head mới → anh gõ "review PR #824" ở phiên sạch. Đạt thì anh merge (`risk:high`: `node tools/merge-pr.mjs 824 --owner`).
6. Sau đó em mở PR code của #780 (mục 1–12).

Rủi ro: `risk:high` (như Issue; nhãn `gate`, Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #828 — fix: the seven rules of T-291 and five notes of the reviews of PR 805 and PR 822 (T-291)

Trạng thái: MERGED · merge 2026-10-25T08:14:12Z · commit `7cdc4326beb67350ac87021c46092c002040ade6` · nhánh `task/T-291-seven-rules` · nhãn: type:task, risk:high

Closes #780

PR code của T-291: bảy luật Owner duyệt 23/10/2026 (chữ đã vào spec ở PR #824, Owner merge 25/10) và năm mục gộp từ review #805 (mục 8–10) và #822 (mục 11–12). Không đổi version prompt (`analysis@4`, `discovery@4`, `extraction@1`, `web@1`), không đổi golden, không thêm mã lỗi.

#### Thay đổi

##### Bảy luật

1. **Hash phiên bản KYC khi nhập backup** (S-1; spec Phase 3 §6 luật 7) — `versionsFit` ở `packages/db/src/backup-validation.ts`, cuối luật 7: KH có dữ kiện đang hiệu lực thì có phiên bản và ngược lại; `hash` của phiên bản mới nhất (theo `seq`) bằng `kycHash` tính lại trên các dữ kiện đó; hai phiên bản liền nhau khác hash; mọi hash khớp `/^[0-9a-f]{14}$/` (đúng chữ spec, xem L153 bên dưới). Sai → `BACKUP_INVALID`, `rule: 7`.
2. **`output_json` đúng dạng app ghi** (G5 §13.3; spec Phase 5 §7.3 luật 3) — `analysisContentFits` (`packages/db/src/ai-analyses.ts`) nay đọc **chuỗi sẽ lưu** (`AnalysisFields.outputJson`), cả lệnh lẫn nhập backup:
   - `ACCEPTED`: đúng `JSON.stringify` của output mà schema của `mode` đọc ra;
   - `REJECTED`: `null`, hoặc một object JSON đúng chuỗi `JSON.stringify` viết lại nó, tối đa 20 000 code point.
   `recordAiAnalysis` kiểm chuỗi nó sẽ lưu: output không đúng dạng (khóa lạ, khóa khác thứ tự, chuỗi chưa cắt, thiếu mặc định, REJECTED không phải object hay quá 20 000) → `AI_ANALYSIS_INVALID`. App không bao giờ gửi như vậy (`analysisOutcome` lưu kết quả schema đọc ra / kết quả parse).
3. **REJECTED có output lớn** (G5 §13.2; spec Phase 5 §7.1, §9.1):
   - `analysisOutcome` (`packages/ai/src/analysis-steps.ts`): dạng lưu (`JSON.stringify` của khối đã parse) quá 20 000 code point → `output` = `null`; `raw_output` như cũ;
   - panel (`apps/desktop/src/routes/customers/ai-panel-view.ts`): mọi lần thử, kể cả lần cuối, nhận "không có khối JSON" bằng báo cáo (đúng một lỗi V1 ở `$`), không còn bằng `output === null`; `rejectedReport` thêm `outputTooLarge` (lần cuối có khối mà `output` null);
   - hộp 2k (`KycHistory.tsx`): dòng "Output quá lớn (trên 20.000 ký tự), app không lưu." dưới lỗi của các lần thử. Số lấy từ `MAX_AI_RAW_OUTPUT`, định dạng qua slot `{count}` (không viết cứng, như ghi chú L133 khuyên cho câu khác).
4. **Chữ tùy chọn của lịch hẹn chỉ có ký tự vô hình là rỗng** (DR6-72; spec Phase 3 §4, §6) — `optionalText` (`packages/db/src/common.ts`) cắt bằng `trim` của JS như cũ và kiểm rỗng bằng `normalizeText`; nhập backup kiểm `trigger_note`, `next_step`, `note` của mọi lịch hẹn, kể cả đã xóa, như lệnh lưu (`appointmentTextStored`); form 6c (`readOutcome`) và dòng xem trước lý do dời của 6e (`rescheduleReason`, `RescheduleFields.tsx`) kiểm bằng cùng hàm.
5. **Ngày nhanh đầu năm** (ADR-0007 phụ lục) — `parseQuickDate` thêm `previousYearSuggestion`; `readScheduleDate` thêm chế độ `reschedule` (6e chưa tick "Nhập bù": vẫn từ chối ngày đã qua nhưng có gợi ý năm trước). Gợi ý ở 6b và 6e, không ở 6h (`fromToday`); `DateSuggestion` hiện "<ngày> còn <n> ngày nữa. Ý anh là <ngày năm trước>?", 6b kèm "App không tự đổi năm. Giữ nguyên là lịch hẹn năm nay." Thử lại đúng con số của spec: 674 982 lần đọc, 7 320 lần có gợi ý năm trước, 0 lần cùng gợi ý năm sau, muộn nhất hôm nay 01/03 năm không nhuận gõ "31/12".
6. **Thứ tự tên** (DR-48 / DR-88) — `byName` đọc mỗi chữ số `\p{Nd}` thành chữ số ASCII trước khi qua collator (giá trị = khoảng cách tới đầu dãy chữ số, vì Unicode xếp mỗi bộ 0–9 liền nhau). Lối tắt `LATIN`: tên chỉ có ASCII, chữ Latinh và dấu tổ hợp (mọi tên tiếng Việt) bỏ qua bước thay; không có lối tắt thì sắp 20 000 tên chậm gấp 6 (17 → 105 ms), có lối tắt 17 → ~31 ms (1 500 KH của dữ liệu tải: < 1 ms chênh).
7. **VT / FF là xuống dòng** (K25; G5 §13.4) — hằng `LINE_BREAK` ở `packages/domain/src/text.ts`, `normalizeNote` và `isOwnMessage` của `web.ts` cùng dùng.

##### Mục 8–12

8. **`POINTS_TO` một nguồn** — bảng "kind trỏ tới RE hay người hỗ trợ" dời sang `packages/db/src/person-references.ts` cạnh `ROWS`; `ownsRecords` (`team.ts`) và luật 5 cùng đọc. Câu hứa ở `packages/db/CLAUDE.md` nhắc bước này (rút gọn để bản đồ export vẫn đủ trong ngân sách 8 000 ký tự).
9. **Một helper đặt nháy danh sách SQL** — `sqlTexts` ở `common.ts`, `quotedKinds` và vai trò hỗ trợ của luật 5 dùng chung (thêm: nhân đôi dấu `'` bên trong). `list` của `schema.ts` **để lại**: `common.ts` import `schema.ts`, nên `schema.ts` import `common.ts` là import vòng, rule `no-circular` của dependency-cruiser chặn.
10. **`PERSON_REFERENCES` không bị `MATERIALIZE`** — câu ghép thường, tên cột bằng `AS` ở nhánh đầu, sinh từ `COLUMNS` (đúng dạng trước #805). Câu "RE phối hợp chính lịch của mình" của luật 5 đọc danh sách **một lượt** (`GROUP BY appointment_id, person_id HAVING COUNT(DISTINCT kind) = 2`) thay cho tự nối: tự nối hai câu con buộc SQLite `MATERIALIZE` một bên để dựng index tạm, cả trước #805. Số đo ở mục Số đo.
11. **`extractJson`**: chỉ lượt đọc cuối (lượt không đọc lại nữa) thử các khối trong `{` chưa đóng, theo hướng review #822. Các ca đổi ở mục 11 bên dưới.
12. **`blocklists.test.ts`**: ca đếm matcher mỗi luật so với bảng G5 §8 (mục cụm, mục ký tự, mỗi dòng regex một matcher, tiền tố "pru" của §8.2 b). Đếm thay vì so theo vị trí: tiền tố "pru" là regex trong lời văn giữa hai bảng của §8.2, không có dòng bảng để ghép vị trí.

##### Khác

- Hai chữ spec từ review #824 (L151, L152): `phase-3-du-lieu.md` gọi `trigger_note` là "mô tả trigger" (nhãn ô, §3.5); ADR-0007 phụ lục thêm "ngày ghi chú KYC" vào nhóm ô chỉ nhận ngày đã qua (đã kiểm trên code: `useDateField` → `parseRecordDate` báo `future`, không gợi ý năm).
- Hướng dẫn sử dụng: `03-lich-hen.md` (gợi ý năm trước ở tạo lịch và Dời lịch), `06-ai.md` (dòng "Output quá lớn…").
- `docs/testing/nghiem-thu-v1.md` không đổi: gợi ý năm trước chỉ thấy đầu năm (cần đổi đồng hồ máy) và output REJECTED quá lớn cần model trả > 20 000 ký tự hai lần; hai hành vi do e2e / unit phủ.
- Test cũ phải chỉnh theo luật mới (không phải golden):
  - `backup.test.ts`: ca "U+FEFF ở cuối chữ đọc lại nguyên" đặt U+FEFF cuối mã KH thay cho ghi chú lịch hẹn (ghi chú có U+FEFF cuối nay trái luật 4: `trim` bỏ nó);
  - `backup-invariants.test.ts`: các ca sửa tay dữ kiện KYC (ca chấp nhận, ca luật 10) tính lại hash phiên bản mới nhất (`rehash`), như lệnh KYC ghi; nếu không thì chúng trượt luật 7 mới thay vì luật đang thử;
  - `period.test.ts`: ba ca `toEqual` thêm `previousYearSuggestion: null`;
  - `ai-panel-view.test.ts`: `rejectedReport` có thêm `outputTooLarge`.

#### Test chấp nhận

- [x] Backup sửa tay hash của một `kyc_versions` → `BACKUP_INVALID`; backup do app xuất → nhập được; hash cũ chữ hoa / dài hơn / chữ khác → `BACKUP_INVALID` — `backup-invariants.test.ts` (7 ca "7: …" mới; các ca "accepts …" và seed 2 / 11 / 42 nhập được).
- [x] `output_json` khác dạng app ghi → `BACKUP_INVALID`: ACCEPTED (khoảng trắng, khóa lạ, U+FEFF hai đầu, đổi thứ tự khóa, thiếu mặc định), REJECTED (khoảng trắng, khóa trùng, không phải object `[]` / `"x"` / `1` / `null`, > 20 000); REJECTED có khóa lạ / khác thứ tự / chuỗi chưa cắt, và đúng 20 000 → nhập được — `backup-invariants.test.ts`; lệnh: `ai-analyses.test.ts`.
- [x] Hai lần thử trả output > 20 000 ký tự → REJECTED `output` null, đúng 20 000 → giữ (đếm code point) — `run.test.ts`; panel `outputTooLarge` + dòng "Output quá lớn (trên 20.000 ký tự), app không lưu." — `ai-panel-view.test.ts`; `[NO_JSON]` / `[CUT_ANSWER]` không hiện dòng đó; bất biến G5 §13.2 (`{}`, khóa lạ, sai kiểu, > 30 lỗi không ra đúng một V1 ở `$`) — `validator.test.ts`.
- [x] Bước tiếp theo chỉ U+3164 / U+2800 / U+FE0F / U+0085 → lệnh `OUTCOME_REQUIRED` (`appointments.test.ts`), form báo rỗng (`outcome-form.test.ts`), nhập backup `BACKUP_INVALID` (`backup-invariants.test.ts`); lý do dời như vậy → `note` không đổi (`appointments.test.ts`), dòng xem trước 6e không hiện (`rescheduleReason`, `appointment-form.test.ts`).
- [x] Ngày nhanh, hôm nay 02/01/2027: "28/12" → gợi ý 28/12/2026; "15/03" → không gợi ý; ca DR-39 cũ giữ nguyên — `period.test.ts`, `appointment-form.test.ts`, `DateSuggestion.test.tsx`; 6e chưa tick "Nhập bù": gợi ý → bấm → lỗi "đã qua" + ô "Nhập bù" chưa tick; 6h không gợi ý; 6b có dòng hướng dẫn — e2e `appointment-outcome.spec.ts` ("early in the year …").
- [x] 2 022 tên trộn chữ số ASCII / toàn khổ / Ả Rập (mọi tên 1–4 ký tự của `01１٢aA `, sau gộp khoảng trắng), xáo 20 lần → một thứ tự — `name-order.test.ts` (đỏ trước khi sửa: 20 thứ tự khác nhau).
- [x] Ghi chú có VT / FF → nhiều dòng — `text.test.ts`; tin nhắn `web@1` / message thử lại tách bằng VT / FF → `OWN_MESSAGE` ở lần 1 và lần 2, phiên còn mở — `web.test.ts`.
- [x] Mục 8: `ownsRecords` và luật 5 cùng đọc `POINTS_TO` — `person-references.test.ts`; đột biến ở mục Đột biến.
- [x] Mục 10: query plan không còn `MATERIALIZE` (`person-references.test.ts`); số đo trước / sau, kết quả giống hệt — mục Số đo.
- [x] Mục 11: `Lưu ý { x "y. ` + câu trả lời có `text` chứa "{}": bị cắt → không lấy gì (`CUT_ANSWER`); không bị cắt → câu trả lời đủ — `extract-json.test.ts`; mọi ca cũ giữ nguyên.
- [x] Mục 12: bỏ "sunlife" (hay "daiichi", hay "dễ chốt") khỏi `blocklists.ts` → đỏ — mục Đột biến.
- [x] Spec ghi đủ bảy luật (PR #824); `prompts.test.ts` (so chữ G5) xanh, không đổi chữ G5.

#### Mục 11: các ca đổi kết quả

So bản cũ / mới của `extractJson` (script tạm ngoài repo):

- **Chuỗi ngẫu nhiên** (ký tự `{ } " \ : , 1 a [ ]` và dấu cách, dài 1–24, `cut` ngẫu nhiên, 600 000 lần đọc): 50 ca đổi, **cùng một chiều**: bản cũ lấy `{}`, bản mới không lấy gì. Ví dụ `{,1]],a"1{"{}` (cut): ở lượt đọc lại, `{}` nằm trong chuỗi của một `{` mở như object.
- **Chuỗi giống câu trả lời** (lời văn 0–7 mẩu `{ } " \ : . a Lưu ý` xuống dòng, rồi một câu trả lời JSON có `text` chứa `{}` / `"` / `{` / `}`, một phần ba bị cắt ở chỗ ngẫu nhiên, nửa số đó biết bị cắt; 3 hạt giống × 600 000), chấm theo spec §6.1 (đủ → đúng là lấy cả câu trả lời; cắt và biết → đúng là không lấy gì):
  - sửa đúng: 2 121 / 2 163 / 2 089 — đa số bản cũ lấy `{}` trong chữ của câu trả lời, bản mới lấy cả câu trả lời (lỗi review #822 mô tả), hoặc không lấy gì khi câu trả lời bị cắt;
  - làm sai: 102 / 85 / 94 — lời văn có `{` rồi một `{…}` đặt trong nháy (vd. `}{a"{}"{"hypotheses":[…]}`): ở lượt đọc lại, nháy của lời văn là chữ thường nên `{}` đó thành khối ngoài cùng và được lấy trước câu trả lời; bản cũ lấy được câu trả lời ở lượt đầu;
  - sai cả hai: 81 / 84 / 103; câu trả lời bị cắt mà không biết (không có đáp án đúng): 330 / 320 / 366.
- Giữ hướng của review: sửa đúng gấp ~20 lần làm sai trên chuỗi giống câu trả lời, và ca sửa đúng là ca spec §6.1 nêu đích danh. Cả hai loại ca đều cần lời văn có `{` chưa đóng cùng nháy, hiếm ở câu trả lời thật; khối lấy nhầm không qua schema nên không ACCEPTED nhầm (V1, tốn một lần thử). Owner muốn giữ cách cũ thì bỏ mục 11 khỏi PR này.

#### Đột biến (chạy trên bản sao, đã khôi phục)

- Mục 8: thay kind `policy` bằng kind mới `contract` trỏ tới RE (bảng của `person-references.ts`), đếm ở field mới `contracts` (`USAGE_FIELDS`), không sửa gì khác:
  - với `ownsRecords` của PR: ca "keeps the person of a kind pointing to an RE an RE, as rule 5 does, by POINTS_TO" xanh (`ownsRecords` và luật 5 cùng tính kind mới); chỉ ca "reads each column … as a kind of its own" đỏ, đúng ý ca đó (nó ghim tên kind của mỗi cột);
  - với `ownsRecords` cũ (cộng tay ba field): ca trên đỏ thêm, "contract: expected false to be true" (RE chỉ còn HĐ rời vai trò được).
- Mục 12: bỏ "sunlife" → chỉ ca đếm V4 đỏ (1 / 297); bỏ "daiichi" → như vậy; bỏ "dễ chốt" → ca đếm V3 và ca "catches" đỏ.
- Luật 2: bỏ so chuỗi ACCEPTED với `JSON.stringify(result.data)` → 5 ca "13: an accepted output …" đỏ; thay kiểm REJECTED bằng "parse được" → 2 ca của lệnh và 7 ca "13: a rejected output …" đỏ.
- Bất biến G5 §13.2: `MAX_ISSUES = 1` → 4 ca "never reports … as one V1 issue" đỏ.

#### Số đo

Dữ liệu tải (`LOAD_SCALE`, neo 2026-10-12, hạt giống 6: 1 496 KH, 10 414 lịch hẹn, 13 114 phiên bản KYC), Home PC, trung vị 41 lần, script tạm ngoài repo; trước = `main` (`WITH refs`, tự nối), sau = PR:

| Câu | Trước | Sau | Plan sau | Kết quả |
|---|---|---|---|---|
| `IN_TRASH` (`team.ts`, hộp 9b) | 6,80 ms | 1,91 ms | `CO-ROUTINE` | giống hệt |
| Luật 5, RE (`notRe`) | 9,46 ms | 4,39 ms | `CO-ROUTINE` | giống hệt |
| Luật 5, người hỗ trợ (`misplaced`) | 16,10 ms | 8,91 ms | `CO-ROUTINE` × 2 | giống hệt |

Plan trước: `MATERIALIZE refs` ở cả ba (câu cuối hai lần). Câu tự nối cũ, kể cả với danh sách dạng ghép thường (như trước #805), vẫn `MATERIALIZE a` để dựng index tạm (8,3 ms); đọc nhóm một lượt 6,8 ms, cùng kết quả cả trên dữ liệu có RE tự phối hợp.

Kiểm khi nhập trên cùng dữ liệu (trung vị 9 lần, hai vòng): `validateBackupValues` 199–205 → 217–219 ms (luật 4 trên mọi lịch hẹn), `validateBackupInvariants` 169–171 → 186–194 ms (luật 1 trên 13 114 phiên bản ≈ +45 ms, mục 10 ≈ −25 ms). Nhập dữ liệu tải vẫn xanh với các luật mới.

`byName`: sắp 20 000 tên 17 → ~31 ms (không có lối tắt `LATIN`: ~105 ms).

#### File ngoài danh sách của Issue

- `packages/domain/src/index.ts`: export `LINE_BREAK` (G5 §13.4: một hằng ở `domain` mà `web.ts` đọc qua `@p2c/domain`).
- `packages/domain/CLAUDE.md`: bản đồ export do `pnpm codemap` sinh (`LINE_BREAK`, `LATIN`).
- `packages/db/src/appointments.test.ts`: luật 4 thử qua lệnh lịch hẹn (`recordMeetingOutcome`, `scheduleAppointment`, `rescheduleAppointment`), test của chúng ở file này.
- `packages/db/src/backup-invariants.test.ts`: test của `backup-validation.ts` (luật liên bảng) nằm ở file này.
- `apps/desktop/src/routes/appointments/DateSuggestion.test.tsx`: test của `DateSuggestion` (`AppointmentDialog.tsx`).

#### Cỡ

Không tính file sinh: SP +404 / −146, test (kể cả e2e) +711 / −22, docs +6 / −4, `CLAUDE.md` +5 / −5. Vượt ngưỡng ~400 SP / ~800 tổng: Issue gom 12 mục, và G5 §13.5 liệt kê nhiều ca nhập phải có test. Đề xuất ghi vào bảng PR vượt ngưỡng của G7, như #805.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `7635e9f`: 27 mục "Trùng file".

- L12 `packages/db/src/backup-validation.ts` [T-291] S-1 / D-1, hash `kyc_versions`: đã sửa (luật 1, `versionsFit`).
- L18 `AppointmentDialog.tsx` [T-298 #787] #163, nhóm trước → sau của 6a, hộp 6h: để lại, thuộc T-298; PR này chỉ sửa `DateSuggestion`.
- L31 `packages/domain/src/period.ts` [T-291] ngày nhanh đầu năm: đã sửa (luật 5).
- L40 `apps/desktop/src/i18n/vi.ts` [T-297 #786] NIT `KycExtraction.tsx:96`: để lại, thuộc T-297.
- L50 `vi.ts` [T-296 #785] slot `{count}` của `trash.customer.with`: để lại, thuộc T-296.
- L79 `common.ts`, `outcome-form.ts`, `backup-validation.ts` [T-291] `optionalText`: đã sửa (luật 4).
- L80 `packages/domain/src/text.ts` [T-291] `normalizeNote` VT / FF: đã sửa (luật 7).
- L84 `analysis-steps.ts`, `ai-panel-view.ts` [T-291] G5 §11.8, REJECTED output lớn: đã sửa (luật 3).
- L85 `packages/db/src/ai-analyses.ts` [T-291] G5 §11.8, nhập `output_json`: đã sửa (luật 2).
- L94 `packages/domain/src/name-order.ts` [T-291] collator không bắc cầu: đã sửa (luật 6).
- L105 `vi.ts` [T-296 #785] `policies.editLabel`: để lại, thuộc T-296.
- L108 `e2e/appointment-outcome.spec.ts` [T-298 #787] ca E19 của 6f: để lại, thuộc T-298; PR này chỉ thêm một ca ở cuối file.
- L110 `vi.ts` [T-298 #787] `outcome.caseSizeRead`: để lại, thuộc T-298.
- L121 `packages/db/src/kyc.test.ts` [T-291] NIT U+200B thô ở dòng 640, 644: đã sửa (viết `​` như hai escape bên cạnh).
- L124 `team.ts`, `backup-validation.ts`, `person-references.ts`, `person-references.test.ts`, `packages/db/CLAUDE.md` [T-291] *Shotgun Surgery* `ownsRecords`: đã sửa (mục 8).
- L125 `person-references.ts`, `schema.ts`, `backup-validation.ts`, `common.ts` [T-291] *Duplicated Code* đặt nháy: đã sửa `quotedKinds` / `supportingRoles` (mục 9); `list` của `schema.ts` để lại vì import vòng (`no-circular`).
- L126 `person-references.ts`, `team.ts`, `backup-validation.ts` [T-291] `MATERIALIZE`: đã sửa (mục 10, số đo ở trên).
- L133 `vi.ts` [T-297 #786] `aiPanel.web.refused.TOO_LONG` viết cứng "20.000": để lại, thuộc T-297; câu mới của PR này đã theo hướng của mục đó.
- L143 `packages/ai/src/extract-json.ts`, `extract-json.test.ts` [T-291]: đã sửa theo hướng review (mục 11), các ca đổi ở mục 11.
- L144 `packages/ai/src/blocklists.test.ts` [T-291] `foundIn`: đã sửa (mục 12, ca đếm).
- L151 `docs/design/phase-3-du-lieu.md` [T-291] "lý do hẹn": đã sửa ("mô tả trigger").
- L152 `docs/decisions/0007-dinh-nghia-chi-so-va-vong-doi.md` [T-291] ô ngày ghi chú KYC: đã sửa.
- L153 `backup-validation.ts` [T-291] NIT dạng hash: code viết đúng chữ spec (`/^[0-9a-f]{14}$/`); chặt hơn (chữ số đầu chỉ 0 / 1) cần Owner đổi chữ, không làm.
- L154 `ai-panel-view.ts`, `ai-panel-view.test.ts` [T-291] `attemptReports` lần thử cuối: đã sửa (lần cuối cũng nhận bằng báo cáo; ca 30 lỗi, lỗi cuối V1 ở `$` hiện "và 2971 lỗi khác").
- L156 `backup-validation.ts` [T-292 #781] DR6-25 `zod/mini`: để lại, thuộc T-292 (bị chặn bởi #780).
- L157 `AppointmentDialog.tsx` [T-301 #790] DR6-37 ký hiệu viết cứng: để lại, thuộc T-301; PR này không thêm ký hiệu nào.
- L159 `vi.ts` [T-301 #790] dọn app: để lại, thuộc T-301.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (122 file, 3 906 test)
- [x] `pnpm e2e` xanh ở local (282 / 282)
- [x] Không thêm dependency
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:high` (như Issue; PR code của luật G2 / G5 — Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-291 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- S-1 / D-1, ngày nhanh đầu năm (R3) và ghi chú review PR #686, #698, #738, #801, #805, #822, #824 — T-291 (#780, PR #828, `REVIEW: PASS` @`7635e9f`; bảy luật Owner duyệt 23/10, chữ ở PR #824):
  - S-1 / D-1 (probe Codex Sol 02/10), `packages/db/src/backup-validation.ts` (`versionsFit`, luật 7): nhập backup kiểm phiên bản KYC. KH có dữ kiện hiệu lực thì có phiên bản và ngược lại; hash của phiên bản mới nhất bằng `kycHash` tính lại trên các dữ kiện đó; hai phiên bản liền nhau khác hash; mọi hash 14 chữ số hex thường. 7 ca "7: …" ở `packages/db/src/backup-invariants.test.ts`; ca sửa tay dữ kiện của luật khác tính lại hash (`rehash`).
  - R3, `packages/domain/src/period.ts` (`parseQuickDate`): `previousYearSuggestion` khi ngày năm nay chưa tới mà cùng ngày năm trước mới qua không quá 60 ngày. Gợi ý ở 6b và 6e (chế độ `reschedule` của `apps/desktop/src/routes/appointments/appointment-form.ts`, cả khi chưa tick "Nhập bù"), không ở 6h / 6f; câu, nút và dòng hướng dẫn ở `DateSuggestion`; e2e "early in the year …" ở `e2e/appointment-outcome.spec.ts`.
  - #686, `packages/db/src/common.ts` (`optionalText`): chữ tùy chọn của lịch hẹn mà `normalizeText` ra rỗng là rỗng. Form `apps/desktop/src/routes/appointments/outcome-form.ts`, dòng xem trước lý do dời của 6e (`rescheduleReason`) và nhập backup (`appointmentTextStored` của `packages/db/src/backup-validation.ts`, mọi chữ tùy chọn của mọi lịch hẹn, kể cả đã xóa) kiểm cùng hàm.
  - #686, `packages/domain/src/text.ts` (`normalizeNote`): VT, FF là xuống dòng; hằng `LINE_BREAK` dùng chung với `packages/ai/src/web.ts` (G5 §13.4).
  - #698 / G5 §11.8, `packages/ai/src/analysis-steps.ts` (`rejectedOutput`): REJECTED có dạng lưu quá 20 000 code point thì `output` null. Panel (`apps/desktop/src/routes/customers/ai-panel-view.ts`) nhận "không có khối" bằng báo cáo ở mọi lần thử, `outputTooLarge` thêm dòng "Output quá lớn…" ở hộp 2k (`KycHistory.tsx`). Bất biến G5 §13.2 có test ở `packages/ai/src/validator.test.ts`.
  - #698 / G5 §11.8, `packages/db/src/ai-analyses.ts` (`analysisContentFits`, `rejectedOutputFits`): lệnh và nhập backup đọc chuỗi sẽ lưu. ACCEPTED đúng `JSON.stringify` của output mà schema đọc ra; REJECTED `null` hoặc object viết lại đúng chuỗi, tối đa 20 000 code point (G5 §13.3).
  - #738, `packages/domain/src/name-order.ts` (`byName`): mọi `\p{Nd}` đọc như chữ số ASCII trước collator; tên chỉ có chữ Latinh bỏ qua bước thay (`LATIN`). Ca 2 022 tên xáo 20 lần ở `packages/domain/src/name-order.test.ts`.
  - #801 NIT, `packages/db/src/kyc.test.ts`: U+200B viết escape.
  - #805 *Shotgun Surgery*, `packages/db/src/person-references.ts` (`POINTS_TO` cạnh `ROWS`): `ownsRecords` (`packages/db/src/team.ts`) và luật 5 cùng đọc; `packages/db/CLAUDE.md` nhắc bước này; ca ở `packages/db/src/person-references.test.ts`.
  - #805 *Duplicated Code*, `packages/db/src/common.ts` (`sqlTexts`): `quotedKinds` và vai trò hỗ trợ của luật 5 dùng chung. `list` của `packages/db/src/schema.ts` để lại vì import vòng (`common.ts` import `schema.ts`), như Issue cho phép.
  - #805 hiệu năng, `packages/db/src/person-references.ts` (`PERSON_REFERENCES`): câu ghép thường, tên cột ở nhánh đầu; câu "RE phối hợp chính lịch của mình" của luật 5 đọc danh sách một lượt (`GROUP BY … HAVING COUNT(DISTINCT kind) = 2`). Không còn `MATERIALIZE` (ca ở `packages/db/src/person-references.test.ts`; review #828 kiểm trên đúng câu của code). Dữ liệu tải: `IN_TRASH` 6,80 → 1,91 ms, luật 5 9,46 → 4,39 ms và 16,10 → 8,91 ms.
  - #822, `packages/ai/src/extract-json.ts`: chỉ lượt đọc cuối thử các khối trong `{` chưa đóng; ca `Lưu ý { x "y. ` + câu trả lời có "{}" (đủ / cụt) ở `packages/ai/src/extract-json.test.ts`. Loại ca mới làm sai: ACCEPTED (Owner 25/10 giữ mục 11).
  - #822, `packages/ai/src/blocklists.test.ts`: ca đếm matcher của mỗi luật so với bảng G5 §8; bỏ "sunlife", "daiichi" hay "dễ chốt" thì đỏ.
  - #824 *Mysterious Name*, `docs/design/phase-3-du-lieu.md`: `trigger_note` là "mô tả trigger".
  - #824, `docs/decisions/0007-dinh-nghia-chi-so-va-vong-doi.md`: thêm "ngày ghi chú KYC" vào nhóm ô chỉ nhận ngày đã qua.
  - #824 NIT, `packages/db/src/backup-validation.ts` (`KYC_HASH`): viết đúng chữ spec `/^[0-9a-f]{14}$/`, như ghi chú gợi ý; chặt hơn (chữ số đầu 0 / 1) cần Owner đổi chữ, không làm.
  - #824 lượt 4, `apps/desktop/src/routes/customers/ai-panel-view.ts` (`attemptReports`): lần thử cuối cũng nhận "không có JSON" bằng báo cáo; ca 30 lỗi, lỗi cuối V1 ở `$` hiện "và 2971 lỗi khác" ở `apps/desktop/src/routes/customers/ai-panel-view.test.ts`.

---

# Issue #781 — T-292: Dùng zod/mini thay zod đầy đủ (DR6-25)

Trạng thái: CLOSED · nhãn: type:task, risk:high, ready-for-agent

##### Mục tiêu

Dùng `zod/mini` (cùng gói `zod` đã duyệt) thay bản đầy đủ ở mọi nơi, để bundle nhỏ đi (DR6-25: ≈ −60 KB min, gồm ≈ 17 KB sinh JSON Schema không dùng).

1. Đổi cú pháp schema của `packages/ai` (output, đầu vào, cài đặt) và kiểm nhập backup của `packages/db` sang `zod/mini`.
2. Thông báo lỗi, `detail` V1 (G5 §11.6) và mã lỗi nhập backup không đổi.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Issue này gom mục OPEN gắn **[T-292]** (DR6-25, lượt 1 Owner 15/10 hoãn, 23/10 đổi thành sửa trước v1.0).

Làm sau T-288 và T-291, khi các thay đổi khác của schema / kiểm nhập đã vào `main`.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-292]
- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §8.5 (DR6-25: H·CL-C3, L·CL-F)
- `packages/ai/CLAUDE.md` (`ai-schema-standalone`), `packages/db/CLAUDE.md`
- `packages/ai/src/{schema.ts,settings.ts,validator.ts}` và mọi file import `zod` (rg `from 'zod'`)
- `packages/db/src/{backup.ts,backup-validation.ts,ai-analyses.ts}`
- `docs/design/phase-5-prompts.md` §11.6 (chữ `detail` V1)

##### File / thư mục được phép sửa

- Mọi file `packages/**/src/**` và `apps/desktop/src/**` đang import `zod`, + test của chúng
- `packages/{ai,db}/CLAUDE.md` (khối codemap)

##### Ghi chú OPEN liên quan

Mục OPEN gắn **[T-292]**: gộp. Mục khác trùng file để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Không thêm dependency: `zod/mini` là subpath của gói `zod` trong danh sách ADR-0005.
- Rule `ai-schema-standalone`, `db-only-on-domain-and-ai-schema` giữ nguyên.

##### Test chấp nhận

- [ ] Toàn bộ unit + e2e xanh.
- [ ] `detail` V1 không đổi chữ (test hiện có không đổi kỳ vọng).
- [ ] Nhập backup hỏng ra đúng mã cũ.
- [ ] Không còn import `zod` bản đầy đủ (rg ghi trong PR).
- [ ] Kích thước `assets/index.js` (min, gzip) trước / sau ghi trong PR, giảm ≥ 40 KB min.

Ước lượng: ≈ 200–300 dòng SP (đổi cú pháp) + ≈ 50 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển mục [T-292] sang RESOLVED

##### Rủi ro

risk:high

##### Bị chặn bởi

#780 (T-291)

## PR #830 — refactor: use zod/mini instead of the full zod (T-292)

Trạng thái: MERGED · merge 2026-10-25T09:42:10Z · commit `78370a085a0d3d324dbd82463b45e9aa5edddb9b` · nhánh `task/T-292-zod-mini` · nhãn: type:task, risk:high

Closes #781

PR code của T-292 (DR6-25): `packages/ai` và `packages/db` dùng `zod/mini` thay `zod` bản đầy đủ. `zod/mini` là subpath của gói `zod` 4.6.5 đã có trong ADR-0005, nên không thêm dependency, không đổi `package.json` / lockfile. Các phép kiểm giữ nguyên, chỉ đổi cú pháp; `detail` V1, mã lỗi nhập backup và dữ liệu schema đọc ra không đổi. Gộp thêm mục L133 của sổ (`toFact` chép ba lần).

#### Thay đổi

- `packages/ai/src/schema.ts`: chuyển sang cú pháp `zod/mini`:
  - phương thức thành check: `.refine(…)` → `.check(z.refine(…))`, `.regex` → `z.regex`, `.trim()` → `z.trim()`, `.min` / `.max` của mảng → `z.minLength` / `z.maxLength`;
  - bọc thành hàm: `.default([])` → `z._default(…, [])`, `.optional()` → `z.optional(…)`;
  - thứ tự check giữ nguyên (`trim` → trần 1 000 → rỗng → 300; kiểm trùng mã trước `minLength`), nên thứ tự lỗi V1 không đổi;
  - `mode` của `analysisInputSchema`: `ZodMiniEnum` không có `.exclude`, nên viết `z.enum(AI_MODES.filter((mode) => mode !== 'extraction'))`. Kiểu suy ra vẫn là `'analysis' | 'discovery'` (TS tự suy type predicate). `db` dùng `input.mode` làm khóa của `AI_OUTPUT_SCHEMAS` và đọc `evidence` của mọi khối; typecheck xanh;
  - `AI_OUTPUT_SCHEMAS` `satisfies Record<AiMode, z.ZodMiniType>`.
- `packages/ai/src/validator.ts`: chỉ đổi import kiểu (`z.core.$ZodIssue`).
- `packages/db/src/backup.ts`: phong bì dùng `z.int().check(z.positive())`. `backup-validation.ts`: mốc giờ `z.iso.datetime({ precision: 3 })`, cú pháp như cũ.
- **Khác biệt duy nhất của `zod/mini` mà người dùng có thể thấy:** mini không nạp chữ lỗi tiếng Anh (bản đầy đủ tự nạp `en`), nên chữ mặc định chỉ là "Invalid input". Không `detail` V1 nào dùng chữ mặc định:
  - `schemaDetail` tự viết `invalid_type` / `too_small` / `too_big` / `invalid_value` từ `expected` / `minimum` / `maximum` / `values`;
  - `refine`, `regex` và `union` mang chữ tiếng Việt của schema;
  - `db` chỉ đọc `success`.
  Comment ở import của `schema.ts` ghi lại điều này.
- Khác biệt không đổi kết quả: object của mini không có đường JIT (`new Function`) như bản đầy đủ, và không cài memoizer (memoizer chỉ phục vụ input có vòng tham chiếu, JSON không tạo ra được). Số đo ở mục Số đo.
- **L133 (*Duplicated Code*):** thêm `storedKycHash(rows)` ở `backup-validation.ts`, là `kycHash` của các dòng dữ kiện đã lưu, export cho test. Luật 7 (`versionsFit`) và `rehash` của `backup-invariants.test.ts` cùng gọi nó, nên test bỏ được bản chép thứ ba và các import `domain` chỉ bản chép đó dùng.
  - `toFact` của `packages/db/src/kyc.ts:511` để lại. Hàm đó đọc dòng drizzle (camelCase) thành `KycFact` cho lệnh KYC, khác dạng dòng SQL / backup (snake_case) mà luật 7 và test đọc.
  - `kyc.ts` không import `zod` nên không nằm trong danh sách file Issue cho sửa.

#### Test chấp nhận

- [x] Toàn bộ unit + e2e xanh:
  - `pnpm verify` (format, lint, ranh giới module, codemap, typecheck, unit + coverage) xanh;
  - `ai` + `db`: 39 file / 1 955 test, bằng đúng số trước khi đổi;
  - `pnpm e2e`: 282 / 282 test.
- [x] `detail` V1 không đổi chữ: không sửa kỳ vọng nào. Các ca ghim chữ:
  - `validator.test.ts` (G5 §11.6: thiếu khối, enum thiếu / sai, mã F sai dạng, `value` sai kiểu / rỗng / quá 1 000…);
  - `validator-union.test.ts`;
  - `run.test.ts` (message thử lại, §11.7);
  - `ai-panel-view.test.ts`, `tools/eval-ai-core.test.mjs`.
  Phép so `main` ↔ nhánh ở mục bên dưới.
- [x] Nhập backup hỏng ra đúng mã cũ: `backup.test.ts` và `backup-invariants.test.ts` không đổi kỳ vọng. `backup.test.ts` gồm phong bì (format khác, khóa lạ, `exportedAt` sai, `schemaVersion` 0 / 4,5, bảng không phải mảng, thiếu / thừa bảng…) và mốc giờ (DR6-105).
- [x] Không còn import `zod` bản đầy đủ: ripgrep `from ['"]zod` trên `packages`, `apps`, `e2e`, `tools` @ `7ca936e`:
  ```
  packages/db/src/backup-validation.ts:23:import * as z from 'zod/mini';
  packages/db/src/backup.ts:8:import * as z from 'zod/mini';
  packages/ai/src/schema.ts:25:import * as z from 'zod/mini';
  packages/ai/src/validator-union.test.ts:6:import * as z from 'zod/mini';
  packages/ai/src/validator.ts:15:import type * as z from 'zod/mini';
  ```
  Ngoài ra `'zod'` chỉ còn ở `package.json` của `ai` và `db` (gói chứa `zod/mini`) và trong một chuỗi mẫu của `tools/ts-hooks-core.test.mjs`.
- [x] `assets/index.js` giảm 62 735 B min (yêu cầu ≥ 40 KB), xem bảng dưới.

#### Số đo

`pnpm build:web`, Home PC (`DESKTOP-KDURKJP`). Trước = `main` `314da73`, sau = PR `7ca936e`:

| `assets/index-*.js` | Trước | Sau | Δ |
|---|---|---|---|
| min | 940 771 B | 878 036 B | **−62 735 B (−6,7 %)** |
| gzip (Vite báo) | 278,43 kB | 261,33 kB | −17,10 kB |
| gzip (`zlib` mức 6) | 276 121 B | 259 065 B | −17 056 B |

- Bundle sau không còn `ZodObjectJIT`, locale tiếng Anh ("Invalid input: expected…", "Too small: expected…") hay `toJSONSchema`; bundle trước có đủ ba.
- **Nhập backup**, dữ liệu tải (`LOAD_SCALE`, neo 2026-10-12, hạt giống 6, 103 dòng `ai_analyses`), chạy Node, mỗi bên hai lượt:
  - luật 13 (`analysisContentFits` trên mọi dòng, trung vị 41 lần): 4,6–4,8 → 5,2–5,5 ms;
  - `importBackup` (trung vị 9 lần): 946–950 → 947–948 ms.
- Trong Node, bản đầy đủ dùng JIT cho object nên đây là mức chênh lớn nhất. Trong exe, CSP `script-src 'self' 'wasm-unsafe-eval'` chặn `new Function`, nên bản đầy đủ vốn đã chạy đường không JIT; exe không đổi.

#### So khác biệt `main` ↔ nhánh (script tạm ngoài repo)

Mỗi bên được bundle riêng bằng esbuild từ `packages/ai/src/index.ts` (`main` với `zod`, nhánh với `zod/mini`) và chạy ở tiến trình riêng, vì zod giữ cấu hình trên `globalThis`. Cùng một hạt giống sinh cùng output ngẫu nhiên cho ba chế độ:

- output gồm: khối thiếu / sai kiểu / quá dài / quá ngắn, phần tử sai kiểu, mã F sai dạng / trùng / lạ, `missingCategory` / `system` sai, chuỗi rỗng, chuỗi chỉ ký tự vô hình, quanh trần 300 / 1 000, NFD, cụm bị chặn, khóa lạ, đảo thứ tự khóa;
- trích xuất: `value` đủ kiểu, 0–21 dữ kiện;
- kèm một đầu vào phân tích ngẫu nhiên.

Mỗi ca so:

- `validateOutput`: mã, path, `detail` của mọi lỗi;
- `safeParse`: `success`, `JSON.stringify(data)` (chính là `output_json` sẽ lưu), mã + path của lỗi, và chữ lỗi của `refine` / `regex` / `union`;
- `filterExtraction`: kept / dropped;
- `analysisInputSchema.safeParse`.

Kết quả:

- **3 × 200 000 ca (hạt giống 2–4): 0 khác biệt.** 107 292 output được nhận, 491 053 bị từ chối, 655 không có JSON, tổng 3 710 478 lỗi.
- Phép so đi qua mọi dạng `detail` của §11.6: "thiếu, cần …", "thiếu, cần một trong: …", "sai kiểu, cần string / array / object", "sai định dạng, cần mã dữ kiện dạng F12", "giá trị không hợp lệ, cần một trong: …", "(thiếu / sai kiểu), cần string, number hoặc boolean", "chuỗi rỗng", "quá 1 000 ký tự kể cả ký tự vô hình", "quá 300 ký tự", "không có chữ", "trích trùng một dữ kiện", "cần evidence hoặc missingCategory", "cần ít nhất N phần tử", "quá N phần tử", "và N lỗi khác", "không có khối JSON". Có cả V2, V4, V5, V6.
- **Đối chứng:** so thêm chữ lỗi mặc định của zod thì 935 / 2 000 ca khác. Ví dụ `too_small` là "Too small: expected array to have >=1 items" ↔ "Invalid input", nhưng `detail` vẫn cùng là "cần ít nhất 1 phần tử". Vậy phép so có bắt được khác biệt khi có.
- **`db`:** phong bì backup và mốc giờ `precision: 3`, định nghĩa của `main` (`zod`) ↔ của nhánh (`zod/mini`), so `success` / data / mã + path. 2 × 300 000 giá trị ngẫu nhiên (mốc giờ quanh dạng ISO, `schemaVersion` biên, bảng / dòng sai dạng, khóa lạ): 0 khác biệt (31 341 file và 18 001 mốc giờ được nhận).

#### File ngoài danh sách của Issue

Không có: các file sửa đều import `zod` hoặc là test của chúng (`backup-invariants.test.ts` là test luật liên bảng của `backup-validation.ts`), cộng khối codemap `packages/db/CLAUDE.md` (`storedKycHash`, do `pnpm codemap` sinh).

#### Cỡ

Không tính file sinh: SP +69 / −44 (4 file), test +6 / −26 (2 file). Khối codemap +1 / −1. Issue ước 200–300 dòng SP: đổi cú pháp ít dòng hơn ước lượng.

#### Đề xuất ngoài phạm vi (không làm)

Một luật ESLint `no-restricted-imports` cấm `zod` (chỉ cho `zod/mini`) sẽ giữ được mức giảm này, vì một import `zod` mới sẽ kéo lại ≈ 60 KB. File `eslint.config.js` không nằm trong danh sách của Issue, nên PR này không làm.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `7ca936e`: 2 mục "Trùng file".

- L133 `packages/db/src/backup-validation.ts`, `packages/db/src/backup-invariants.test.ts` [T-292] *Duplicated Code* `toFact` / `rehash`: đã sửa (`storedKycHash`, luật 7 và test cùng gọi; bản ở `kyc.ts` để lại, lý do ở mục Thay đổi).
- L136 `packages/ai/src/schema.ts`, `packages/db/src/backup.ts`, `packages/db/src/backup-validation.ts` [T-292] DR6-25: đã sửa (PR này).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (`zod/mini` là subpath của gói `zod` đã duyệt)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:high`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-292 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- DR6-25 và một ghi chú review PR #828 — T-292 (#781, PR #830, `REVIEW: PASS` @`7ca936e`):
  - DR6-25 (deep review lượt 1, H·CL-C3, L·CL-F), `packages/ai/src/schema.ts`, `packages/db/src/backup.ts`, `packages/db/src/backup-validation.ts`: `zod/mini` thay `zod` bản đầy đủ, cùng gói nên không thêm dependency. `assets/index.js` 940 771 → 878 036 B min (−62 735 B; gzip −17 KB). `detail` V1, mã lỗi nhập backup và dữ liệu đọc ra không đổi: PR và review so `main` ↔ nhánh trên ca biên và ca ngẫu nhiên, 0 khác biệt.
  - #828 *Duplicated Code*, `packages/db/src/backup-validation.ts` (`storedKycHash`): luật 7 (`versionsFit`) và `rehash` của `packages/db/src/backup-invariants.test.ts` cùng gọi. `toFact` của `packages/db/src/kyc.ts` để lại vì đọc dòng drizzle (camelCase), khác dạng dòng backup.

---

# Issue #782 — T-293: Rust: storage.rs, backups không đọc được, test ai.rs, tiêu đề cửa sổ exe theo màn

Trạng thái: CLOSED · nhãn: type:task, risk:high, ready-for-agent

##### Mục tiêu

1. **Lưu file:**
   - hằng `SHARING_VIOLATION` / `LOCK_VIOLATION` thay số trần `32` / `33`;
   - ngoài Windows bỏ closure `map_err` thừa (identity);
   - `remove_interrupted_backups` / `_exports` và ba chỗ `read_dir(...).into_iter().flatten().flatten()` dùng một helper;
   - `add_refused` / `delete_refused` dùng một `refuses(path, access, flags)` (kèm một stub ngoài Windows).
2. **Thư mục cấm tạo file (sau #764):**
   - test cho lần mở đầu (chưa có `project2c.db`, lock sót, thư mục cấm `(WD)`) → `ACCESS_DENIED`;
   - câu `storage.accessDeniedHelp` đúng cả khi file hỏng / file mất mà `backups\` còn bản sao (kiểm ở nhánh `Ok(None)` và sau bước kiểm header, thay vì trước `fs::read`).
3. **`backups\` không đọc được:** báo lỗi, không coi như lần đầu (`backup_names`).
4. **AI (Rust và script eval):**
   - test `layer('u')` gộp hai nhánh `match` làm cùng việc;
   - cách đọc thứ ba dùng lại lượt 1 (3 lượt thay vì 4);
   - thêm cách đọc "chỉ gỡ escape JSON một lượt", để key có `\` / `%` viết một lớp kiểu `JSON.stringify` vẫn bị bắt, ở cả Rust và script eval.

   Hai mục cuối đưa lại từ ACCEPTED (Owner 23/10).
5. **Tiêu đề cửa sổ exe theo màn** ("tên màn · Project-2C"):
   - thêm quyền `core:window:allow-set-title` (Owner 23/10 duyệt G6);
   - vỏ app gọi `setTitle` khi chạy exe; bản web giữ `document.title` như nay.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301 và G6 cho quyền đổi tiêu đề cửa sổ. Issue này gom các mục OPEN gắn **[T-293]**:
- `storage.rs` (#196 / #192, #620, #764);
- phần `backups\` của mục Cài đặt #96 / #87;
- DR6-67 phần `read_dir`;
- test `ai.rs` (#680);
- tiêu đề cửa sổ (#638);
- hai mục `ai.rs` / script eval đưa lại từ ACCEPTED (#680).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-293]
- `apps/desktop/CLAUDE.md` (sửa `src-tauri/**` → nhãn `build-exe`, `pnpm verify:rust`)
- `apps/desktop/src-tauri/src/storage.rs` (`open_lock_file`, `out_of_reach`, `open_with`, `add_refused`, `delete_refused`, `replace_refused`, `backup_names`, `remove_interrupted_*`)
- `apps/desktop/src-tauri/src/ai.rs` (`clean_key`, `readings`, `reveals`, `mask`, test `layer`); `tools/eval-ai-core.mjs` (`readings`, `reveals`)
- `apps/desktop/src-tauri/capabilities/default.json`; `apps/desktop/src/shell/AppShell.tsx` (`useScreenFocus`)
- `apps/desktop/src/data/tauri-storage.ts` (`saveFailure`), `apps/desktop/src/shell/startup-error.ts`
- Thân PR #764 (bảng exe, `icacls`), thân PR #750

##### File / thư mục được phép sửa

- `apps/desktop/src-tauri/src/{storage.rs,ai.rs,lib.rs}` (gồm test trong file)
- `apps/desktop/src-tauri/capabilities/default.json`
- `apps/desktop/src/shell/{AppShell.tsx,startup-error.ts}` + test; `apps/desktop/src/data/{tauri-storage.ts,tauri-contract.test.ts}` + test
- `apps/desktop/src/i18n/vi.ts` (`storage.*`)
- `tools/{eval-ai-core.mjs,eval-ai-core.test.mjs}`
- `docs/user-guide/{01-bat-dau.md,10-su-co.md}`, `docs/testing/nghiem-thu-v1.md` (ca thư mục cấm / `backups\` không đọc được, nếu câu đổi)

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-293]**: gộp. Mục khác trùng file (vd. phần `saveError` của mục `storage.rs` #620 thuộc T-294) để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Không thêm crate (G4).
- Mã lỗi lưu / mở giữ như hiện có; mã mới (nếu cần cho `backups\`) đi cùng đường `saveFailure` / `startupMessage`.
- Chỉ thêm đúng một quyền cửa sổ.

##### Test chấp nhận

- [ ] `pnpm verify:rust` xanh.
- [ ] Test Rust: lần mở đầu trong thư mục cấm `(WD)`; file hỏng / file mất trong thư mục đó; `backups\` không đọc được.
- [ ] Test `reveals` / `readings`: key có `\` / `%` viết một lớp kiểu `JSON.stringify`, ở cả Rust và script.
- [ ] Exe: thanh tiêu đề đổi theo màn (ảnh trong PR); bản web không đổi.
- [ ] Exe: tái hiện ca thư mục cấm lúc mở lần đầu (ghi trong PR).

Ước lượng: ≈ 120 dòng SP + ≈ 200 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh, `pnpm verify:rust` xanh
- [ ] CI xanh (gồm build exe, nhãn `build-exe`)
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-293] đã sửa sang RESOLVED

##### Rủi ro

risk:high

##### Bị chặn bởi

Không

## PR #807 — fix: report an unreadable backups folder, name the exe window per screen (T-293)

Trạng thái: MERGED · merge 2026-10-24T09:52:10Z · commit `f36935e2f4c71852583e50999b05dfaff8812268` · nhánh `task/T-293-rust-storage-backups-title` · nhãn: type:task, risk:high, build-exe

Closes #782

#### Thay đổi

T-293, đợt sửa sổ OPEN trước v1.0 (Owner 23/10, #771): gộp cả 11 mục [T-293].

**1. Dọn `storage.rs` (L15, L83, L158, L191)**
- Hằng `SHARING_VIOLATION` / `LOCK_VIOLATION` (`#[cfg(windows)]`) thay số trần `32` / `33` ở `open_lock_file`, `out_of_reach` và test.
- `open_lock_file` có một bản Windows (không chia sẻ, `SHARING_VIOLATION` → `ALREADY_OPEN`) và một bản ngoài Windows (chỉ mở file), nên hết closure `map_err` identity ngoài Windows. Cách mở chung nằm ở `lock_file_options`.
- Helper `entries(folder)` thay `read_dir(...).into_iter().flatten().flatten()` ở cả bốn chỗ (`next_seq`, `backup_names`, hai vòng dọn file sót). Thư mục chưa có thì rỗng; không liệt kê được thì là lỗi (mục 3).
- `remove_interrupted(folder, left)` thay cặp `remove_interrupted_exports` / `_backups`; luật khớp tên ở `is_interrupted_export` / `is_interrupted_backup`. Vòng chung xét `file_type()`, bản exports cũ dùng `metadata()`. Trên Windows cả hai lấy từ dữ liệu của lần liệt kê và không đi theo symlink, nên kết quả như nhau.
- `refuses(path, access, flags)` (`#[cfg(windows)]`) cộng một stub ngoài Windows; `delete_refused` / `add_refused` gọi nó.

**2. Thư mục cấm tạo file (L157, sau #764)**
- `open` hỏi `add_refused` ở nhánh không có file (`without_file`, sau bước xét `backups\`) và sau bước kiểm header (cùng `replace_refused`), không còn hỏi trước `fs::read`.
- Lần mở đầu trong thư mục cấm `(WD)` vẫn ra `ACCESS_DENIED`.
- File hỏng, và file mất mà `backups\` còn bản sao, giữ lỗi của chính chúng. Trang lỗi là "Không mở được file dữ liệu" (bảo khôi phục), không còn trang `ACCESS_DENIED` ghi "File dữ liệu không hỏng, không cần khôi phục".

**3. `backups\` không đọc được (L29)**
- `backup_names` / `next_seq` trả `io::Result`: thư mục không liệt kê được là lỗi, không phải thư mục rỗng.
- **Lúc mở, file mất:** không liệt kê được `backups\` thì `open` báo lỗi `project2c.db is missing and backups cannot be read: …`, không còn coi là lần đầu rồi sinh dữ liệu giả lập. App hiện trang "Không mở được file dữ liệu" kèm chi tiết kỹ thuật. Không thêm mã lỗi (Lựa chọn 1).
- **Lúc sao lưu:** `next_seq` báo lỗi thay vì đánh số lại từ 1. Bản mới mang số 1 sẽ bị coi là cũ nhất: bị dọn trước, và ngược với hướng dẫn "chọn bản có số lớn nhất" (`10-su-co.md`).
  - Hệ quả: file còn nguyên mà `backups\` không đọc được thì app dừng ở trang "Không sao lưu được file dữ liệu". Trước PR app vẫn mở được rồi chép một bản đánh số sai.
- `find_copy`, `prune_backups`, `latest_backup` giữ cách "cố gắng": không đọc được thì không có bản để dùng lại, để dọn hay để hiện ở Cài đặt.

**4. Cách đọc key của AI (`ai.rs`, `tools/eval-ai-core.mjs`; L109, L173, L196, L197)**
- **Cách đọc thứ tư:** chỉ gỡ escape JSON một lượt (`Escapes::Json` ở Rust, `JSON_ESCAPE` ở script; `unescape` nhận loại escape cần gỡ). Key có `\` / `%` riêng viết một lớp kiểu `JSON.stringify` (vd. `sk-a\\nb%41c\\/d`) nay bị chặn ở câu trả lời và bị che ở thông báo lỗi.
- **Lượt 2 đọc lại lượt 1** thay vì tính lại từ văn bản. Lượt 1 được giữ một bản (`Rc<Vec<_>>`, 24 byte mỗi ký tự, ≈ 48 MB ở trần 2 MB của câu trả lời; câu trả lời thật vài chục KB).
  - Mỗi lần `reveals` / `mask` nay đọc văn bản 4 lượt cho 4 cách đọc. Nếu không dùng lại lượt 1 thì là 5 lượt; trước PR là 4 lượt cho 3 cách đọc.
- **Test `layer('u')`:** hai nhánh `match` gộp thành một điều kiện (`is_ascii_alphanumeric` hoặc một trong `-_.!~*'()`).
- **`fold` của script eval** dùng `collapseSpaces` của `packages/domain/src/text.ts` (cách V7 đọc quote), import như `formatIsoDate`.

**5. Tiêu đề cửa sổ exe theo màn (L96)**
- `capabilities/default.json` thêm đúng một quyền `core:window:allow-set-title` (Owner duyệt G6 23/10).
- `useScreenFocus` (`AppShell.tsx`) đặt `document.title` như cũ, và khi `isTauri()` thì gọi `getCurrentWindow().setTitle(title)`. Bản web không đổi.
- Test hợp đồng (`tauri-contract.test.ts`): danh sách quyền và comment lý do.
- Bản Tauri giả của e2e (`asExe`, `e2e/support.ts`) biết lệnh `plugin:window|set_title` và ghi tiêu đề vào `window.exe.title`. Ca e2e mới ở `e2e/navigation.spec.ts` kiểm thanh tiêu đề exe theo màn.

**Hướng dẫn** (`10-su-co.md`):
- Dòng "Không sao lưu được file dữ liệu" thêm ca không đọc được `backups\` và việc kiểm quyền đọc / ghi.
- Dòng "Không mở được file dữ liệu" thêm ca file mất mà không đọc được `backups\`: nhờ cấp lại quyền đọc trước rồi mới khôi phục.
- Không câu nào của app đổi, nên `nghiem-thu-v1.md` giữ nguyên (NT-DB-15, file rỗng tên `backups`, vẫn ra "Không sao lưu được file dữ liệu").

Cỡ: SP +208 / −147 (phần lớn là doc comment và code dời chỗ), test +160 / −33 (gồm 29 dòng e2e), tài liệu +2 / −2.

##### File ngoài danh sách của Issue

- `e2e/support.ts`: app chạy như exe nay gửi thêm lệnh `plugin:window|set_title`. Bản Tauri giả ném "unexpected command" với lệnh lạ, nên `e2e/full-cycle.spec.ts` (đòi không có lỗi console) đỏ trên CI ở commit đầu `e43dc88`. Thêm lệnh này là việc bắt buộc của mục 5.
- `e2e/navigation.spec.ts`: một ca exe giả kiểm thanh tiêu đề theo màn (Lựa chọn 3), cạnh ca DR6-35 kiểm `document.title`.

##### Lựa chọn của phiên

1. **Không thêm mã lỗi cho `backups\` không đọc được.** Lúc mở, app chỉ hỏi `backups\` khi file đã mất, nên ca này là "file mất".
   - Trang "Không mở được file dữ liệu" nói đúng việc phải làm (khôi phục từ `backups\`); dòng chi tiết nói thư mục không đọc được.
   - Nếu ánh xạ sang `ACCESS_DENIED` thì trang ghi "File dữ liệu không hỏng, không cần khôi phục", sai đúng kiểu mục 2 vừa sửa.
2. **`setTitle` gọi ngay trong `useScreenFocus`**, import `isTauri` / `getCurrentWindow` như `main.tsx`. Cách này đúng danh sách file của Issue, không truyền cửa sổ qua `App.tsx` (ngoài danh sách). Tập import Tauri của app không đổi (test hợp đồng giữ nguyên tập đó).
3. **Test tiêu đề cửa sổ là e2e, không phải unit test:** vitest không có DOM (thêm là G4) nên không chạy được effect. Ca e2e chạy bản build web như exe (`asExe`) và kiểm lệnh `plugin:window|set_title` mang đúng "tên màn · Project-2C" ở Khách hàng, hồ sơ KH, Báo cáo, không lỗi console. Bản web giữ các ca `toHaveTitle` sẵn có; exe thật thử ở dưới.

#### Test chấp nhận

- [x] `pnpm verify:rust` xanh (fmt, clippy `-D warnings`, 116 test).
- [x] Test Rust:
  - `a_first_start_in_a_data_folder_that_lets_no_new_file_in_is_access_denied`: chưa có `project2c.db`, `project2c.lock` sót, thư mục cấm `(WD)` → `ACCESS_DENIED`, thư mục chỉ còn `project2c.lock`; gỡ ACL thì là lần đầu (`None`).
  - `a_damaged_or_lost_file_in_a_data_folder_that_lets_no_new_file_in_keeps_its_own_error`: trong thư mục đó, file không phải SQLite → `InvalidData`; xóa file (còn 10 backup) → `NotFound`; `backups\` không đổi.
  - `a_backups_folder_the_app_cannot_list_is_an_error_never_an_empty_one`: `backups\` cấm `(RD)` → `backup()` lỗi `PermissionDenied`, không thêm bản nào; file mất → `open` lỗi "cannot be read", không tạo file.
  - `a_missing_file_with_a_backups_folder_it_cannot_list_is_an_error_not_a_first_start`: ca chạy được mọi nền tảng (file trùng tên `backups`).
  - Ca lần mở đầu xanh ngay cả trước khi sửa: code cũ kiểm thư mục trước khi đọc file. Test này giữ ca đó khi dời bước kiểm (đột biến M1).
- [x] Test `reveals` / `readings`: `odd_keys()` (Rust) / `oddKeys()` (script) là `ODD_KEY` nguyên văn và một lớp mỗi loại (`J`, `U`, `j` = `JSON.stringify`, `u` = `encodeURIComponent`) → câu trả lời bị chặn, thông báo lỗi bị che. Dạng `j` đỏ trước khi sửa ở cả hai nơi. Bộ 16 099 ca dùng chung giữ nguyên số ca và dấu vân tay.
- [x] E2e exe giả: `the exe gives its title bar the name of the screen too, …` (`e2e/navigation.spec.ts`). Đỏ trước khi bản Tauri giả biết `plugin:window|set_title`; `e2e/full-cycle.spec.ts` (đỏ trên CI ở `e43dc88`) xanh lại.
- [x] Exe: thanh tiêu đề đổi theo màn. Exe release build từ `e43dc88`, Home PC, thư mục thử riêng (commit sau chỉ sửa e2e). WebView2 nối cổng debug, đổi màn bằng hash, đọc tiêu đề cửa sổ Windows (`MainWindowTitle`) và chụp cửa sổ (`PrintWindow`; ảnh Tổng quan / Khách hàng đã gửi Owner trong phiên):

| Màn | `document.title` = thanh tiêu đề |
|---|---|
| `#/overview` | Tổng quan · Project-2C |
| `#/appointments` | Lịch hẹn · Project-2C |
| `#/customers` | Khách hàng · Project-2C |
| `#/reports` | Báo cáo · Project-2C |
| `#/team` | Team & nhân sự · Project-2C |
| `#/settings`, `#/settings/trash` | Cài đặt · Project-2C |

  Lúc mở app, thanh tiêu đề đã theo màn đang mở (app nhớ màn cuối). Trang lỗi khởi động giữ "Project-2C". Bản web không đổi (`isTauri()` sai; e2e `navigation.spec.ts`).
- [x] Exe: tái hiện ca thư mục cấm lúc mở lần đầu, kèm các ca kề. Cùng exe, thư mục thử riêng; `icacls Project2C-data /deny *S-1-1-0:(WD)` (chỉ thư mục), `icacls Project2C-data\backups /deny *S-1-1-0:(RD)`, gỡ bằng `/remove:d`; đọc trang qua cổng debug, đóng cửa sổ bằng `CloseMainWindow`.

| Ca | Kết quả |
|---|---|
| 1. Lần mở đầu: chưa có `project2c.db`, `project2c.lock` sót, thư mục cấm `(WD)` | Trang "App không có quyền ghi vào thư mục dữ liệu" + câu `storage.accessDeniedHelp`; thư mục chỉ còn `project2c.lock` (không sinh dữ liệu giả lập); exe thoát 0 |
| 2. Gỡ ACL, mở lại | Mở bình thường (lần đầu, dữ liệu giả lập), có `project2c.db` |
| 3. Mở lần nữa | Có bản sao lưu lúc mở `project2c-s00000001-…` |
| 4. File thành chữ thường, thư mục cấm `(WD)` | "Không mở được file dữ liệu" + hướng dẫn khôi phục; chi tiết `project2c.db is not a SQLite database` (trước PR: trang `ACCESS_DENIED` "…không cần khôi phục") |
| 5. Xóa file (còn backup), thư mục cấm `(WD)` | "Không mở được file dữ liệu"; chi tiết `project2c.db is missing but backups has copies` |
| 6. Gỡ `(WD)`; `backups\` cấm `(RD)`, file vẫn mất | "Không mở được file dữ liệu"; chi tiết `project2c.db is missing and backups cannot be read: Access is denied. (os error 5)`; không tạo file; `backups\` không đổi |
| 7. Chép file nguyên lại; `backups\` vẫn cấm `(RD)` | "Không sao lưu được file dữ liệu" + chi tiết `Access is denied. (os error 5)`; hash file không đổi, `backups\` không thêm bản |
| 8. Gỡ `(RD)`, mở lại | Mở bình thường; dùng lại bản sao trùng nội dung, `backups\` không thêm bản |

- [x] Mỗi đột biến có test đỏ. Áp tạm từng cái bằng script, chạy test, rồi trả file nguyên byte (kiểm hash):
  - M1 bỏ bước kiểm thư mục ở nhánh không có file → `a_first_start_…` đỏ.
  - M2 trả bước kiểm thư mục về trước `fs::read` → `a_damaged_or_lost_file_…` đỏ.
  - M3 bỏ bước kiểm thư mục sau header → `open_reports_a_data_folder_that_lets_no_new_file_in_as_access_denied` đỏ.
  - M4 `next_seq` đánh số từ 1 khi không liệt kê được → `a_backups_folder_the_app_cannot_list_…` đỏ.
  - M5 `entries` coi mọi lỗi là thư mục rỗng → hai test `backups\` đỏ.
  - A1 cách đọc cuối gỡ mọi escape; A2 `unescape` luôn gỡ `%XX` → mỗi cái làm hai test `ai.rs` đỏ.
  - J1 script: cách đọc cuối gỡ mọi escape → hai test `eval-ai-core.test.mjs` đỏ.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `5bc8865`, 10 file), 12 mục "Trùng file"; hai file e2e không có mục OPEN nào:

- L15 `storage.rs` (`open_lock_file` dùng `Some(32)`; closure `map_err` identity ngoài Windows): **đã sửa** (mục 1).
- L29 `backups\` không đọc được thì app coi như lần đầu (`backup_names`): **đã sửa** (mục 3).
- L83 `remove_interrupted_backups` lặp vòng của `remove_interrupted_exports`: **đã sửa**, `remove_interrupted` nhận hàm khớp tên.
- L96 thanh tiêu đề cửa sổ exe vẫn là "Project-2C": **đã sửa** (mục 5).
- L107 `tauri-contract.test.ts:294` (regex semver từ chối hậu tố pre-release): để lại. Mục gắn [T-295 #784], ngoài phạm vi; PR này chỉ sửa test quyền cửa sổ trong file đó.
- L109 `layer('u')` (test) hai nhánh `match` làm cùng việc: **đã sửa**.
- L157 bước kiểm `add_refused` đứng trước `fs::read`, chưa test lần mở đầu, câu `accessDeniedHelp` sai với file hỏng / file mất: **đã sửa** (mục 2).
- L158 `add_refused` lặp `delete_refused`: **đã sửa**, `refuses` cộng một stub.
- L173 `fold` của script eval chép tay `collapseSpaces`: **đã sửa**, import từ `text.ts`.
- L191 `read_dir(...).into_iter().flatten().flatten()` ở `storage.rs`: **đã sửa**, cả bốn chỗ qua `entries`.
- L196 secret có `\` / `%` riêng viết một lớp kiểu `JSON.stringify` không bị bắt: **đã sửa**, cách đọc JSON một lượt ở cả Rust và script.
- L197 cách đọc thứ ba tính lại lượt 1: **đã sửa**, lượt 2 đọc lại lượt 1 (số lượt ở mục 4).

Việc chuyển 11 mục [T-293] sang RESOLVED làm ở PR sổ sau review.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (3 631 test).
  - Lần chạy đầu đỏ một ca đo thời gian không liên quan: `packages/ai/src/web.test.ts`, 63 ms > 50 ms, lúc cargo chạy song song (mục sổ L161 [T-290] đã ghi ca này).
  - Chạy lại khi máy rảnh: xanh.
- [x] `pnpm verify:rust` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (không thêm crate; ACL trong test dựng bằng `icacls`). Chỉ thêm một quyền cửa sổ (G6 đã duyệt).
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

- [x] `pnpm e2e` xanh ở local (toàn bộ, sau khi sửa bản Tauri giả). Commit đầu chưa chạy e2e ở local nên CI đỏ ở `full-cycle.spec.ts`.

Rủi ro: `risk:high` (nhãn `build-exe`: sửa `src-tauri`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-293 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #196 / #192, #96 / #87, #620, #638, #680, #764, #799 và DR6-67 phần Rust — T-293 (#782, PR #807, `REVIEW: PASS` @`5bc8865`):
  - #196 / #192, `apps/desktop/src-tauri/src/storage.rs` (`open_lock_file`): hằng `SHARING_VIOLATION` / `LOCK_VIOLATION` thay số trần `32` / `33` (cả ở `out_of_reach` và test); bản ngoài Windows chỉ mở file, hết closure `map_err` identity; cách mở chung ở `lock_file_options`.
  - #96 / #87, `backups\` không đọc được (`apps/desktop/src-tauri/src/storage.rs`): `backup_names` / `next_seq` trả `io::Result`. File mất mà không liệt kê được `backups\` → `open` báo lỗi "… cannot be read", không coi là lần đầu (trang "Không mở được file dữ liệu"); lúc sao lưu, `next_seq` báo lỗi thay vì đánh số lại từ 1 (trang "Không sao lưu được file dữ liệu"). `find_copy`, `prune_backups`, `latest_backup` giữ cách "cố gắng". `docs/user-guide/10-su-co.md` thêm hai ca. Câu hướng dẫn trong app chưa nhắc quyền đọc: xem mục review #807 ở OPEN.
  - #620, mùi `remove_interrupted_backups` lặp `remove_interrupted_exports`: một `remove_interrupted(folder, left)` nhận `is_interrupted_export` / `is_interrupted_backup`.
  - #638, thanh tiêu đề exe: quyền `core:window:allow-set-title` (`apps/desktop/src-tauri/capabilities/default.json`, G6 Owner 23/10); `useScreenFocus` (`apps/desktop/src/shell/AppShell.tsx`) gọi `getCurrentWindow().setTitle()` khi `isTauri()`, bản web giữ `document.title`. Ca exe giả ở `e2e/navigation.spec.ts`; exe release đọc `MainWindowTitle` đủ 6 màn (thân PR #807).
  - #680, `apps/desktop/src-tauri/src/ai.rs` (test `layer('u')`): hai nhánh `match` gộp thành một điều kiện.
  - #680 (đưa lại từ ACCEPTED), `apps/desktop/src-tauri/src/ai.rs` và `tools/eval-ai-core.mjs` (`readings`): cách đọc thứ tư "chỉ gỡ escape JSON một lượt" (`Escapes::Json` / `JSON_ESCAPE`); test `odd_keys()` / `oddKeys()` (`ODD_KEY` nguyên văn và một lớp mỗi loại) ở cả hai nơi.
  - #680 (đưa lại từ ACCEPTED), `apps/desktop/src-tauri/src/ai.rs` (`readings`): lượt 2 đọc lại lượt 1 (giữ một bản `Rc<Vec<_>>`), không tính lại từ văn bản. Giá: ≈ 48 MB ở trần 2 MB của câu trả lời; thân PR #807 đã nêu, review chấp nhận.
  - #764, `apps/desktop/src-tauri/src/storage.rs` (bước kiểm `add_refused`): hỏi ở nhánh không có file (`without_file`, sau bước xét `backups\`) và sau bước kiểm header, không còn trước `fs::read`. Test lần mở đầu (chưa có file, lock sót, `(WD)` → `ACCESS_DENIED`); file hỏng / file mất trong thư mục đó giữ lỗi của chính chúng.
  - #764, mùi `add_refused` lặp `delete_refused`: `refuses(path, access, flags)` cộng một stub ngoài Windows.
  - #799, `tools/eval-ai-core.mjs` (`fold`): import `collapseSpaces` từ `packages/domain/src/text.ts`.
  - DR6-67 (deep review lượt 1), phần Rust: helper `entries(folder)` (`apps/desktop/src-tauri/src/storage.rs`) thay cả bốn chỗ `read_dir(...).into_iter().flatten().flatten()`; thư mục chưa có thì rỗng, không liệt kê được thì là lỗi.

---

# Issue #783 — T-294: Trạng thái lưu: chỉ báo lưu 10d, nút Thử lại trên dải lưu lỗi, đóng app khi đang lưu

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

Người dùng luôn biết dữ liệu đã lưu chưa, và thử lưu lại được sau một lần lỗi.

1. **Chỉ báo lưu ở góc dưới sidebar, mọi màn,** theo mockup 10d: "Đã lưu HH:MM", "Đang lưu…", "Chưa lưu được vào file"; bản web: "Bản web — dữ liệu chỉ trong trình duyệt, mất khi tải lại trang". Đây là lệch mockup đã biết, Owner 23/10 đưa vào đợt sửa.
2. **Dải lưu lỗi có nút "Thử lại"** (mockup 10a): ghi lại ngay bản đang có.
   - Sau một lần lưu lỗi, người dùng có cách thử lưu lại trước khi "Nạp lại", Nhập backup hay Dọn sạch Thùng rác (các lệnh này đang từ chối khi lần lưu cuối lỗi).
   - Câu từ chối của các lệnh đó chỉ tới nút Thử lại.
3. **Đóng app (CloseGuard):**
   - bấm X lúc đang lưu, hay lúc đang seed "Nạp lại", thì chờ bản mới lưu xong rồi mới đóng;
   - trong lúc chờ có dấu hiệu "Đang lưu…" (cùng trạng thái của mục 1).
4. **Một nguồn trạng thái lưu:**
   - lỗi lưu cuối (`saveError`) về `PersistQueue`, cạnh `failed()`;
   - dải lưu, hộp đóng app và chỉ báo sidebar đọc một store;
   - NIT #87: listener của trạng thái lưu ném lỗi không làm hỏng các listener khác.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Owner cũng đưa lệch mockup "chỉ báo lưu 10d" vào đợt sửa.

Issue này gom các mục OPEN gắn **[T-294]**:
- phần "không có cách thử lưu lại" và NIT listener của mục Cài đặt #96 / #87 (Owner 21/10 Q5 a giữ OPEN; 23/10 đổi thành sửa trước v1.0);
- CloseGuard #125;
- phần `saveError` của mục `storage.rs` #620;
- mục mới "chỉ báo lưu 10d".

Mockup đã duyệt có sẵn nút Thử lại (10a) và chỉ báo (10d): không cần G3.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-294]
- `docs/design/mockups/settings-data.html` (dải lưu lỗi 10a, trạng thái lưu 10d); `docs/design/phase-3-du-lieu.md` §5 (lưu file, ADR-0016); `docs/design/phase-6-hoan-thien.md` §4.3 (câu về trạng thái lưu)
- `apps/desktop/src/shell/{Sidebar.tsx,SaveWarning.tsx,CloseGuard.tsx,close-guard.ts,AppShell.tsx}`
- `apps/desktop/src/data/{persist-queue.ts,app-data.ts,AppDataContext.tsx,tauri-storage.ts}`
- `apps/desktop/src/routes/{Settings.tsx,SettingsBackup.tsx,SettingsTrash.tsx}` (câu từ chối khi lần lưu cuối lỗi)
- `e2e/support.ts` (`asExe`, `failSaves`), `e2e/dialog-keyboard.spec.ts`
- `docs/user-guide/{01-bat-dau.md,09-cai-dat.md,10-su-co.md}`; `docs/testing/nghiem-thu-v1.md` (dòng "Trạng thái lưu (10d)" ở "Lệch mockup đã biết", các dòng DB / CD liên quan)

##### File / thư mục được phép sửa

- `apps/desktop/src/shell/{Sidebar.tsx,SaveWarning.tsx,CloseGuard.tsx,close-guard.ts,AppShell.tsx}` + test
- `apps/desktop/src/data/{persist-queue.ts,app-data.ts,AppDataContext.tsx,tauri-storage.ts}` + test
- `apps/desktop/src/routes/{Settings.tsx,SettingsBackup.tsx,SettingsTrash.tsx}` (chỉ câu từ chối / đường tới Thử lại)
- `apps/desktop/src/i18n/vi.ts`
- `e2e/**` (spec lưu file, Nạp lại, Thùng rác; `support.ts`)
- `docs/user-guide/{01-bat-dau.md,09-cai-dat.md,10-su-co.md}`, `docs/design/phase-6-hoan-thien.md` (§4.3), `docs/testing/nghiem-thu-v1.md`
- Owner duyệt 25/10/2026, lúc bắt đầu task:
  - `packages/domain/src/period.ts` + test (export hàm giờ `HH:MM` cho "Đã lưu HH:MM" của 10d) và khối codemap sinh tự động của `packages/domain/CLAUDE.md`;
  - `apps/desktop/src/shell/startup-error.test.ts` (chỉ câu mong đợi của hai câu lỗi khởi động, mục sổ L154 [T-294] gắn sau khi viết Issue);
  - `docs/design/phase-6-hoan-thien.md` §4.1, câu S2-6: mục 3 trái câu cũ "Đóng app trong lúc thay không phải chờ"; Owner chọn làm theo Issue (đóng app trong lúc Nạp lại / Nhập backup / Dọn sạch chờ việc đó xong và dữ liệu mới lưu xong) và sửa S2-6, §8 giữ là lịch sử;
  - câu D7 của Dọn sạch cũng chỉ tới Thử lại: `apps/desktop/src/routes/trash-view.test.ts` (một dòng mong đợi) và dòng D7 của `docs/design/phase-6-hoan-thien.md` §4.2; mockup 11j giữ nguyên, lệch ghi vào PR.

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-294]**: gộp. Mục khác trùng file (T-295 hộp 10c / `DataSections` / mở file, T-296 hộp Dọn sạch, T-301 `PersistQueue.unsaved()`) để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Lưu vẫn qua `PersistQueue` (ghi cả file sau mỗi transaction, ADR-0016); nút Thử lại không ghi gì khác ngoài bản đang có.
- Chuỗi qua `vi.ts`, token của `@p2c/ui`.

##### Test chấp nhận

- [ ] e2e (exe giả):
  - sau một lệnh, sidebar hiện "Đã lưu …";
  - đang lưu thì hiện "Đang lưu…";
  - `failSaves` thì hiện "Chưa lưu được vào file";
  - bản web hiện dòng bản web.
- [ ] e2e: lưu lỗi → hết lỗi → bấm Thử lại → dải mất; "Nạp lại" và Dọn sạch chạy được.
- [ ] e2e / unit: bấm X khi đang lưu → chờ lưu xong rồi đóng, có "Đang lưu…"; lưu lỗi → hộp hỏi như cũ.
- [ ] Unit: một listener ném lỗi không chặn listener khác; lỗi đi qua đường báo lỗi chung.
- [ ] Tài liệu nghiệm thu bỏ dòng lệch 10d; hướng dẫn tả chỉ báo mới.

Ước lượng: ≈ 180 dòng SP + ≈ 250 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-294] đã sửa sang RESOLVED

##### Rủi ro

risk:med

##### Bị chặn bởi

#782 (T-293)

## PR #817 — feat: one save state with a sidebar indicator, a retry on the save warning, and a close that waits (T-294)

Trạng thái: MERGED · merge 2026-10-24T19:03:02Z · commit `e7a11ba35d544f68b16bf87698fe6480cca38856` · nhánh `task/T-294-save-state` · nhãn: type:task, risk:med

Closes #783

#### Thay đổi

1. **Một nguồn trạng thái lưu** (mục 4; L76, L28): `PersistQueue.status()` trả `{ saving, failed, error, lastSave }`, cùng một object tới khi có gì đổi (đọc qua `useSyncExternalStore`).
   - `saveError` / `subscribeSaveError` của `AppData` bỏ. Lỗi của storage, giữ nguyên như Rust gửi (DR6-07), nằm ở `status().error`, cạnh `failed`. Giờ và cỡ của lần lưu cuối cũng do hàng đợi ghi (`createPersistQueue(write, clock)`).
   - Dải lưu lỗi, hộp đóng app và chỉ báo sidebar đọc `saves.status()`. `AppData.lastSave` / `subscribeLastSave` chỉ đọc lại hàng đợi, vì `SettingsDataFile.tsx` (dòng "Lưu lần cuối") ngoài danh sách file của #783 và #784.
   - NIT #87: mỗi listener được gọi trong `try` riêng, lỗi báo qua `console.error` (như `reportError` mặc định của `AppAi`), các listener khác vẫn được gọi. Lời gọi listener nằm ngoài `try` của lần ghi, nên lỗi của listener không biến lần ghi thành công thành lỗi, cũng không làm kẹt hàng đợi.
2. **Chỉ báo lưu 10d** (mục 1; L171): `SaveStateLine` ở chân sidebar, mọi màn:
   - "Đã lưu HH:MM": chấm ok, giờ địa phương của lần lưu cuối, qua `formatLocalTime` mới của `domain`;
   - "Đang lưu…": chấm fg-3. Lần ghi đang chạy hiện trước lần lưu lỗi trước đó, vì Thử lại hay thay đổi mới đang ghi lại nó;
   - "Chưa lưu được vào file": chữ và chấm danger;
   - bản web: câu `settings.file.web` (chấm info).
   - Mở app, chưa lưu gì trong phiên: "Đã lưu", không giờ (file đúng là dữ liệu đang hiện). Mockup không có trạng thái này.
   - `sticky bottom-0`: màn dài vẫn thấy. Đã kiểm trên bản web: bảng KH dài 16 000 px, dòng luôn ở đáy cửa sổ.
   - Không phải live region: lưu lỗi đã được báo bằng `role="alert"` của dải; đọc lên mỗi lần lưu thì trình đọc màn hình nói sau mọi thay đổi.
3. **Nút Thử lại trên dải lưu lỗi** (mục 2; L26): gọi `saves.flush()`, ghi lại ngay bản đang có, không ghi gì khác.
   - Lưu được: dải mất cùng nút. Focus còn ở nút (hay đã rơi về `body`) thì chuyển sang tiêu đề màn, phần tử kế tiếp trên trang.
   - Vẫn lỗi: dải ở lại, câu theo nguyên nhân của lần thử này.
   - Câu từ chối của Nạp lại, Nhập backup và Dọn sạch (D7) thêm vế "Bấm "Thử lại" ở dải cảnh báo đầu màn, lưu được rồi thì … lại." Chỉ đổi `vi.ts`; ba màn không phải sửa.
4. **Đóng app khi đang lưu** (mục 3; L24): `PersistQueue.track(work)` tính một lần thay dữ liệu (`inTurn` của `app-data.ts`: Nạp lại, Nhập backup, Dọn sạch) là "đang lưu" từ lúc gọi tới lúc xong.
   - `flush()` chờ lần thay đó, rồi chờ lần lưu dữ liệu mới. `idle()` không chờ, vì chính lần thay chờ `idle()` trước khi backup.
   - Nên bấm X lúc đang seed thì cửa sổ chờ, sidebar ghi "Đang lưu…". Spec S2-6 sửa theo (Owner 25/10).
5. **Câu lỗi khởi động** (L151), khớp trang Sự cố của hướng dẫn (PR #807):
   - `storage.backupFailedHelp` thêm "tài khoản Windows đang dùng được quyền đọc, ghi thư mục đó";
   - `storage.openFailedHelp` thêm "Không mở được thư mục backups thì nhờ người quản trị máy cấp lại quyền đọc thư mục đó trước."
   - Tài liệu nghiệm thu chỉ trích hai câu này bằng phần đầu kèm "…" (NT-DB-15), nên không phải sửa.
6. **Tài liệu**:
   - hướng dẫn: `01-bat-dau.md` (bảng chỉ báo, Thử lại, đóng app khi đang lưu), `09-cai-dat.md`, `10-su-co.md`;
   - spec Phase 6: §4.1 S2-6, §4.2 dòng D7, §4.3 dòng `01-bat-dau.md`;
   - nghiệm thu: bỏ dòng lệch 10d; NT-DB-03, 04 (bấm X lúc nhập / nạp lại: chờ), 09, 10, 13; thêm NT-DB-21 (chỉ báo) và NT-DB-22 (Thử lại); bảng đối chiếu 10d.

**File ngoài danh sách ban đầu của Issue:** Owner duyệt trong phiên 25/10, mục "File được phép sửa" của #783 đã ghi lại.
- `packages/domain/src/period.ts` + test, `src/index.ts`, khối codemap của `packages/domain/CLAUDE.md`: `formatLocalTime` (HH:MM) cho "Đã lưu HH:MM".
- `apps/desktop/src/shell/startup-error.test.ts`: câu mong đợi của L151.
- `docs/design/phase-6-hoan-thien.md` §4.1 S2-6: mục 3 của Issue trái câu cũ "Đóng app trong lúc thay không phải chờ"; Owner chọn theo Issue. §8 giữ là lịch sử.
- `apps/desktop/src/routes/trash-view.test.ts` và §4.2 dòng D7: câu D7 cũng chỉ tới Thử lại.

**Lệch mockup** (ghi theo quy tắc mockup, không sửa mockup):
- 11j (`trash.html`): câu D7 thêm vế Thử lại (Owner duyệt 25/10).
- 10d: thêm trạng thái "Đã lưu" không giờ, trước lần lưu đầu của phiên.
- Dải lưu lỗi giữ dạng dải ngang đầu cột như trước, câu theo nguyên nhân (DR6-07, DR6-120); chỉ thêm nút Thử lại. Mockup vẽ toast góc trên phải, có tiêu đề và câu chung.

#### Test chấp nhận

- [x] e2e (exe giả), `e2e/save-state.spec.ts`:
  - "the sidebar says when the data was saved, while it saves, and when it could not be (10d)": "Đã lưu 09:3x" sau lần lưu đầu; "Đang lưu…" khi `holdSaves` (mới trong `e2e/support.ts`); "Chưa lưu được vào file" khi `failSaves`, ở mọi màn; tương phản ≥ 4,5.
  - "web mode says, on every screen, that the data stays in the browser (10d)".
- [x] e2e: lưu lỗi, rồi hết lỗi, bấm Thử lại thì dải mất; Nạp lại và Dọn sạch chạy được.
  - `save-state.spec.ts`: Nạp lại bị từ chối với câu chỉ tới Thử lại. Thử lại khi còn lỗi: dải ở lại. Hết lỗi, Thử lại: dải mất, "Đã lưu …", focus về tiêu đề "Cài đặt". Nạp lại xong.
  - `trash.spec.ts` (D7): sau câu từ chối, Thử lại rồi Dọn sạch xong, "Thùng rác trống".
- [x] e2e / unit: bấm X khi đang lưu thì chờ lưu xong rồi đóng, có "Đang lưu…"; lưu lỗi thì hộp hỏi như cũ.
  - e2e: X khi lần lưu bị giữ: thứ tự `save`, `destroy` (`exe.events`, mới). X khi Nạp lại đang backup / seed: `backup`, `save`, `destroy`.
  - Unit `app-data.test.ts`: S2-6 nay chờ (file luôn là dữ liệu mới đủ); lần thay tính là đang lưu và `flush` chờ nó; lần thay bị từ chối thôi tính.
  - Hộp hỏi khi lưu lỗi: `dialog-keyboard.spec.ts`, `close-guard.test.ts`, `CloseGuard.test.tsx`, không đổi.
  - Đột biến: bỏ `saves.track(turn)` thì 2 test của `app-data.test.ts` đỏ.
- [x] Unit `persist-queue.test.ts`: "tells every listener when one throws, reports the error, and keeps saving (NIT #87)": listener kia vẫn được gọi, lỗi tới `console.error`, lần ghi thành công không thành lỗi, hàng đợi ghi tiếp. Test đỏ trước khi sửa.
- [x] Tài liệu nghiệm thu bỏ dòng lệch 10d; hướng dẫn tả chỉ báo mới (`01-bat-dau.md`, "App tự lưu").

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (18 mục "Trùng file"), cộng L26 (file của nó không đổi, đã sửa qua `vi.ts` và nút Thử lại):

- L24 [T-294] `CloseGuard.tsx` (#125), X lúc đang seed Nạp lại: **đã sửa** (mục 4).
- L26 [T-294] Nạp lại / Dọn sạch bị từ chối mà không có cách thử lưu lại: **đã sửa** (mục 3).
- L28 [T-294] NIT #87, listener ném lỗi: **đã sửa** (mục 1).
- L39 [T-291 #780] ngày nhanh đầu năm (`parseQuickDate`): để lại, luật G2 riêng của T-291; PR này chỉ thêm `formatLocalTime` vào `period.ts`.
- L49 [T-297 #786] dấu `:` của `KycExtraction.tsx`: để lại, của T-297.
- L62 [T-296 #785] slot `{count}` của `trash.customer.with`: để lại, của T-296.
- L75 [T-295 #784] `integrityCheck()` sau migrate: để lại, của T-295.
- L76 [T-294] `saveError` ở `AppData`: **đã sửa** (mục 1).
- L117 [G7] TR-3 dòng E7 của `phase-6-hoan-thien.md`: để lại, PR docs G7.
- L125 [T-296 #785] `policies.editLabel`: để lại, của T-296.
- L130 [T-298 #787] `outcome.caseSizeRead`: để lại, của T-298.
- L137 [G7] ca nghiệm thu thư mục cấm tạo file: để lại, PR docs G7.
- L151 [T-294] hai câu lỗi khởi động thiếu quyền đọc `backups\`: **đã sửa** (mục 5).
- L152 [T-301 #790] `useScreenFocus` tự gọi `isTauri()`: để lại, của T-301 (cần `App.tsx`, ngoài danh sách).
- L158 [T-297 #786] "20.000" của `aiPanel.web.refused.TOO_LONG`: để lại, của T-297.
- L164 [T-301 #790] `PersistQueue.unsaved()` chỉ test dùng: để lại cho T-301 như Issue ghi; PR này không dùng thêm.
- L168 [T-295 #784] `PerformanceMeasure` `p2c:db-save` tích lũy: để lại, của T-295 (đo vẫn ở hàm ghi của `app-data.ts`).
- L169 [T-295 #784] `openFrom` export hai lần: để lại, của T-295.
- L171 [T-294] lệch mockup 10d: **đã sửa** (mục 2).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local. Lần chạy đầu, test đo giờ `packages/ai/src/web.test.ts:445` dao động (51 / 50 ms) khi chạy coverage; chạy lại xanh, file đó không đổi.
- [x] `pnpm e2e` toàn bộ ở local: 278 passed (trước khi rebase lên #815 / #816, hai PR đó không đụng app)
- [x] Không thêm dependency ngoài ADR-0005
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Cỡ (không tính khối codemap): sản phẩm +210 / −88 (gồm các câu dài của `vi.ts`), test +429 / −44, tài liệu +32 / −17; tổng ≈ 820 dòng. Vượt ~800 một chút: Issue gộp 6 mục sổ (L24, L26, L28, L76, L151, L171) và ba quyết định Owner trong phiên (`formatLocalTime`, S2-6, câu D7). Phần lớn phần vượt là e2e của năm ca chấp nhận.

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #819 — docs: accept two notes of the PR 817 review as the mockup draws them (T-294)

Trạng thái: MERGED · merge 2026-10-24T19:13:40Z · commit `0e1ac429ba39fa336954fb9899610b0b6413aa38` · nhánh `docs/T-294-accepted-notes` · nhãn: type:task, risk:low

Refs #783

#### Thay đổi

Quyết định Owner 25/10 về hai ghi chú giao diện của review PR #817 (ghi ở PR #818): giữ như mockup `settings-data.html`, không sửa trước v1.0.

PR này chỉ sửa `docs/state/review-notes.md` nên không cần review (Owner quyết 12/10/2026, T-215).

**ACCEPTED mới (Owner 25/10, review #817):**
- `apps/desktop/src/shell/SaveWarning.tsx:33`: Thử lại mà vẫn lỗi cùng nguyên nhân thì màn không đổi gì. Mockup không vẽ trạng thái đang thử lại.
- `apps/desktop/src/shell/Sidebar.tsx:95`: "Đã lưu HH:MM" không có ngày khi app mở qua nửa đêm. Mockup 10d chỉ có `HH:MM`; ngày giờ đủ có ở Cài đặt → Dữ liệu ("Lưu lần cuối").

Mỗi mục giữ cách sửa nếu sau này cần (mục giờ cần G3).

**OPEN:** khối review #817 nay là "Năm ghi chú không chặn còn lại… và một nhắc G7", gồm hai mục [G7] và ba mục [T-301 #790]; dòng đầu khối ghi hai mục đã chuyển sang ACCEPTED.

#### Kiểm tra

- `node tools/notes-for.mjs --pr 817` trên sổ của nhánh: khối review #817 còn năm mục OPEN (`nghiem-thu-v1.md`, `phase-6-hoan-thien.md`, `app-data.ts`, ba file `shell/` của mục *Duplicated Code*, `e2e/save-state.spec.ts`); hai mục `SaveWarning.tsx:33`, `Sidebar.tsx:95` không còn ở OPEN.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-294 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #125, #96 / #87, #710, #620, #807 và lệch mockup 10d — T-294 (#783, PR #817, `REVIEW: PASS` @`ade08be`):
  - #125, `apps/desktop/src/shell/CloseGuard.tsx` (X lúc đang seed "Nạp lại"): `PersistQueue.track(work)` (`apps/desktop/src/data/persist-queue.ts`) tính một lần thay (`inTurn` của `apps/desktop/src/data/app-data.ts`: Nạp lại, Nhập backup, Dọn sạch) là đang lưu từ lúc gọi tới lúc xong; `flush()` chờ lần thay rồi chờ lần lưu dữ liệu mới, `idle()` không chờ (lần thay tự chờ `idle()` trước backup). Bấm X lúc đang backup / seed thì cửa sổ chờ, sidebar ghi "Đang lưu…". Câu S2-6 của `docs/design/phase-6-hoan-thien.md` đổi theo (Owner 25/10); phần câu còn hở: mục review #817 ở OPEN.
  - #96 / #710, sau một lần lưu lỗi Nạp lại / Nhập backup / Dọn sạch bị từ chối mà không có cách thử lưu lại: nút "Thử lại" trên dải lưu lỗi (`apps/desktop/src/shell/SaveWarning.tsx`) gọi `saves.flush()`, chỉ ghi lại bản đang có; lưu được thì dải mất, focus về tiêu đề màn. Ba câu từ chối (`apps/desktop/src/i18n/vi.ts`, gồm D7 của `trash.html` 11j) chỉ tới nút. Ca e2e ở `e2e/save-state.spec.ts` (Nạp lại) và `e2e/trash.spec.ts` (D7, rồi Dọn sạch xong).
  - #87, NIT listener ném lỗi (`apps/desktop/src/data/persist-queue.ts`): mỗi listener gọi trong `try` riêng, lỗi qua `console.error`, ngoài `try` của lần ghi; listener khác vẫn được gọi, lần ghi thành công không thành lỗi, hàng đợi không kẹt (test ở `apps/desktop/src/data/persist-queue.test.ts`).
  - #620, mùi `saveError` ở `AppData`: lỗi lưu cuối nằm ở `PersistQueue.status()` (`{ saving, failed, error, lastSave }`, cùng một object tới khi đổi), cạnh `failed`; `saveError` / `subscribeSaveError` của `apps/desktop/src/data/app-data.ts` bỏ. Dải lưu lỗi, hộp đóng app và chỉ báo sidebar đọc một store. `AppData.lastSave` / `subscribeLastSave` còn là lối đọc lại: mục review #817 ở OPEN.
  - #807, `apps/desktop/src/i18n/vi.ts` (`storage.openFailedHelp`, `storage.backupFailedHelp`): thêm vế quyền đọc thư mục `backups\` ("nhờ người quản trị máy cấp lại quyền đọc thư mục đó trước"; "tài khoản Windows đang dùng được quyền đọc, ghi thư mục đó"), khớp `docs/user-guide/10-su-co.md`. Tài liệu nghiệm thu chỉ trích phần đầu hai câu kèm "…" (NT-DB-15), nên không đổi.
  - Lệch mockup 10d (`docs/design/mockups/settings-data.html`, sổ review #549): `SaveStateLine` (`apps/desktop/src/shell/Sidebar.tsx`) ở chân sidebar, mọi màn, `sticky`: "Đã lưu HH:MM" (`formatLocalTime` mới của `packages/domain/src/period.ts`), "Đang lưu…", "Chưa lưu được vào file", bản web `settings.file.web`; mới mở, chưa lưu gì trong phiên thì "Đã lưu". Dòng lệch 10d của `docs/testing/nghiem-thu-v1.md` bỏ; thêm NT-DB-21, NT-DB-22. Ba lệch còn lại sau PR: mục review #817 ở OPEN.

---

# Issue #784 — T-295: Cài đặt → Dữ liệu và mở file: số liệu hộp 10c, kiểm file trước migrate, thông báo section, ChatGPT web

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **Hộp 10c (Nạp lại dữ liệu giả lập)** nêu số KH, lịch hẹn và HĐ sắp bị thay, như mockup 10c ("1.204 KH, 6.118 lịch hẹn, 1.012 HĐ").
2. **Cài đặt → Dữ liệu:** một state `{ from, notice }` ở `DataSections` thay bộ ba `last` / `showsNotice` / `onNotice` của từng section.
3. **Hộp 10b:** có test cho nhánh `SCHEMA_TOO_NEW`.
4. **Mở file dữ liệu:** `integrity_check` chạy trên file như đang lưu, **trước** khi migrate, để file hỏng ở schema cũ không được migration "che" rồi thành backup mới nhất (DR-51).
5. **Nhỏ:**
   - JSDoc `Tables` / `useTables`: không giữ một `Tables` qua `await` / qua lần thay dữ liệu;
   - test hợp đồng Tauri nhận semver có hậu tố (`1.1.0-rc.1`);
   - `startChatGptWeb` kiểm lại `generation` sau các `await` copy / mở trình duyệt (thay dữ liệu xong giữa chừng → `discarded`, không copy tin nhắn cũ).
6. **Hai mục đưa lại từ ACCEPTED (Owner 23/10):**
   - mốc đo `p2c:db-save` không tăng mãi trong một phiên dài (`clearMeasures`, hoặc giữ tối đa N mục);
   - `openFrom` không ghi hai lần một snapshot giống nhau khi có migration.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Issue này gom các mục OPEN gắn **[T-295]**:
- phần hộp 10c của mục Cài đặt #96 / #87;
- `DataSections` (#630); nhánh `SCHEMA_TOO_NEW` (#185);
- `integrity_check` trước migrate (#620 / #674);
- `Tables` (#386); semver (#674); `startChatGptWeb` (#628);
- hai mục đưa lại từ ACCEPTED (#572, #620).

Mockup 10c đã có số liệu: không cần G3.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-295]
- `docs/design/mockups/settings-data.html` (10b, 10c); `docs/design/phase-3-du-lieu.md` §5 (khởi động, kiểm file); DR-51 (`docs/reviews/2026-10-06-deep-review-phase-1-4-tong-hop.md`)
- `apps/desktop/src/routes/{Settings.tsx,SettingsBackup.tsx}`
- `apps/desktop/src/data/{app-data.ts,tables.ts,ai-analysis.ts,tauri-contract.test.ts}`
- `packages/db/src/database.ts` (`openDatabase`, `integrityCheck`, `migrate`); `packages/db/src/counts.ts` (`countRecords`)

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/{Settings.tsx,SettingsBackup.tsx}` + test
- `apps/desktop/src/data/{app-data.ts,tables.ts,ai-analysis.ts,AppDataContext.tsx,tauri-contract.test.ts}` + test
- `packages/db/src/database.ts` + test (nếu kiểm trước migrate đặt ở `openDatabase`)
- `apps/desktop/src/i18n/vi.ts`
- `e2e/{demo-data.spec.ts,backup.spec.ts}`
- `docs/user-guide/09-cai-dat.md`, `docs/testing/nghiem-thu-v1.md` (dòng CD-08 nếu câu hộp 10c đổi)

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-295]**: gộp. Mục khác trùng file (T-294 trạng thái lưu, T-296 hộp xác nhận dùng chung với Dọn sạch) để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Không đổi mã lỗi khởi động. File hỏng trước migrate ra đúng trang lỗi như file hỏng ở schema mới.
- Số liệu hộp 10c đọc bằng hàm đếm có sẵn của `db`.

##### Test chấp nhận

- [ ] e2e: hộp 10c có số KH / lịch hẹn / HĐ đúng dữ liệu đang mở.
- [ ] Unit:
  - file ở schema cũ, hỏng trong bảng mà migration dựng lại → bị bắt trước migrate;
  - không có backup mới nào chép từ file hỏng.
- [ ] Test hộp 10b nhánh `SCHEMA_TOO_NEW` (câu "File tạo từ bản app mới hơn …").
- [ ] Unit: thay dữ liệu xong giữa các `await` của `startChatGptWeb` → `discarded`, không copy.
- [ ] Unit: `openFrom` có migration ghi một lần; mốc `p2c:db-save` không vượt N.
- [ ] Đổi section có thông báo (Backup ↔ Dữ liệu giả lập) giữ đúng hành vi của DR6-45.

Ước lượng: ≈ 100 dòng SP + ≈ 180 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-295] đã sửa sang RESOLVED

##### Rủi ro

risk:med

##### Bị chặn bởi

#783 (T-294)

## PR #825 — fix: check the data file before migrating it, counts in dialog 10c, one notice state (T-295)

Trạng thái: MERGED · merge 2026-10-25T04:02:42Z · commit `10b5bd7bc41081f3ae428579d28ed5a0b55a3852` · nhánh `task/T-295-settings-data-open-check` · nhãn: type:task, risk:med

Closes #784

#### Thay đổi

1. **Kiểm file trước migrate** (mục 4; L67, DR-51):
   - `openDatabase` có tùy chọn `check(db)`: chạy trên file như đang lưu, sau lần từ chối `SCHEMA_TOO_NEW` và trước mọi migration. Ném lỗi thì không mở: DB đóng, không lưu gì.
   - `openAppData` truyền `refuseDamaged` (`integrity_check`, lỗi `DATA_DAMAGED` như cũ) thay cho lần kiểm sau khi mở. Mã lỗi khởi động không đổi: file hỏng trước migrate ra đúng trang "File dữ liệu bị hỏng" như file hỏng ở schema mới. File ở schema mới nhất vẫn chỉ một lần `integrity_check`.
   - Ca thật có trong repo: migration 11 (`0010_people_team_none`) dựng lại `people`. Chỉ mục khóa chính `sqlite_autoindex_people_1` đi theo bảng cũ, nên ở file schema 10, một khóa lệch một byte biến mất khỏi DB đã migrate (`integrityCheck()` = `[]`), trong khi file trên đĩa vẫn hỏng.
   - Test app dựng file schema 10 bằng chính các file `packages/db/migrations/*.sql` (đọc đĩa, như `tauri-contract.test.ts` đọc file Rust): `@p2c/db` không export `MIGRATIONS`, và thêm export chỉ để test là mùi DR6-66 (`index.ts` cũng ngoài danh sách file).
2. **`openFrom` ghi một lần** (mục 6; L165): `open` báo `migrated` (migration đã lưu trong lúc mở, lần lưu duy nhất lúc đó). `openFrom` chỉ `export()` rồi lưu khi chưa có lần đó.
3. **Mốc `p2c:db-save`** (mục 6; L164): app giữ tối đa 50 mốc. Đủ 50 thì `clearMeasures` rồi đo tiếp, nên số mốc vẫn đổi sau mỗi lần lưu. Probe `e2e/perf` chờ đúng điều đó (`saved().length === saves0`, rồi đọc `.at(-1)`), nên không phải sửa probe. Cách "bỏ mốc cũ nhất, giữ đúng 50" thì số mốc đứng yên ở 50 và probe chờ mãi.
4. **`startChatGptWeb`** (mục 5; L69): so lại `generation` sau `await` copy và sau `await` mở trình duyệt. Dữ liệu thay xong ở giữa → `discarded`: không mở chatgpt.com sau đó; panel không giữ phiên nên không còn tin nhắn cũ để copy tay (4f).
   - Lần thay còn đang chạy thì phiên vẫn mở, như Kiểm tra và lưu (S2-2 / S2-4): lần thay có thể lỗi, dữ liệu khi đó vẫn vậy; xong thì `generation` đóng phiên (e2e DR6-15 của `customer-ai-web.spec.ts`). Bản đầu của PR (`e478b6f`) kiểm cả `replacing()` như `analyseCustomer`, và e2e đó đỏ trên CI; `4497e63` sửa lại chỉ so `generation`, có unit test riêng cho ca này.
   - Lệnh copy bắt đầu ngay lúc bấm, trước mọi `await`, nên không thu lại được: clipboard có thể giữ tin nhắn cũ, nhưng không phiên nào nhận câu trả lời của nó.
5. **Hộp 10c** (mục 1; L25): "Toàn bộ dữ liệu hiện tại (1.200 KH, 6.229 lịch hẹn, 988 HĐ) được thay bằng dữ liệu giả lập mới, neo ở ngày …", như mockup.
   - Số đọc bằng `countRecords` (`AppData.counts()`), đếm một lần khi mở hộp: lần nạp lại thay dữ liệu trước khi hộp đóng, câu không được đổi theo.
   - Lệch có từ trước, giữ nguyên: ngày neo không in đậm; khung backup ghi câu chung, không tên file (app chưa biết tên trước khi backup).
6. **Một state thông báo cho Cài đặt → Dữ liệu** (mục 2; L72, DR6-45): `DataSections` giữ `{ from, notice }`. `DataNoticeProps<N>` là `{ notice, onNotice }`:
   - section chỉ thấy thông báo của mình;
   - `onNotice(x)` thay thông báo của mọi section;
   - `onNotice(null)` chỉ bỏ thông báo của chính section đó (đầu lần xuất / đọc file, như `setNotice(null)` cũ).
   - Section không còn giữ bản ẩn; section thứ ba chỉ thêm một dòng `noticeOf`.
7. **Nhỏ**:
   - test hộp 10b nhánh `SCHEMA_TOO_NEW` (mục 3; L15);
   - JSDoc `Tables` / `useTables`: không giữ qua `await` (L17);
   - test semver (L88): `RELEASE` nhận hậu tố pre-release / build; test riêng các ca nhận và từ chối.
8. **Tài liệu**: `docs/user-guide/09-cai-dat.md` §Nạp lại, `docs/testing/nghiem-thu-v1.md` NT-CD-08.
   - Ảnh `docs/user-guide/img/09-nap-lai.png` chưa có số liệu mới (ngoài danh sách file): để lần chụp lại ảnh của G7; PR sổ sau review ghi mục [G7].

#### Test chấp nhận

- [x] e2e `demo-data.spec.ts` "the reload dialog names how many customers, appointments and policies it replaces (10c)": thêm một KH, rồi so câu của hộp với dòng Nội dung của thẻ File dữ liệu.
- [x] Unit, file schema cũ hỏng trong bảng mà migration dựng lại:
  - `database.test.ts` "hides damage in a table a migration rebuilds, which only a check before migrating finds": DB đã migrate kiểm ra `[]`, `check` thấy `sqlite_autoindex_people_1`;
  - `database.test.ts` "checks the file as it was stored, before any migration, and opens nothing the check refuses" (check thấy schema cũ; ném thì không lưu); "refuses a file made by a newer app, without checking…" (check không chạy);
  - `app-data.test.ts` "checks the stored file before migrating it: damage a migration would hide is refused, never backed up (DR-51)": `DATA_DAMAGED`, `cause` nêu `sqlite_autoindex_people_1`, storage không có `backup` hay `save`. Đỏ trước khi sửa (app mở file và backup nó).
- [x] e2e `backup.spec.ts` "refuses a backup made by a newer app, naming both schema versions (10b)".
- [x] Unit `ai-analysis.test.ts` "discards the session when the data is replaced while it copies the message / opens chatgpt.com: nothing opened after, no message left to copy (DR6-15)". Thay test DR6-15 cũ "though replaced while it copies", vốn chờ ra phiên. Copy trả `false`, nên phiên cũ sẽ để tin nhắn cũ cho copy tay. Bỏ một trong hai lần kiểm thì ca tương ứng đỏ.
  - "opens a session while the data is still being replaced: the replace may fail, the data then the same (S2-4)": phiên mở trong lúc Nạp lại chờ backup; backup lỗi thì câu trả lời vẫn lưu được. Đỏ với bản kiểm cả `replacing()`.
  - e2e `customer-ai-web.spec.ts` "the session leaves the panel once the data is replaced under it (DR6-15)" (có sẵn) xanh lại.
- [x] Unit `app-data.test.ts`:
  - "saves data that migrates as it opens once: the migration saved it already (review of PR 620)" (trước: 2 lần lưu);
  - "keeps at most 50 measures of the file saves, their count changing with each (review of PR 572)" (120 lần lưu).
- [x] Đổi section có thông báo (DR6-45), `backup.spec.ts`: "a reload then an import leave only the notice of the import" (có sẵn) và "an export then a reload leave only the notice of the reload, which a cancelled import keeps" (mới: chiều ngược, cộng `onNotice(null)` chỉ bỏ thông báo của chính section).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (20 mục "Trùng file"):

- L15 [T-295] nhánh `SCHEMA_TOO_NEW` của hộp 10b chưa có test: **đã sửa** (mục 7).
- L17 [T-295] `Tables` giữ qua `replace`: **đã sửa** (mục 7, JSDoc).
- L25 [T-295] hộp 10c thiếu số lượng: **đã sửa** (mục 5).
- L45 [T-297 #786] dấu `:` của `KycExtraction.tsx`: để lại, của T-297.
- L55 [T-296 #785] slot `{count}` của `trash.customer.with`: để lại, của T-296.
- L67 [T-295] `integrityCheck()` chạy trên DB đã migrate: **đã sửa** (mục 1).
- L69 [T-295] `startChatGptWeb` không kiểm lại `generation`: **đã sửa** (mục 4).
- L72 [T-295] bộ ba `last` / `showsNotice` / `onNotice`: **đã sửa** (mục 6).
- L88 [T-295] regex semver: **đã sửa** (mục 7).
- L98 [T-296 #785] hộp gõ chữ xác nhận dùng chung với `PurgeDialog`: để lại, của T-296 (Issue ghi rõ).
- L116 [T-296 #785] `policies.editLabel`: để lại, của T-296.
- L121 [T-298 #787] `outcome.caseSizeRead`: để lại, của T-298.
- L128 [G7] ca nghiệm thu thư mục cấm tạo file: để lại, PR docs G7.
- L144 [T-297 #786] "20.000" của `aiPanel.web.refused.TOO_LONG`: để lại, của T-297.
- L147 [G7] ba lệch mockup chưa có dòng ở `nghiem-thu-v1.md`: để lại, PR docs G7.
- L149 [T-301 #790] `subscribeLastSave` / `lastSave` của `AppData`: để lại, của T-301 (`SettingsDataFile.tsx` ngoài danh sách).
- L150 [T-301 #790] `useSyncExternalStore(saves.subscribe, saves.status)` lặp: để lại, của T-301.
- L160 [T-301 #790] export không ai dùng (DR6-66 phần app): để lại, của T-301.
- L164 [T-295] mốc `p2c:db-save` tăng mãi: **đã sửa** (mục 3).
- L165 [T-295] `openFrom` ghi hai lần khi có migration: **đã sửa** (mục 2).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] e2e `backup.spec.ts` + `demo-data.spec.ts` (15 test) và `customer-ai-web.spec.ts` xanh ở local; hộp 10c xem trên bản web, console không lỗi
- [x] Không thêm dependency ngoài ADR-0005
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-295 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #96 / #87, #185, #386, #572, #620, #628, #630, #674 — T-295 (#784, PR #825, `REVIEW: PASS` @`4497e63`):
  - #96 / #87, `apps/desktop/src/routes/Settings.tsx` (`ReloadDialog`, hộp 10c): câu ghi số KH, lịch hẹn, HĐ sắp bị thay như mockup ("Toàn bộ dữ liệu hiện tại (1.204 KH, 6.118 lịch hẹn, 1.012 HĐ) được thay…"). Số đọc bằng `AppData.counts()` (`countRecords`), đếm một lần khi mở hộp, nên lần nạp lại thay dữ liệu trước khi hộp đóng không đổi câu. Ca e2e ở `e2e/demo-data.spec.ts` (so với dòng Nội dung của thẻ File dữ liệu); `docs/user-guide/09-cai-dat.md` và NT-CD-08 đổi theo. Ảnh `09-nap-lai.png` và hai lệch 10c có từ trước: mục review #825 ở OPEN.
  - #630, mùi bộ ba `last` / `showsNotice` / `onNotice` (DR6-45): `DataSections` giữ một state `{ from, notice }`; `DataNoticeProps<N>` (`apps/desktop/src/routes/SettingsBackup.tsx`) là `{ notice, onNotice }`, `onNotice(null)` chỉ bỏ thông báo của chính section đó. Section không còn giữ bản ẩn; section thứ ba chỉ thêm một dòng `noticeOf`. Ca e2e hai chiều ở `e2e/backup.spec.ts`. Phép ép kiểu của `noticeOf`: mục review #825 ở OPEN.
  - #185, `apps/desktop/src/routes/SettingsBackup.tsx` (hộp 10b, nhánh `SCHEMA_TOO_NEW`): ca e2e "refuses a backup made by a newer app, naming both schema versions (10b)" ở `e2e/backup.spec.ts`.
  - #620 (DR-51; #674 đổi `quickCheck` thành `integrityCheck` mà không đổi chỗ chạy), `apps/desktop/src/data/app-data.ts`: `integrity_check` chạy trên file như đang lưu, trước mọi migration. `openDatabase` có tùy chọn `check` (`packages/db/src/database.ts`), chạy sau lần từ chối `SCHEMA_TOO_NEW` và trước `migrate`; ném lỗi thì DB đóng, không lưu gì. `openAppData` truyền `refuseDamaged` (mã `DATA_DAMAGED` như cũ, cùng trang lỗi khởi động). Ca thật: migration 11 (`0010_people_team_none`) dựng lại `people`, một khóa lệch một byte của `sqlite_autoindex_people_1` mất khỏi DB đã migrate. Test ở `packages/db/src/database.test.ts` và `apps/desktop/src/data/app-data.test.ts` (không backup, không lưu).
  - #386, `apps/desktop/src/data/tables.ts`: JSDoc `Tables` và `useTables` (`apps/desktop/src/data/AppDataContext.tsx`) ghi không giữ một `Tables` qua `await`: lần nạp lại / nhập có thể đã đóng DB của nó; lấy lại qua `useTables`.
  - #674, `apps/desktop/src/data/tauri-contract.test.ts`: hằng `RELEASE` nhận hậu tố pre-release / build của semver (`1.1.0-rc.1`); một ca riêng liệt kê bản nhận và bản từ chối.
  - #628, `apps/desktop/src/data/ai-analysis.ts` (`startChatGptWeb`): so lại `generation` sau lần copy và sau lần mở trình duyệt; dữ liệu thay xong ở giữa → `discarded`, không mở chatgpt.com sau đó, không còn tin nhắn cũ để copy tay. Lần thay còn đang chạy thì phiên vẫn mở, như Kiểm tra và lưu (S2-4). Test ở `apps/desktop/src/data/ai-analysis.test.ts`; e2e DR6-15 của `e2e/customer-ai-web.spec.ts` giữ nguyên.
  - #572 (từ ACCEPTED, Owner 23/10 đưa vào đợt sửa), `apps/desktop/src/data/app-data.ts`: đủ 50 mốc `p2c:db-save` thì `clearMeasures` rồi đo tiếp, nên số mốc vẫn đổi sau mỗi lần lưu và probe `e2e/perf/probe.perf.ts` không phải sửa. Ca 120 lần lưu ở `apps/desktop/src/data/app-data.test.ts`. Tên hằng `SAVE_MEASURES`: mục review #825 ở OPEN.
  - #620 (từ ACCEPTED, Owner 23/10 đưa vào đợt sửa), `apps/desktop/src/data/app-data.ts` (`openFrom`): `open` báo `migrated` (migration đã lưu trong lúc mở, lần lưu duy nhất lúc đó); `openFrom` chỉ `export()` rồi lưu khi chưa có lần đó, nên file có migration ghi một lần.

---

# Issue #785 — T-296: Thùng rác và Hợp đồng: hộp xác nhận dùng chung, tên nút theo ô, trạng thái HĐ, câu E20, hộp 8d

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **Hộp gõ chữ xác nhận dùng chung** cho Dọn sạch Thùng rác và Nạp lại dữ liệu giả lập:
   - so khớp NFC (review R4);
   - chặn đóng / gửi khi đang chạy;
   - cặp nút Hủy / xác nhận;
   - mỗi hộp chỉ truyền phần thân, chữ xác nhận, nhãn nút và hàm chạy.
2. **Hộp Dọn sạch** đọc kế hoạch một lần lúc mở. Không chạy lại `keptRecords` mà danh sách vừa chạy, và không chạy thêm một lần trên DB đã dọn.
3. **Câu "đã dọn"** không nối bằng `.join(' ')`; đặt câu như màn Nạp lại / Nhập.
4. **Tên nút khôi phục:**
   - dựng từ `recordTitle(row)` (cộng trạng thái HĐ), để tên khớp ô "Bản ghi" theo cách dựng;
   - một helper chữ trạng thái HĐ dùng chung cho ô, tên nút, thẻ Hợp đồng và hộp HĐ.
5. **Tên nút "Sửa HĐ" của thẻ Hợp đồng** có trạng thái: hai HĐ cùng ngày nộp, cùng FYP nộp, khác trạng thái thì tên khác nhau.
6. **Slot `kycNotes`** riêng cho số ghi chú KYC trong câu khôi phục KH, thay `{count}`.
7. **Câu lý do E20 của Thùng rác** đọc cờ "cùng ngày" trong params của lỗi, không so chuỗi ngày đã định dạng.
8. **Hộp 8d** nêu cả số HĐ nộp / phát hành chuyển tháng khi dời ngày sang tháng khác. Làm theo mockup 8d mà Owner duyệt ở T-284 (G3).

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Issue này gom các mục OPEN gắn **[T-296]**:
- review #710 (hộp dùng chung, `previewPurge`, `purgedNotice`);
- review #748 (`restoreLabel`, chữ trạng thái HĐ, tên nút Hợp đồng);
- review #543 (slot);
- review #667 (câu E20);
- review #634 (hộp 8d).

Mục 8 chờ T-284 merge.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-296]
- `docs/design/phase-6-hoan-thien.md` §4.2 (TR-3, TR-11, D1–D13, 11a, 11j); `docs/design/mockups/trash.html`; `docs/design/mockups/policy-forms.html` (8d, bản Owner duyệt ở T-284); `docs/design/mockups/settings-data.html` (10c)
- `apps/desktop/src/routes/{SettingsTrash.tsx,Settings.tsx,trash-view.ts,RestoreDialog.tsx}`
- `apps/desktop/src/routes/customers/{CustomerPolicies.tsx,PolicyDialogs.tsx,policy-form.ts}`
- `apps/desktop/src/i18n/{index.ts,vi.ts}` (`COUNT_SLOTS`, `trash.*`, `policies.*`)
- `packages/db/src/{customers.ts,appointments.ts,trash.ts}` (params của `TRANSITION_BEFORE_LATEST`, E7 / E20)

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/{SettingsTrash.tsx,Settings.tsx,trash-view.ts,RestoreDialog.tsx}` + test
- `apps/desktop/src/routes/customers/{CustomerPolicies.tsx,PolicyDialogs.tsx,policy-form.ts}` + test
- `apps/desktop/src/i18n/{index.ts,vi.ts}` + test
- `packages/db/src/{customers.ts,appointments.ts,trash.ts}` + test (chỉ params của lỗi)
- `e2e/{trash.spec.ts,customer-policies.spec.ts,demo-data.spec.ts}`
- `docs/user-guide/{05-ho-so-kh.md,09-cai-dat.md}`, `docs/testing/nghiem-thu-v1.md`

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-296]**: gộp. Mục khác trùng file (T-294 / T-295 phần Cài đặt, T-301 dọn app) để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Hành vi Dọn sạch / Nạp lại không đổi (TR-11, D1–D13).
- Cờ E20 thêm vào params của lỗi, không đổi mã lỗi.

##### Test chấp nhận

- [ ] e2e:
  - hai HĐ cùng ngày nộp và cùng FYP, khác trạng thái → hai tên nút "Sửa HĐ" khác nhau;
  - tên nút khôi phục chứa đúng chữ của ô "Bản ghi".
- [ ] Unit: câu E20 ra theo cờ. Đổi định dạng ngày không làm câu sai (đột biến ghi trong PR).
- [ ] Unit / e2e: mở hộp Dọn sạch, dọn xong → `previewPurge` / `keptRecords` không chạy thêm lần nào (đếm lời gọi).
- [ ] Test cũ của hộp Dọn sạch / Nạp lại xanh (hộp dùng chung giữ hành vi).
- [ ] Sau T-284: hộp 8d hiện dòng số HĐ khi dời ngày sang tháng khác.

Ước lượng: ≈ 150 dòng SP + ≈ 200 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-296] đã sửa sang RESOLVED

##### Rủi ro

risk:med

##### Bị chặn bởi

#773 (T-284), #784 (T-295)

## PR #833 — fix: one confirm-word dialog, the purge plan from the list, restore names from their cell, the E20 flag, 8d count lines (T-296)

Trạng thái: MERGED · merge 2026-10-25T11:11:42Z · commit `b71239a71af628758d4bdba069f3c38bc87457fc` · nhánh `task/T-296-trash-policy-dialogs` · nhãn: type:task, risk:med

Closes #785

#### Thay đổi

1. **Hộp gõ chữ xác nhận dùng chung** (mục 1; L76): `ConfirmWordDialog` cho Nạp lại (10c) và Dọn sạch Thùng rác (11i).
   - Hộp lo phần chung: so khớp NFC (review R4); khi đang chạy thì Escape, Hủy và nút xác nhận đều tắt, Enter không chạy lần hai; cặp nút Hủy / xác nhận; ô "Gõ … để xác nhận".
   - Mỗi hộp chỉ truyền tiêu đề, phần thân, chữ xác nhận, hai nhãn nút (thường / đang chạy) và hàm chạy. Hàm chạy tự đóng hộp với kết quả, như trước.
   - DOM của hai hộp giữ như cũ: thân, rồi ô gõ chữ, rồi Hủy / nút xác nhận.
   - **File mới ngoài danh sách:** `apps/desktop/src/routes/ConfirmWordDialog.tsx`. Đặt trong `Settings.tsx` thì `SettingsTrash.tsx` phải import ngược lại `Settings.tsx`, mà `Settings.tsx` đã import `SettingsTrash.tsx`: vòng import, dependency-cruiser `no-circular` chặn. Đặt trong `SettingsTrash.tsx` thì hộp Nạp lại phụ thuộc file màn Thùng rác. `apps/desktop/CLAUDE.md` đổi một dòng theo (khối codemap sinh tự động).
2. **Hộp Dọn sạch đọc kế hoạch một lần, từ danh sách** (mục 2; L77):
   - Bấm "Dọn sạch Thùng rác…" thì màn tính `purgeView(purgePlan(rows))` từ chính các dòng `listTrash` vừa đọc, rồi mở hộp với kế hoạch đó. Hộp không còn `useQuery(previewPurge)`.
   - Mỗi dòng đã có `keptBy` (từ `keptRecords` của `listTrash`) và số bản ghi con của KH (`countCustomerRecords`, như 11b), nên `purgePlan` không đọc DB. Mở hộp: `keptRecords` không chạy lần nào. Dọn xong: hộp không chạy gì trên DB đã dọn; chỉ lệnh dọn chạy `keptRecords` một lần trong transaction của nó, rồi danh sách đọc lại như mọi lần đổi dữ liệu.
   - `purgePlan` đếm theo đúng luật của `previewPurge` (KH; bản ghi con chưa xóa riêng của KH; lịch hẹn, nhân sự, team không bị giữ; mọi HĐ đã xóa). Test so bằng `toEqual` hai kết quả trên một Thùng rác đủ năm loại, có lịch Dời lịch bị giữ (D5).
   - Lệch chữ spec, không lệch hành vi: spec §4.2 (mô hình dữ liệu của dọn sạch) ghi `@p2c/db` có "một hàm xem trước cho hộp 11i". Hàm đó (`previewPurge`) vẫn là kế hoạch của lệnh dọn và là chuẩn so trong test; hộp nay đọc cùng kế hoạch từ danh sách, như Issue mục 2 đòi. Chữ spec để nguyên (`docs/design/` ngoài danh sách file).
3. **Câu "đã dọn" theo từng câu** (mục 3; L78): `purgedNotice` trả `{ title, deleted, kept, backup }`, mỗi trường một câu hoặc `null`. Màn đặt các câu cạnh nhau trong JSX, như Nạp lại / Nhập đặt "Backup: …". Không còn `.join(' ')` dưới `routes/`. Phần từ chối tách thành kiểu riêng `PurgeRefusal` (`title`, `detail` như cũ).
4. **Tên nút khôi phục dựng từ ô "Bản ghi"** (mục 4; L94, L95):
   - `restoreLabel` = "Khôi phục <loại> " + `recordTitle(row)` (HĐ: + " · " + trạng thái), rồi "của KH …" với lịch hẹn / HĐ. Ô đổi thì tên đổi theo, không còn câu thứ hai phải giữ khớp.
   - Hệ quả: tên nút HĐ viết "Nộp" hoa như dòng đầu của ô: "Khôi phục HĐ Nộp 15/09/2026 · 24.000.000 ₫ · Đã nộp của KH …" (trước: "HĐ nộp …"). Lịch hẹn, KH, nhân sự, team: tên không đổi.
   - `policyStatusText` (`policy-form.ts`): một chỗ cho chữ trạng thái HĐ, dùng ở huy hiệu ô Thùng rác, tên nút khôi phục, huy hiệu và tên nút thẻ Hợp đồng, dòng dưới tiêu đề hộp 8d.
5. **Tên nút "Sửa HĐ" có trạng thái** (mục 5; L93): `policies.editLabel` = "Sửa HĐ nộp {date} · {fyp} · {status}". Nút "Phát hành" giữ tên cũ: chỉ HĐ chưa phát hành có nút đó.
6. **Slot `kycNotes`** (mục 6; L45): `trash.customer.with` dùng `{kycNotes}` thay `{count}`; `kycNotes` vào `COUNT_SLOTS` (số có dấu ngăn nghìn).
7. **Cờ E20** (mục 7; L69, L70):
   - `checkTransition` thêm `sameDay: 1` vào params của `TRANSITION_BEFORE_LATEST` khi chuyển nhóm mới nhất cùng ngày nhưng ghi sau (E20). Mã lỗi không đổi; ca ngày sau (E6, E7, E8) params vẫn chỉ `{ date }` (test `toEqual`).
   - Câu Thùng rác đọc cờ, không so `params.date` với `formatDate(row.date)`.
   - **Ngoài danh sách (chỉ comment):** `packages/db/src/errors.ts`, JSDoc của mã `TRANSITION_BEFORE_LATEST` (nơi ghi params của từng mã) thêm `sameDay`.
8. **Hộp 8d: dòng số HĐ khi dời tháng** (mục 8; L63), theo mẫu "8d dời tháng" Owner duyệt ở T-284:
   - Ngày nộp / phát hành sang tháng khác: sau các dòng FYP của chỉ số đó thêm "tháng <cũ>: −1 HĐ nộp · tháng <mới>: +1 HĐ nộp" ("HĐ phát hành" với ngày phát hành); tháng kèm năm; không nêu RE, như mockup.
   - Dời cả hai ngày: hai dòng số HĐ. Dời trong cùng tháng hay chỉ sửa FYP: không có dòng số HĐ.
   - `Effect` thành union `fyp` / `count`; dòng của hộp khóa theo chữ (mỗi dòng một chữ khác nhau).
   - Lệch mockup có từ trước, giữ nguyên: số tiền và "−1" / "+1" không in đậm (dòng FYP của 8d cũng vậy).
9. **Kiểu thông báo của Cài đặt → Dữ liệu** (L127): bảng `DataNotices` `{ backup: BackupNotice; demo: Outcome }`; `noticeOf('backup')` tự suy kiểu, phép ép chỉ còn trong `noticeOf`.
10. **Tài liệu:**
    - `docs/user-guide/05-ho-so-kh.md` (Sửa HĐ): khung Ảnh hưởng chỉ số nêu FYP nộp / phát hành và dòng số HĐ khi dời tháng.
    - `docs/user-guide/09-cai-dat.md` (bảng lý do không khôi phục được): thêm dòng câu E20 "… ghi sau lúc xóa cuộc hẹn này …"; dòng câu E6 bỏ vế cùng ngày.
    - `docs/testing/nghiem-thu-v1.md`: NT-HS-17 thêm bước dời ngày nộp sang tháng trước; NT-TR-20 sửa câu chờ đợi, đang ghi câu E6 cũ ("sau ngày cuộc hẹn này") thay câu E20 có từ #667.

#### Test chấp nhận

- [x] e2e `customer-policies.spec.ts` "a policy submitted and one issued, of one day and one FYP, have two "Sửa" names" (mới); ca DR6-119 có sẵn đổi tên "Sửa" theo.
- [x] e2e `trash.spec.ts`:
  - "names each restore button by the words of its "Bản ghi" cell, a policy with its status" (mới): hai HĐ cùng KH, cùng ngày nộp, cùng FYP, một đã phát hành; tên nút = "Khôi phục HĐ " + chữ dòng đầu của ô + " · " + chữ huy hiệu, cả hai đọc từ màn; hai tên khác nhau;
  - "a deleted appointment shows in Thùng rác…" (có sẵn) thêm: tên nút = "Khôi phục lịch hẹn " + chữ dòng đầu của ô + " của KH …".
- [x] Unit `trash-view.test.ts` "E20: goes by the flag of the command, not by a day written as the row writes it" (mới): cùng ngày mà không có cờ → câu E6; có cờ mà ngày viết dạng khác (`2026-09-28`) → câu E20. Đỏ trên code cũ (code cũ chọn câu theo chữ ngày).
  - Đột biến (chạy ở phiên này rồi khôi phục):
    - M-A, đổi định dạng ngày: `checkTransition` ghi `date` dạng lưu (`2026-10-02`) thay `formatDate`. Code mới: ca E20 thật (`E20 as the trash finds it`, dữ liệu dựng bằng lệnh) vẫn ra câu "… ngày 2026-10-02, ghi sau lúc xóa cuộc hẹn này …"; 5 test đỏ chỉ vì chữ ngày (`sameDay: 1` còn nguyên).
    - M-B, bỏ cờ ở `checkTransition`: 4 test E20 của `trash.test.ts` đỏ (thiếu `sameDay`), ca E20 thật ra câu E6.
    - M-C, màn so chuỗi ngày như code cũ: test "goes by the flag…" đỏ (cùng ngày, không cờ → câu E20). M-C cộng M-A: ca E20 thật ra câu E6 "… ngày 2026-10-02, sau ngày cuộc hẹn này …", tức cách cũ sai khi định dạng ngày đổi.
- [x] Unit `trash-view.test.ts` "opening the dialog and purging run keptRecords for the purge alone" (mới): đếm số lần câu SQL đầu tiên của `keptRecords` chạy (`vi.spyOn(db.sqlite.exec)`): `listTrash` 1; `purgeView(purgePlan(rows))` (hộp mở) vẫn 1; `app.purgeTrash()` 2 (của lệnh dọn); và hộp nói đúng những gì đã dọn (`purgeView(purged)` = hộp). "D1, D5: the dialog reads the plan of the purge from the rows of the list": `purgePlan(listTrash(db))` `toEqual` `previewPurge(db)`.
  - Màn không có unit test React (vitest chưa có DOM, G4): phần "đọc một lần lúc bấm mở" nằm ở `useState` của `TrashSection`, các ca e2e D1 / D5 của hộp (số theo loại, "Giữ lại 1 bản ghi…") đọc số từ `purgePlan`.
- [x] Test cũ của hộp Dọn sạch / Nạp lại xanh: e2e đủ bộ (284 test) xanh ở local, gồm các ca hộp Dọn sạch của `trash.spec.ts` (D1, D5, D7, D13, chữ sai / chữ tách dấu, Escape và Hủy khi đang dọn) và các ca Nạp lại của `demo-data.spec.ts`, `backup.spec.ts`, `save-state.spec.ts`, `dialog-keyboard.spec.ts`, `team.spec.ts`, `settings-ai.spec.ts`, `customer-ai-web.spec.ts`; `demo-data.spec.ts` thêm: chữ "NẠP LẠI" dạng tách dấu (NFD) bật nút Nạp lại, như hộp Dọn sạch.
- [x] Hộp 8d: unit `policy-form.test.ts` (dời một ngày, dời hai ngày, sang năm khác; chữ của dòng); e2e `customer-policies.spec.ts` "edits the issued FYP (8d)…" có sẵn, nay chờ sáu dòng (hai dòng số HĐ) khi dời cả hai ngày sang tháng trước, rồi chỉ một dòng FYP khi dời về trong tháng cũ.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (18 mục "Trùng file"):

- L35 [T-297 #786] dấu `:` của `KycExtraction.tsx`: để lại, của T-297.
- L45 [T-296] slot `{count}` của `trash.customer.with`: **đã sửa** (mục 6).
- L63 [T-296] hộp 8d thiếu dòng số HĐ khi dời tháng: **đã sửa** (mục 8).
- L69 [T-296] câu E20 so chuỗi ngày (E7 luôn ngày sau): **đã sửa** (mục 7: câu đọc cờ, không còn phụ thuộc luật E7).
- L70 [T-296] thêm cờ cùng ngày vào params: **đã sửa** (mục 7).
- L76 [T-296] `PurgeDialog` chép khung hộp của `ReloadDialog`: **đã sửa** (mục 1).
- L77 [T-296] `useQuery(previewPurge)` chạy lại `keptRecords`: **đã sửa** (mục 2).
- L78 [T-296] `purgedNotice` nối câu bằng `.join(' ')`: **đã sửa** (mục 3).
- L93 [T-296] `policies.editLabel` thiếu trạng thái: **đã sửa** (mục 5).
- L94 [T-296] `restoreLabel` ghép tay: **đã sửa** (mục 4).
- L95 [T-296] chữ trạng thái HĐ viết lại nhiều nơi: **đã sửa** (mục 4).
- L98 [T-298 #787] `outcome.caseSizeRead`: để lại, của T-298.
- L105 [G7] ca nghiệm thu thư mục cấm tạo file: để lại, PR docs G7.
- L117 [T-297 #786] "20.000" của `aiPanel.web.refused.TOO_LONG`: để lại, của T-297.
- L120 [G7] ba lệch mockup chưa có dòng ở `nghiem-thu-v1.md`: để lại, PR docs G7.
- L127 [T-296] `DataSections` ép kiểu theo tham số: **đã sửa** (mục 9).
- L129 [G7] hai lệch có từ trước của hộp 10c: để lại, PR docs G7.
- L140 [T-301 #790] export không ai dùng (DR6-66 phần app), có `PLAIN_SLOTS`: để lại, của T-301 (PR này chỉ thêm `record` vào `PLAIN_SLOTS`).

#### Kích thước

Tổng diff 878 dòng, không tính khối codemap (SP +337 / −190, test kể cả e2e +295 / −47, tài liệu +5 / −4): vượt ngưỡng ~800, SP thêm dưới ~400. Lý do: Issue gom 11 mục sổ của 5 review (8 mục tiêu); 190 dòng SP xóa là hai khung hộp gõ chữ và câu ghép tay gom về một chỗ; test chấp nhận có 2 ca e2e mới và 2 ca unit dựng Thùng rác thật. Không tách: mục 1–3 cùng sửa hộp Dọn sạch, mục 4–5 cùng helper trạng thái HĐ, mục 7 cùng file `trash-view.ts`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] `pnpm e2e` đủ bộ (284 test) xanh ở local trên `907cef8`
- [x] Không thêm dependency ngoài ADR-0005
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-296 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #543, #634, #667, #710, #748, #825 — T-296 (#785, PR #833, `REVIEW: PASS` @`907cef8`):
  - #543 *Mysterious Name*, `apps/desktop/src/i18n/vi.ts` (`trash.customer.with`): slot `{kycNotes}` thay `{count}`; `kycNotes` vào `COUNT_SLOTS` của `apps/desktop/src/i18n/index.ts`, số có dấu ngăn nghìn (ca "1.204 lịch hẹn · 0 HĐ · 3.470 ghi chú KYC" ở `apps/desktop/src/routes/trash-view.test.ts`).
  - #634, `apps/desktop/src/routes/customers/policy-form.ts` (`monthEffects`, `effectText`): ngày nộp / phát hành sang tháng khác thì hộp 8d thêm dòng "tháng <cũ>: −1 HĐ nộp · tháng <mới>: +1 HĐ nộp" ("HĐ phát hành" với ngày phát hành) ngay sau các dòng FYP của chỉ số đó, theo mẫu "8d dời tháng" Owner duyệt G3 23/10 (T-284). Unit ở `apps/desktop/src/routes/customers/policy-form.test.ts`; e2e "edits the issued FYP (8d)…" của `e2e/customer-policies.spec.ts` dời cả hai ngày rồi dời về trong tháng cũ.
  - #667 *Primitive Obsession* (cả hai mục), `apps/desktop/src/routes/trash-view.ts` (`reasonSentence`): `checkTransition` (`packages/db/src/customers.ts`) thêm `sameDay: 1` vào params của `TRANSITION_BEFORE_LATEST` khi chuyển nhóm cùng ngày nhưng ghi sau (E20), mã lỗi không đổi; câu Thùng rác đọc cờ, không so `params.date` với `formatDate(row.date)`. Ca "E20: goes by the flag…"; đột biến đổi định dạng ngày ghi ở thân PR #833.
  - #710 *Duplicated Code*, `apps/desktop/src/routes/ConfirmWordDialog.tsx`: một hộp gõ chữ xác nhận cho Nạp lại (`apps/desktop/src/routes/Settings.tsx`) và Dọn sạch (`apps/desktop/src/routes/SettingsTrash.tsx`): so khớp NFC, chặn đóng / gửi khi đang chạy, cặp nút Hủy / xác nhận. e2e chữ NFD bật nút Nạp lại ở `e2e/demo-data.spec.ts`.
  - #710 hiệu năng, `apps/desktop/src/routes/SettingsTrash.tsx` (`PurgeDialog`): hộp nhận kế hoạch tính một lần lúc bấm mở, từ chính các dòng `listTrash` (`purgePlan`, bằng `previewPurge` theo test); không còn `useQuery(previewPurge)`, nên `keptRecords` không chạy lúc mở hộp hay trên DB đã dọn. Ca đếm lời gọi ở `apps/desktop/src/routes/trash-view.test.ts`.
  - #710 NIT, `apps/desktop/src/routes/trash-view.ts` (`purgedNotice`): trả `{ title, deleted, kept, backup }`, màn đặt các câu cạnh nhau trong JSX như Nạp lại; không còn `.join(' ')`.
  - #748, `apps/desktop/src/routes/customers/CustomerPolicies.tsx` (khóa `policies.editLabel` ở `apps/desktop/src/i18n/vi.ts`): tên nút "Sửa HĐ nộp {date} · {fyp} · {status}". e2e hai HĐ cùng ngày nộp, cùng FYP, khác trạng thái ở `e2e/customer-policies.spec.ts`.
  - #748, `apps/desktop/src/routes/trash-view.ts` (`restoreLabel`): tên nút dựng từ `recordTitle(row)`, HĐ cộng trạng thái; tên nút HĐ nay viết "HĐ Nộp …" như dòng đầu ô. e2e tên nút bằng chữ của ô ở `e2e/trash.spec.ts`. Phần KH (thiếu nhóm) ghi mới ở OPEN, review #833.
  - #748 *Duplicated Code*, `apps/desktop/src/routes/customers/policy-form.ts` (`policyStatusText`): một helper cho chữ trạng thái HĐ ở huy hiệu và tên nút Thùng rác, thẻ Hợp đồng, dòng dưới tiêu đề hộp 8d. Dòng "Trạng thái" của hộp khôi phục HĐ ghi mới ở OPEN, review #833.
  - #825 NIT, `apps/desktop/src/routes/Settings.tsx` (`DataSections`): bảng `DataNotices` `{ backup: BackupNotice; demo: Outcome }`, `noticeOf('backup')` tự suy kiểu; phép ép chỉ còn trong `noticeOf`.

---

# Issue #786 — T-297: KYC và AI: dòng thời gian theo mockup (bộ lọc, mã F), lỗi AI giữ khi đổi màn, hộp 3f, Cài đặt → AI

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **Dòng thời gian của hồ sơ KH theo mockup `customer.html`:**
   - bộ lọc Tất cả / KYC / Lịch hẹn;
   - mục cập nhật KYC gộp ghi chú với phiên bản, kèm dòng mã F và phiên bản ("+ F9, F12, F13 · kyc v3"), như ghi chú cuối `ai.html` muốn mã F "ở mọi nơi".

   Đây là lệch mockup đã biết; Owner 23/10 đưa vào đợt sửa.
2. **Lần chạy AI và hộp KYC:**
   - lần chạy AI kết thúc **lỗi** (vd. `AI_TIMEOUT`) khi RE ở màn khác: `AiJobs` giữ kết quả lỗi tới khi màn đọc, quay lại thấy câu §5.3;
   - `start` trên khóa còn job → `AI_BUSY`, không ghi đè;
   - hộp 3f (xác nhận dữ kiện AI đề xuất): preview `refused` báo ngay như hộp ghi chú KYC, không chỉ làm mất khung "Sau khi lưu".
3. **Trích xuất trên ghi chú KYC:**
   - khối đang chạy / đang hủy / lỗi + Thử lại dùng một component chung với panel;
   - nhãn "Ghi chú KYC" / "Ghi chú hệ thống" chọn theo `note.source`;
   - khuôn câu "AI đề xuất: <trường>: <giá trị>" vào `vi.ts`.
4. **Cài đặt → AI:**
   - dòng cảnh báo 1g mất khi chọn lại: bấm lại lựa chọn đang chọn cũng lưu khi cấu hình đã lưu hỏng; không thêm nút;
   - kết quả "Kết nối được" về idle khi đổi provider / gói / model;
   - dòng ChatGPT web của thẻ "Dữ liệu gửi đi" có phần đầu in đậm như mockup 4a;
   - e2e 1g phần "mất sau khi chọn lại".
5. **Nhỏ:**
   - cặp state `[opened, setWeb]` đổi tên khớp nhau;
   - test KYC viết escape thay ký tự vô hình thô;
   - `parseVnd(text)` không chuẩn hóa hai lần;
   - đích focus của 7d dùng ref thay `getElementById` (đưa lại từ ACCEPTED, Owner 23/10).
6. **Panel mờ:** khung "Thông tin tham khảo" không còn hai lớp viền đứt lồng nhau, theo mockup Owner duyệt ở T-284 (G3).

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Owner cũng đưa lệch mockup "bộ lọc dòng thời gian" vào đợt sửa.

Issue này gom các mục OPEN gắn **[T-297]**:
- `use-ai-job` / `ai-jobs` (#468); hộp 3f và trích xuất (#469);
- Cài đặt → AI (#444, #452); mã F trên dòng thời gian (#462);
- `[opened, setWeb]` (#628); viền đứt (#632);
- escape (#669); `parseVnd` (#738);
- `getElementById` (#693) đưa lại từ ACCEPTED;
- mục mới "bộ lọc dòng thời gian".

`customer.html` đã vẽ bộ lọc và mã F: không cần G3. Chỉ mục 6 chờ T-284.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-297]
- `docs/design/mockups/customer.html` (Dòng thời gian); `docs/design/mockups/ai.html` (1a, 1g, 2h, 3f, 4a, ghi chú cuối về mã F); `docs/design/phase-5-ai.md` §5.3, §8, §9.1, §9.3
- `apps/desktop/src/routes/customers/{CustomerKyc.tsx,KycDialogs.tsx,KycExtraction.tsx,KycIntelligence.tsx,CustomerProfile.tsx,use-ai-job.ts,kyc-view.ts,kyc-view.test.ts}`
- `apps/desktop/src/data/ai-jobs.ts`; `apps/desktop/src/routes/{SettingsAi.tsx,settings-ai-view.ts}`
- `e2e/{customer-kyc.spec.ts,customer-ai.spec.ts,customer-ai-web.spec.ts,settings-ai.spec.ts}`

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/customers/{CustomerKyc.tsx,KycDialogs.tsx,KycExtraction.tsx,KycIntelligence.tsx,KycHistory.tsx,CustomerProfile.tsx,use-ai-job.ts,kyc-view.ts,ai-panel-view.ts}` + test
- `apps/desktop/src/data/ai-jobs.ts` + test
- `apps/desktop/src/routes/{SettingsAi.tsx,settings-ai-view.ts}` + test
- `apps/desktop/src/i18n/vi.ts`
- `e2e/{customer-kyc.spec.ts,customer-ai.spec.ts,customer-ai-web.spec.ts,settings-ai.spec.ts,support.ts}`
- `docs/user-guide/{05-ho-so-kh.md,06-ai.md,09-cai-dat.md}`, `docs/testing/nghiem-thu-v1.md` (bỏ dòng lệch "Dòng thời gian" và "Cài đặt → AI 1g")

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-297]**: gộp. Mục khác trùng file (T-298 hồ sơ KH / helper badge, T-301 ký hiệu DR6-37 ở dòng thời gian) để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Lệnh KYC / AI của `db` / `ai` không đổi.
- Câu lỗi AI theo bảng §5.3 hiện có.
- Mã F lấy từ dữ kiện đã xác nhận của phiên bản (`F{seq}`), như danh sách dữ kiện.

##### Test chấp nhận

- [ ] e2e:
  - bộ lọc dòng thời gian ẩn / hiện đúng loại mục;
  - mục KYC hiện "+ F… · kyc vN" khớp danh sách dữ kiện.
- [ ] Unit: `AiJobs` giữ lỗi khi component đã rời; quay lại thấy câu lỗi; `start` lặp khóa → `AI_BUSY`.
- [ ] e2e 3f: giá trị "ba" cho Số con báo ngay, trước khi bấm Xác nhận.
- [ ] e2e 1g: cấu hình hỏng → chọn lại → dòng 1g mất, cấu hình được lưu.
- [ ] e2e: "Kết nối được" mất khi đổi model.
- [ ] Sau T-284: panel mờ chỉ một lớp viền đứt.

Ước lượng: ≈ 260 dòng SP + ≈ 250 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-297] đã sửa sang RESOLVED

##### Rủi ro

risk:med

##### Bị chặn bởi

#773 (T-284), #785 (T-296)

## PR #835 — feat: KYC timeline as the mockup, AI failures kept for a screen shown again, Settings → AI fixes (T-297)

Trạng thái: MERGED · merge 2026-10-25T15:09:12Z · commit `f5fa622987c346c64d738ebbfc37ca2b9b88e8fa` · nhánh `task/T-297-kyc-ai-timeline` · nhãn: type:task, risk:med

Closes #786

#### Thay đổi

1. **Dòng thời gian theo `customer.html`** (mục 1; L41, L140):
   - Nút **Tất cả / KYC / Lịch hẹn** (`Segmented` "Lọc dòng thời gian") ở đầu thẻ. KYC = ghi chú và phiên bản KYC; Lịch hẹn = lịch hẹn; chuyển nhóm không thuộc nhãn nào trong hai nhãn này nên chỉ hiện ở Tất cả (nghĩa thường của nhãn). Lọc không còn mục nào → "Không có mục nào.". Mục ngoài bộ lọc chỉ bị ẩn, không bị gỡ, nên ghi chú giữ kết quả AI trích xuất (mục 8).
   - **Mục cập nhật KYC gộp ghi chú với phiên bản:** ghi chú mà dữ kiện của nó ghi phiên bản ngay trong ngày ghi chú thành một mục: "Cập nhật KYC dd/mm/yyyy" (+ "thay đổi quan trọng" khi có), nút AI trích xuất (ghi chú do RE ghi), chữ ghi chú, rồi mỗi phiên bản một dòng "+ F3, F4 · kyc v2" (mã `F{seq}` như thẻ Dữ kiện KYC). Seed lưu từng dữ kiện một (`confirmKycFact`), nên một ghi chú seed thường có vài dòng.
   - Phiên bản không gắn với ghi chú của ngày nó (giải quyết mâu thuẫn; xác nhận 3f hôm nay cho ghi chú cũ) đứng riêng: "Cập nhật KYC <ngày>" + "+ F… · kyc vN", hoặc "kyc vN" khi không có dữ kiện. Ghi chú không có phiên bản: "Ghi chú KYC" / "Ghi chú hệ thống" như cũ.
   - Thứ tự trong một ngày: chuyển nhóm vẫn trước KYC. Giữa các mục KYC: theo thứ tự lưu (`created_at`, mục 8). Ghi chú hay phiên bản đứng riêng nằm ở chỗ nó được lưu; mục cập nhật nằm ở chỗ phiên bản cuối của nó. Trước đây: mọi phiên bản đứng trên mọi ghi chú cùng ngày.
   - **Hàm đọc mới ở `db`** (ngoài danh sách file; anh duyệt trong phiên 25/10): `listKycVersionFacts(db, customerId)` trả id các dữ kiện mỗi phiên bản ghi, ghép theo `created_at` (một lệnh lưu dữ kiện mới và phiên bản cùng một `at` trong `save`). Không đổi lệnh, không đổi schema / migration. Hai phiên bản cùng một thời điểm (đồng hồ đứng yên) → không ghép dữ kiện nào. Đã thử trên dữ liệu giả lập (DEMO_SEED 1, neo 15/09/2026): 9 726 phiên bản, không hai phiên bản nào trùng `created_at`; dữ kiện của một phiên bản luôn cùng một ghi chú và cùng ngày; 148 phiên bản không có dữ kiện (giải quyết mâu thuẫn). Cách chỉ theo ngày không chia được phiên bản ở ≈ 42% số ngày có KYC của seed (phần lớn là ngày tạo KH: ghi chú hệ thống + ghi chú đầu tiên). Sửa thêm `packages/db/src/index.ts` (export), `packages/db/CLAUDE.md` (khối codemap sinh tự động). Sau review có thêm hàm đọc thứ hai, `listKycRecordingOrder` (mục 8).
   - Chữ của mỗi ghi chú trên dòng thời gian nằm trong một `blockquote` (đích focus của DR6-20 chuyển vào đó). `e2e/customer-forms.spec.ts` (ngoài danh sách; anh duyệt): ca 5f đếm ghi chú KYC theo `blockquote` thay nhãn "Ghi chú KYC / hệ thống", vì mục gộp nay mang nhãn "Cập nhật KYC".
2. **Lần chạy AI và hộp 3f** (mục 2; L29, L30, L32):
   - `AiJobs.start` thêm tham số `keep`. Kết quả `keep` nhận (`useAiJob`: lỗi `error` / `failed` / `invalid`) được giữ tới khi một màn hiện nó (`kept`, `drop`): quay lại hồ sơ thấy câu §5.3 + Thử lại một lần. Lần chạy mới của khóa bỏ nó; Hủy không giữ gì.
   - `start` trên khóa còn job (đang chạy hoặc đang hủy) → `AI_BUSY`: job không chạy, entry giữ nguyên ("Đang hủy…" không mất).
   - `useAiJob` đọc lỗi đã giữ bằng `useSyncExternalStore`, chép vào state lúc render (mẫu điều chỉnh state khi render; luật `react-hooks/set-state-in-effect` chặn setState trong effect); effect chỉ `drop`.
   - Hộp 3f: preview `refused` báo ngay dưới ô (`refusalText` ở `kyc-view.ts`): giá trị trường không nhận → câu lỗi của lệnh (vd. "ba" cho Số con → `INVALID_KYC_VALUE`); còn lại câu `kycNote.error.refused` của 7a. Đang báo thì Xác nhận dữ kiện không chạy lệnh.
3. **Trích xuất trên ghi chú KYC** (mục 3; L33, L34, L35):
   - `AiRunStatus` (`KycIntelligence.tsx`): đang chạy + Hủy / đang hủy / lỗi + Thử lại, panel và ghi chú dùng chung. `RetryAlert` dùng cả cho lỗi mở ChatGPT web của panel; `BusyLine` thôi export.
   - Nhãn "Ghi chú KYC" / "Ghi chú hệ thống" chọn theo `note.source`.
   - `extraction.proposed` = "AI đề xuất: {field}: {value}", trường in đậm; khuôn được tách trước khi điền giá trị.
4. **Cài đặt → AI** (mục 4; L37–L40):
   - 1g: khi cấu hình đã lưu hỏng, bấm lại lựa chọn Provider đang chọn cũng lưu. Radio đang chọn không phát change, nên khối bọc nghe click, và phím Space (Edge không phát click khi nhấn Space trên radio đang chọn; đã thử trên bản web). Không thêm nút.
   - "Kết nối được": `checkNow` ở `settings-ai-view.ts`; kết quả chỉ hiện khi provider / gói / model còn như lúc kiểm, đổi thì về idle hẳn (chọn lại như cũ cũng không hiện lại). Mức suy luận không tính.
   - Dòng ChatGPT web của thẻ "Dữ liệu gửi đi": phần đầu in đậm (`settingsAi.sentChatgptLead`).
5. **Nhỏ** (mục 5; L56, L65, L73, L138; và hai mục sổ gắn [T-297] sau khi viết Issue, L104, L118):
   - `[opened, setWeb]` → `[kept, setKept]`.
   - `kyc-view.test.ts`: `\u200B`, `\uFEFF`, `\u2060` viết escape.
   - `kycAmountRead`: `parseVnd(text)`.
   - 7d: `KycCard` nhận `heading` (ref) như `CustomerPolicies`; `DialogFocusFallback` dùng ref.
   - `aiPanel.web.refused.TOO_LONG` có `{count}`, `KycWebSession.tsx` truyền `MAX_AI_RAW_OUTPUT` (ngoài danh sách; anh duyệt, một dòng).
   - `ai-panel-view.test.ts`: thêm REJECTED có lần cuối `[NO_JSON]`, `output` null → `outputTooLarge` false.
6. **Panel mờ** (mục 6; L60): khung "Thông tin tham khảo" viền liền `--border` khi mờ (thẻ bên trong viền đứt), viền đứt khi không mờ, theo 2h (T-284).
7. **Tài liệu:** `docs/user-guide/05-ho-so-kh.md` (Dòng thời gian), `06-ai.md` (lỗi khi rời màn, 3f báo ngay), `09-cai-dat.md` (1g, Kiểm tra kết nối); `docs/testing/nghiem-thu-v1.md`: bỏ hai dòng lệch "Dòng thời gian" và "Cài đặt → AI 1g"; NT-HS-04, NT-HS-11, NT-AI-18, NT-CA-09 theo hành vi mới.
8. **Sửa theo review `0ae8cf6` (REVIEW: CHANGES)**, commit `5b266e3`:
   - [chặn] Bộ lọc gỡ `NoteEvent` khỏi cây, nên chọn Lịch hẹn làm mất đề xuất AI trích xuất (state của component):
     - `Timeline` (`CustomerKyc.tsx`) nay render mọi mục. Mục ngoài bộ lọc mang thuộc tính `hidden`: preflight Tailwind 4 đặt `display: none !important`, nên mục ra khỏi bố cục và cây trợ năng. "Không có mục nào." vẫn đếm theo bộ lọc.
     - e2e mới `customer-ai.spec.ts` "the timeline filter hides a note, what its AI trích xuất found stays (review of PR 835)": đề xuất còn sau Lịch hẹn → Tất cả; lần chạy kết thúc lúc ghi chú đang ẩn vẫn hiện đề xuất khi hiện lại; câu lỗi đã hiện còn sau khi đổi qua lại.
     - Ca này đỏ trên `0ae8cf6`: danh sách đề xuất rỗng sau Lịch hẹn → Tất cả.
   - [không chặn] Ghi chú và phiên bản cùng ngày xếp theo `created_at`, như review đề xuất:
     - `db`: hàm đọc thứ hai `listKycRecordingOrder(db, customerId)` trả id ghi chú và phiên bản theo thứ tự lưu (`created_at`). Cùng một thời điểm thì ghi chú trước, vì một lệnh lưu ghi chú trước phiên bản; rồi theo `seq`. Không đổi lệnh, schema. Nằm trong các file `db` anh đã duyệt (`kyc.ts`, `kyc.test.ts`, `index.ts`, `CLAUDE.md`).
     - `kycEvents`: ghi chú hay phiên bản đứng riêng nằm ở chỗ nó được lưu; mục cập nhật nằm ở chỗ phiên bản cuối của nó (như trước, theo `seq` phiên bản). Ca của review (cùng ngày: `v2` giải quyết mâu thuẫn hoặc xác nhận 3f, rồi `n9` không dữ kiện) nay ra `[n9, v2, n1 + v1]`. Ca mới đỏ trước khi sửa. Tên ca "on one day KYC in recording order" nay đúng như tên.
     - Khác head cũ một ca: ghi chú đứng riêng lưu *giữa* hai phiên bản của một mục cập nhật cùng ngày (3f xác nhận sau ghi chú đó) nay đứng dưới mục cập nhật, vì mục nằm ở chỗ phiên bản cuối (có test).
     - `packages/db/CLAUDE.md` ở `0ae8cf6` dài 7 996 / 8 000 ký tự. Thêm một export làm file vượt trần, và `pnpm codemap` thu bản đồ export thành danh sách file. Em rút hai dòng chữ mà bản đồ đã nói lại: bỏ `openDatabase` ở dòng "Mở DB", bỏ tiền tố `src/` lặp ở dòng "Lệnh theo thực thể". Nay 7 984 / 8 000, bản đồ đủ export. Export kế tiếp của `db` sẽ phải rút chữ tiếp.
   - [không chặn] `ai-jobs.test.ts`: ca "keeps nothing else…" thêm một job bỏ qua tín hiệu Hủy rồi kết thúc `'failed'`, kiểm `kept` rỗng. Đã thử bỏ điều kiện `jobs.get(key) === entry` (`ai-jobs.ts:86`): ca đỏ.
   - [không chặn, NIT] `KycExtraction.tsx`: khối bọc `blockquote` đổi `span` → `div`.
   - Để lại, như review ghi: ba lệch mockup `customer.html` chưa có dòng ở `nghiem-thu-v1.md` → PR docs nghiệm thu **[G7]**; cỡ PR → bảng "Kích thước PR vượt ngưỡng" của `phase-6.md` **[G7]**.

**File ngoài danh sách của Issue** (P-2; anh duyệt trong phiên 25/10, trước khi sửa: hàm đọc ở `db` kèm test và codemap, `KycWebSession.tsx`, `customer-forms.spec.ts`):

- `packages/db/src/kyc.ts`, `packages/db/src/kyc.test.ts`: hàm đọc `listKycVersionFacts` (mục 1); sau review thêm `listKycRecordingOrder` (mục 8).
- `packages/db/src/index.ts`: mỗi hàm một dòng export (danh sách export của `@p2c/db` viết tay). `packages/db/CLAUDE.md`: một dòng của khối codemap sinh tự động; sau review, thêm hai dòng chữ rút gọn để bản đồ export còn dưới 8 000 ký tự (mục 8).
- `apps/desktop/src/routes/customers/KycWebSession.tsx`: một dòng, truyền `MAX_AI_RAW_OUTPUT` cho câu TOO_LONG (mục 5).
- `e2e/customer-forms.spec.ts`: ca 5f đếm ghi chú theo `blockquote` (mục 1).

**Lệch mockup còn lại (`customer.html`), không đổi trong PR này:** mục v1 của mockup "KYC lần đầu · N4 → N3" gộp cả chuyển nhóm, app để chuyển nhóm là mục riêng như cũ; app không có mã ghi chú (N-0914); nút AI trích xuất xuống dòng khi đầu mục có nhãn "thay đổi quan trọng" và cột hẹp (mockup đặt bên phải).

#### Test chấp nhận

- [x] e2e bộ lọc ẩn / hiện đúng loại mục: `customer-kyc.spec.ts` "the timeline filter keeps to the KYC or the appointments, "Tất cả" shows everything" (mới). Sau review: `customer-ai.spec.ts` "the timeline filter hides a note, what its AI trích xuất found stays (review of PR 835)" (mới, mục 8).
- [x] e2e mục KYC hiện "+ F… · kyc vN" khớp danh sách dữ kiện: `customer-kyc.spec.ts` "a new customer…" ("+ F1, F2 · kyc v1", rồi "+ F3 · kyc v2") và "a KYC note confirms facts…" ("+ F3, F4, F5 · kyc v2"; ba mã đọc lại ở thẻ Dữ kiện KYC).
- [x] Unit `AiJobs`: `ai-jobs.test.ts` giữ lỗi khi màn đã rời và bỏ sau khi hiện, không giữ kết quả khác hay lần đã hủy (kể cả job bỏ qua Hủy rồi lỗi), lần chạy mới bỏ lỗi cũ, `start` lặp khóa → `AI_BUSY`. e2e `customer-ai.spec.ts` "a run that fails while the profile is left says its error once shown again" (mới): `AI_TIMEOUT` khi đang ở Cài đặt → AI, quay lại thấy câu + Thử lại.
- [x] e2e 3f: `customer-ai.spec.ts` (ca AI trích xuất với Mock) gõ "ba" cho Số con → báo ngay, khung "Sau khi lưu" mất; gõ 3 → hết báo.
- [x] e2e 1g: `settings-ai.spec.ts` (ca nhập backup có model `deepseek-v4-pro`) bấm lại Mock → dòng 1g mất; xuất backup → dòng `ai` là mặc định; nhập lại cấu hình hỏng, Space trên Mock → dòng mất.
- [x] e2e "Kết nối được" mất khi đổi model: `settings-ai.spec.ts` "exe: the outcome of Kiểm tra kết nối goes once the provider, gói or model changes" (mới); đổi mức suy luận giữ kết quả.
- [x] Panel mờ chỉ một lớp viền đứt: `customer-ai.spec.ts` "analysis with the Mock…" kiểm `border-top-style` của khung và thẻ khi CURRENT và khi STALE.
- Unit khác: `kyc-view.test.ts` (`kycTimeline` gộp / đứng riêng / thứ tự trong ngày theo thứ tự lưu / bộ lọc, `refusalText`), `packages/db/src/kyc.test.ts` (`listKycVersionFacts`: ghép theo lệnh, giải quyết mâu thuẫn rỗng, đồng hồ đứng yên rỗng, KH đã xóa; `listKycRecordingOrder`: xen ghi chú và phiên bản theo lúc lưu, cùng thời điểm thì ghi chú trước, KH đã xóa), `settings-ai-view.test.ts` (`checkNow`), `ai-panel-view.test.ts` (câu TOO_LONG, ca `[NO_JSON]`).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (30 mục "Trùng file"):

- L17 [T-298 #787] dòng "Sau khi lưu" 5d thiếu "· hạ nhóm / lên nhóm": để lại, của T-298.
- L29 [T-297] kết quả lỗi nằm trong component: **đã sửa** (mục 2).
- L30 [T-297] `start` ghi đè job cùng khóa: **đã sửa** (mục 2).
- L32 [T-297] 3f preview `refused` báo muộn: **đã sửa** (mục 2).
- L33 [T-297] khối đang chạy / đang hủy / lỗi lặp markup: **đã sửa** (mục 3).
- L34 [T-297] nhãn ghi chú theo nút: **đã sửa** (mục 3).
- L35 [T-297] dấu `:` của "AI đề xuất" trong JSX: **đã sửa** (mục 3).
- L37 [T-297] 1g khó xóa khi ở Mock: **đã sửa** (mục 4).
- L38 [T-297] "Kết nối được" còn sau khi đổi: **đã sửa** (mục 4).
- L39 [T-297] dòng ChatGPT web thiếu phần đầu in đậm: **đã sửa** (mục 4).
- L40 [T-297] e2e 1g "mất sau khi chọn lại": **đã sửa** (e2e trên bản web, chung đường code với exe).
- L41 [T-297] mã F trên dòng thời gian: **đã sửa** (mục 1).
- L56 [T-297] `[opened, setWeb]`: **đã sửa** (mục 5).
- L60 [T-297] hai lớp viền đứt khi mờ: **đã sửa** (mục 6).
- L63 [T-298 #787] `stageSince` của hồ sơ KH: để lại, của T-298.
- L65 [T-297] ký tự vô hình thô trong test: **đã sửa** (mục 5).
- L73 [T-297] `parseVnd(normalizeText(text))`: **đã sửa** (mục 5).
- L85 [T-298 #787] `hint` ô Case size (`MetFields.tsx`): để lại, của T-298.
- L89 [T-300 #789] thẻ đưa lên đỉnh ở màn có bộ chọn phạm vi (`index.css`): để lại, của T-300.
- L92 [G7] ca nghiệm thu NT-DB-18 / NT-DB-20: để lại, PR docs G7.
- L104 [T-297] "20.000" viết thẳng ở câu TOO_LONG: **đã sửa** (mục 5).
- L107 [G7] ba lệch 10d chưa có dòng: để lại, PR docs G7.
- L115 [G7] hai lệch của hộp 10c: để lại, PR docs G7.
- L118 [T-297] ca `[NO_JSON]` lần cuối: **đã sửa** (mục 5).
- L126 [T-301 #790] dòng "Trạng thái" của `restoreView` lặp: để lại, của T-301.
- L129 [G7] hộp 8d không in đậm số tiền: để lại, PR docs G7.
- L132 [T-301 #790] DR6-37 ký hiệu viết cứng trong JSX: để lại, của T-301 (chỗ mới của PR này dùng `joinParts` / `sep.list`).
- L134 [T-301 #790] export không ai import (phần app): để lại, của T-301.
- L138 [T-297] đích focus 7d bằng `getElementById`: **đã sửa** (mục 5).
- L140 [T-297] lệch mockup dòng thời gian: **đã sửa** (mục 1).

#### Kích thước

Tổng diff ≈ 1 580 dòng không tính khối codemap (SP +567 / −186, test kể cả e2e +728 / −68, tài liệu +12 / −13, chữ của `packages/db/CLAUDE.md` +2 / −2): vượt ngưỡng ~800 tổng / ~400 SP.

- Trước review ≈ 1 350. Vòng sửa (mục 8) thêm ≈ 290: SP +64 / −18, test +191 / −16 (e2e mới +54, `kyc-view` +53, `db` +70 / −15, `ai-jobs` +14 / −1).
- Lý do: Issue gom 19 mục sổ (6 mục tiêu) và thêm hàm đọc `db` anh duyệt trong phiên; dòng thời gian đổi cách dựng mục (kyc-view +108 / −27, test 6 ca mới); Prettier xếp dọc props của các component mới (`AiRunStatus`, `RetryAlert`, `UpdateHead`).
- Không tách: mục 1, 3 cùng sửa `NoteEvent` / `CustomerKyc.tsx`; mục 2, 3 cùng sửa `KycIntelligence.tsx` / `use-ai-job.ts`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (3 931 unit test)
- [x] `pnpm e2e` đủ bộ (288 test) xanh ở local trên `5b266e3`
- [x] Không thêm dependency ngoài ADR-0005
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-297 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #444, #462, #468, #469, #628, #632, #669, #693, #738, #812, #828 và lệch mockup dòng thời gian — T-297 (#786, PR #835, `REVIEW: PASS` @`5b266e3`):
  - #468, `apps/desktop/src/data/ai-jobs.ts`, `apps/desktop/src/routes/customers/use-ai-job.ts`: `AiJobs.start` nhận `keep`; lần chạy kết thúc lỗi (`error` / `failed` / `invalid`) trong lúc màn đã rời được giữ (`kept`) tới khi màn hiện nó rồi `drop`, nên quay lại hồ sơ thấy câu §5.3 + Thử lại một lần; lần chạy mới của khóa bỏ nó, Hủy không giữ gì. Unit ở `apps/desktop/src/data/ai-jobs.test.ts`; e2e "a run that fails while the profile is left…" ở `e2e/customer-ai.spec.ts`.
  - #468, `apps/desktop/src/data/ai-jobs.ts` (`start`): khóa còn job (đang chạy hay đang hủy) → `AI_BUSY`, job không chạy, entry giữ nguyên nên "Đang hủy…" không mất. Unit ở `apps/desktop/src/data/ai-jobs.test.ts`.
  - #469, `apps/desktop/src/routes/customers/KycDialogs.tsx` (`ConfirmFactDialog`, 3f): preview `refused` báo ngay dưới ô bằng `refusalText` (`apps/desktop/src/routes/customers/kyc-view.ts`): giá trị trường không nhận → câu lỗi của lệnh (vd. "ba" cho Số con → `INVALID_KYC_VALUE`), còn lại `kycNote.error.refused` như 7a; đang báo thì Xác nhận dữ kiện không chạy lệnh. e2e ở `e2e/customer-ai.spec.ts`.
  - #469 *Duplicated Code*, `apps/desktop/src/routes/customers/KycIntelligence.tsx` (`AiRunStatus`, `RetryAlert`): khối đang chạy + Hủy / đang hủy / lỗi + Thử lại dùng chung cho panel và ghi chú của `apps/desktop/src/routes/customers/KycExtraction.tsx`; `RetryAlert` dùng cả cho lỗi mở ChatGPT web của panel.
  - #469, `apps/desktop/src/routes/customers/KycExtraction.tsx`: nhãn "Ghi chú KYC" / "Ghi chú hệ thống" chọn theo `note.source`, không theo việc có nút trích xuất.
  - #469 NIT, `apps/desktop/src/i18n/vi.ts` (`extraction.proposed`): cả khuôn "AI đề xuất: {field}: {value}" ở `vi.ts`; `Proposed` của `apps/desktop/src/routes/customers/KycExtraction.tsx` in đậm trường và điền giá trị sau khi tách khuôn.
  - #444, `apps/desktop/src/routes/SettingsAi.tsx` (1g): khi cấu hình đã lưu hỏng, bấm lại lựa chọn Provider đang chọn cũng lưu. Khối bọc nghe click và phím Space, vì radio đang chọn không phát change và Edge không phát click khi nhấn Space trên nó. Không thêm nút.
  - #444, `apps/desktop/src/routes/SettingsAi.tsx` (`ConnectionCard`): kết quả Kiểm tra kết nối chỉ hiện khi provider / gói / model còn như lúc kiểm (`checkNow` của `apps/desktop/src/routes/settings-ai-view.ts`); đổi thì về idle hẳn, chọn lại như cũ cũng không hiện lại, mức suy luận không tính. Unit ở `apps/desktop/src/routes/settings-ai-view.test.ts`, e2e ở `e2e/settings-ai.spec.ts`.
  - #444, `apps/desktop/src/routes/SettingsAi.tsx` (thẻ "Dữ liệu gửi đi"): dòng ChatGPT web có phần đầu in đậm (`settingsAi.sentChatgptLead` ở `apps/desktop/src/i18n/vi.ts`); e2e "web mode" kiểm `font-weight` của hai phần đầu ở `e2e/settings-ai.spec.ts`.
  - #444 (e2e 1g), `e2e/settings-ai.spec.ts`: sau khi nhập backup có model `deepseek-v4-pro`, bấm lại Mock → dòng 1g mất và backup xuất ra có dòng `ai` là mặc định; nhập lại, Space trên Mock → dòng mất. Chạy trên bản web, chung đường code với exe.
  - #462 và lệch mockup dòng thời gian (hai mục), `apps/desktop/src/routes/customers/CustomerKyc.tsx` (`Timeline`): nút Tất cả / KYC / Lịch hẹn (chuyển nhóm chỉ ở Tất cả; mục ngoài bộ lọc chỉ bị ẩn, nên ghi chú giữ kết quả AI trích xuất); mục "Cập nhật KYC dd/mm/yyyy" gộp ghi chú với các phiên bản mà dữ kiện của nó ghi trong ngày ghi chú, mỗi phiên bản một dòng "+ F3, F4 · kyc v2"; trong một ngày, KYC theo thứ tự lưu. Logic ở `kycEvents` của `apps/desktop/src/routes/customers/kyc-view.ts`; hai hàm đọc mới `listKycVersionFacts`, `listKycRecordingOrder` ở `packages/db/src/kyc.ts`. Dòng lệch "Dòng thời gian" của `docs/testing/nghiem-thu-v1.md` đã bỏ; ba lệch nhỏ còn lại ghi mới ở OPEN (review #835).
  - #628 *Mysterious Name*, `apps/desktop/src/routes/customers/KycIntelligence.tsx`: `[opened, setWeb]` đổi thành `[kept, setKept]`.
  - #632, `apps/desktop/src/routes/customers/KycIntelligence.tsx` (`Analysis`): khi mờ, khung "Thông tin tham khảo" viền liền `--border`, thẻ bên trong viền đứt; khi không mờ, khung viền đứt như customer.html (mockup ai.html 2h, T-284). e2e "analysis with the Mock…" kiểm `border-top-style` của khung và thẻ ở `e2e/customer-ai.spec.ts`.
  - #669 NIT, `apps/desktop/src/routes/customers/kyc-view.test.ts`: U+200B, U+FEFF, U+2060 trong ca `kycAmountRead` viết bằng escape.
  - #693 NIT, `apps/desktop/src/routes/customers/CustomerProfile.tsx`: đích focus của 7d là ref của tiêu đề thẻ Dữ kiện KYC (`KycCard` nhận `heading`, ở `apps/desktop/src/routes/customers/CustomerKyc.tsx`), không còn `getElementById`.
  - #738, `apps/desktop/src/routes/customers/kyc-view.ts` (`kycAmountRead`): `parseVnd(text)`, chỉ chuẩn hóa một lần, trong `parseVnd`.
  - #812, `apps/desktop/src/i18n/vi.ts` (`aiPanel.web.refused.TOO_LONG`): câu nhận `{count}`; `apps/desktop/src/routes/customers/KycWebSession.tsx` truyền `MAX_AI_RAW_OUTPUT` của `@p2c/ai`, số đọc qua `formatCount` ("20.000"). Ca ở `apps/desktop/src/routes/customers/ai-panel-view.test.ts`.
  - #828, `apps/desktop/src/routes/customers/ai-panel-view.test.ts` (`rejectedReport`): thêm dòng REJECTED có lần cuối `[NO_JSON]`, `output` null → `outputTooLarge` false.
  - Ba ghi chú không chặn của vòng `REVIEW: CHANGES` @`0ae8cf6` đã làm trong PR #835: ghi chú và phiên bản đứng riêng cùng ngày xếp theo lúc lưu (`listKycRecordingOrder` ở `packages/db/src/kyc.ts`); ca job bỏ qua Hủy rồi kết thúc `'failed'` không được giữ, ở `apps/desktop/src/data/ai-jobs.test.ts`; chữ ghi chú (`blockquote`) nằm trong `div`, không trong `span` (`apps/desktop/src/routes/customers/KycExtraction.tsx`).

---

# Issue #787 — T-298: Hồ sơ KH và Lịch hẹn: hộp 5d, 6a / 6h, 6d, thẻ Lịch hẹn, ô ngoài tháng, focus khung Chi tiết

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **Hộp 5d và hồ sơ KH (#141):**
   - dòng "Sau khi lưu: N2 → N3" có "· hạ nhóm / lên nhóm" như mockup 5d;
   - khối "Chuyển tay không bao giờ tính RF" không hiện khi KH đã đóng;
   - câu `error.INVALID_TRANSITION` nói đúng cả khi KH đã đóng lẫn khi trùng nhóm hiện tại;
   - `!isPipelineStage` thay `CLOSED_STAGES.includes`;
   - một helper badge nhóm thay ba helper riêng và chỗ dựng `StageBadge` tay ở đầu hồ sơ.
2. **Lịch hẹn trong hồ sơ và hộp lịch hẹn:**
   - #163: "Các lần hẹn trước" của 6a hiện nhóm trước → sau bằng badge; hộp 6h không có khối này (theo mockup 6a / 6h);
   - #165: thẻ Lịch hẹn của hồ sơ tô "RF" màu accent, năm khác xuống dòng giờ;
   - ở 1 440, ô Ngày và nút "Hẹn tiếp" không gãy hai dòng (như mockup).
3. **Hộp 6d, ô Case size dự kiến:**
   - có câu help dưới ô như mockup (lệch mockup đã biết, Owner 23/10 đưa vào đợt sửa);
   - dòng đọc lại không lặp phần trong ngoặc khi số dưới 1 triệu.
4. **Lịch tháng:** ô ngoài tháng / ngoài khoảng vẫn cho trình đọc màn hình biết số lịch ngày đó (không `aria-hidden` cả ô).
5. **Khung Chi tiết của màn Lịch hẹn:** chuyển sang lịch khác thì hàng nút khóa theo lịch. Focus không nằm ở nút của lịch cũ; tiêu đề mới được đọc.
6. **Test:**
   - `stageSince` của hồ sơ (dòng "từ …" và hộp 5d) có unit test: tách phần tính ra hàm thuần, không thêm thư viện DOM (G4: không);
   - e2e 6f ca E19 kiểm huy hiệu N3 cạnh "Nhóm sau cuộc gặp".

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Owner cũng đưa lệch mockup "câu help Case size 6d" vào đợt sửa.

Issue này gom các mục OPEN gắn **[T-298]**:
- Khách hàng #141;
- Lịch hẹn #163 / #165; thẻ Lịch hẹn 1 440 (#746);
- case size (#758); ô ngoài tháng (#156);
- khung Chi tiết (#693); `stageSince` (#644); e2e 6f (#748);
- mục mới "câu help Case size 6d".

Mockup 5d, 6a, 6h, 6d, `customer.html` đã duyệt: không cần G3.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-298]
- `docs/design/mockups/appointment-forms.html` (6a, 6d, 6h); `docs/design/mockups/customer.html` (thẻ Lịch hẹn); mockup hộp 5d; `docs/design/mockups/appointments.html` (lịch tháng, khung Chi tiết)
- `apps/desktop/src/routes/customers/{CustomerDialogs.tsx,CustomerProfile.tsx,CustomerAppointments.tsx,CustomerKyc.tsx,customers-view.ts}`
- `apps/desktop/src/routes/appointments/{AppointmentDialog.tsx,AppointmentsScreen.tsx,MetFields.tsx,appointments-view.ts,appointment-form.ts}`
- `apps/desktop/src/routes/customers/kyc-view.ts` (`kycAmountRead`, mẫu `compact === amount`)

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/customers/{CustomerDialogs.tsx,CustomerProfile.tsx,CustomerAppointments.tsx,CustomerKyc.tsx,customers-view.ts}` + test
- `apps/desktop/src/routes/appointments/{AppointmentDialog.tsx,AppointmentsScreen.tsx,MetFields.tsx,appointments-view.ts,appointment-form.ts}` + test
- `apps/desktop/src/i18n/vi.ts`
- `e2e/{customer-forms.spec.ts,customer-appointments.spec.ts,appointments.spec.ts,appointment-outcome.spec.ts,support.ts}`
- `docs/user-guide/{03-lich-hen.md,05-ho-so-kh.md}`, `docs/testing/nghiem-thu-v1.md` (bỏ dòng lệch 5d, 6a / 6h, 6d)

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-298]**: gộp. Mục khác trùng file (T-297 dòng thời gian, T-301 ký hiệu DR6-37 ở `CustomerKyc.tsx` / `AppointmentDialog.tsx`) để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Lệnh `db` không đổi.
- Badge theo `StageBadge` của `@p2c/ui`.
- Chuỗi qua `vi.ts`.

##### Test chấp nhận

- [ ] e2e 5d: dòng "Sau khi lưu" có "hạ nhóm" / "lên nhóm"; KH đã đóng không có khối cảnh báo RF.
- [ ] e2e 6a: "Các lần hẹn trước" có badge; 6h không có khối này.
- [ ] e2e ở 1 440: hàng thẻ Lịch hẹn không gãy dòng (đo chiều cao).
- [ ] Unit: dòng đọc lại case size 500 000 → "500.000 ₫".
- [ ] e2e 6d: câu help hiện dưới ô Case size.
- [ ] e2e: ô ngoài tháng có tên đọc được, chứa số lịch.
- [ ] e2e: chuyển lịch trong khung Chi tiết → focus không ở nút của lịch cũ.
- [ ] Unit `stageSince`.
- [ ] e2e 6f E19: huy hiệu N3.

Ước lượng: ≈ 200 dòng SP + ≈ 250 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-298] đã sửa sang RESOLVED

##### Rủi ro

risk:med

##### Bị chặn bởi

#786 (T-297)

## PR #838 — fix: 5d reads the move, 6a history badges, 6d help, one-line rows in the card, named calendar days, detail focus (T-298)

Trạng thái: MERGED · merge 2026-10-26T00:15:08Z · commit `49fcd2aa21ae21a564fd32e1065208b6601abf94` · nhánh `task/T-298-ho-so-lich-hen` · nhãn: type:task, risk:med

Closes #787

#### Thay đổi

1. **Hộp 5d** (mục 1; L17):
   - Dòng "Sau khi lưu" thêm "· hạ nhóm" / "· lên nhóm" khi chuyển giữa hai nhóm mở (`stageDirection` ở `customers-view.ts`; N1 gần chốt nhất). Đóng KH, mở lại, đổi giữa hai nhóm đóng: không thêm chữ nào. Mockup 5d chỉ vẽ ca "hạ nhóm"; PR không đặt chữ mới chưa duyệt kiểu "đóng" / "mở lại".
   - Khối "Chuyển tay không bao giờ tính RF" chỉ hiện với KH đang mở. Hộp của KH đã đóng (5e) vẫn có câu "… Mở lại không tính RF.".
   - `error.INVALID_TRANSITION`: "Không chuyển được sang nhóm này. Nhóm mới phải khác nhóm hiện tại; KH đã đóng chỉ mở lại về N3." Một mã cho cả hai lý do nên câu nêu cả hai luật, đúng với lý do nào cũng vậy.
   - `closed = !isPipelineStage(customer.stage)` thay `CLOSED_STAGES.includes`.
2. **Một helper badge nhóm** (mục 1; L17): `badge` của `MetFields.tsx` là helper duy nhất. `CustomerDialogs.tsx`, `CustomerKyc.tsx`, đầu hồ sơ ở `CustomerProfile.tsx` và `AppointmentDialog.tsx` (ô KH, danh sách KH khớp) dùng nó; hai helper riêng và ba chỗ dựng `StageBadge` tay bỏ. Helper ở lại `MetFields.tsx` vì ba hộp ngoài danh sách file (`OutcomeDialog`, `EditOutcomeDialog`, `DeleteAppointmentDialog`) đang import nó từ đó; dời sang file khác thì phải sửa ba file đó.
3. **6a / 6h** (mục 2; L15):
   - "Các lần hẹn trước" hiện nhóm trước → sau bằng badge; cuộc gặp giữ nhóm: "Giữ" + badge.
   - Theo dòng mẫu của mockup 6a (12/07 · N3 → N2, không ghi RF), khối này không còn "· RF". Trước đây khối dùng chữ `outcomeText`, có "· RF".
   - Hộp 6h (mở từ một lịch đã qua) không có khối này.
4. **Thẻ Lịch hẹn của hồ sơ** (mục 2; L14, L59):
   - "N3 → N2 · RF": chữ "RF" màu accent (khóa mới `customer.rf`).
   - Lịch năm khác: ngày "dd/mm/yyyy", giờ ở dòng dưới (`text-fg-3`), như mockup.
   - **Mỗi hàng một dòng ở 1 440, với mọi kết quả trừ chuyển giữa hai nhóm đóng** (vòng sửa sau [`REVIEW: CHANGES` @`fc792fb`](https://github.com/AlexH-AI/Project-2C/pull/838#issuecomment-6401247095); Owner 26/10/2026: "sửa lỗi đó triệt để", rồi chọn phạm vi "mọi kết quả trừ đóng → đóng", [ghi ở comment này](https://github.com/AlexH-AI/Project-2C/pull/838#issuecomment-6401695107)). Quyết định "Owner chấp nhận 25/10" của bản trước đã bị thay, không vào ACCEPTED.
     - Gốc lỗi: `DataTable` chia cột theo nội dung. Ghi chú dài lấy gần hết chỗ, cột Kết quả chỉ còn bề rộng tối thiểu: 63 px cho chữ, bằng tiêu đề "KẾT QUẢ ↕". "Không đến" cần 65 px nên xuống hai dòng (hàng 55 px).
     - Nay bảng giữ bề rộng cột như mockup (`table-layout: fixed`). Ngày 84 px như mockup. Kết quả 120 px, mockup 92 px. "Hẹn tiếp" 56 px, mockup 58 px; chữ `--fs-xs` đậm như `.act`. Ghi chú lấy phần còn lại, ở 1 440 là 77 px. Đệm ngang của ô 6 px như mockup, đệm dọc giữ 8 px của `DataTable` (mockup 7 px), không ảnh hưởng xuống dòng.
     - Bề rộng chữ, Be Vietnam Pro 12,5 px: "Không đến" 65 · "N3 → N2 · RF" 77 · "Giữ Mất cơ hội" 88 · "Mất cơ hội → N3" 99 · "Chưa ghi kết quả" 103 px. Cột 120 px có 108 px cho chữ, đủ cho tất cả. "Tạm hoãn → Mất cơ hội" (142 px, KH đã đóng gặp xong rồi chuyển sang nhóm đóng kia, `allowedStages`) xuống dòng sau "→", theo phạm vi Owner chọn.
     - 1 440 là chỗ thẻ hẹp nhất trong khoảng cửa sổ app cho phép (`minWidth` 1 100). Ba cột bắt đầu đúng ở 90rem, lúc đó thẻ có 337 px; ở 1 439 px hồ sơ còn hai cột, thẻ 530 px; ở 1 100 px thẻ 361 px.
     - Ô Ngày và "Hẹn tiếp" vẫn `whitespace-nowrap`. Tính ra từ bề rộng từng chữ số: ngày rộng nhất ("04/04 04:44", 81 px) tràn vào phần đệm, chữ vẫn cách chữ Kết quả ít nhất 2,7 px. e2e đo một ngày gần rộng nhất, "04/09 20:44".
   - "Chưa ghi kết quả" trong thẻ vẫn là chữ màu (`UNRECORDED_TONE`), không là pill như ở các danh sách: pill không xuống dòng và rộng 110 px, quá 108 px chữ của cột. Các trạng thái khác trong thẻ vốn đã là chữ màu, mockup vẽ `.badge.plain`; lệch này có từ trước PR, nay ghi vào "Lệch mockup đã biết".
   - **File ngoài danh sách của Issue #787 (P-2): `packages/ui/src/components/DataTable.tsx`.** `DataTable` chưa có cách giữ bề rộng cột. PR thêm ba tùy chọn, mặc định giữ như cũ: `fixed` (bảng `table-fixed`), `compact` (đệm ô `px-1.5` thay `px-2.5`) và `width` của cột (class bề rộng ở ô tiêu đề). Chỉ thẻ này bật, các bảng khác không đổi (đủ bộ e2e xanh). Bản trước của thân PR nói "không thêm `table-layout: fixed` vào T-300"; nay thêm ngay ở PR này vì đây là mục chặn của review.
   - **File ngoài danh sách thứ hai (P-2): `e2e/navigation.spec.ts`.** Ca DR6-81 cần hồ sơ của KH cuối bảng (Đặng Quốc Sơn) cao hơn cửa sổ 900 px quá 200 px. Trước vòng sửa, hồ sơ đó chỉ vượt ngưỡng khoảng 11 px, nhờ hàng "N4 → Tạm hoãn" của thẻ Lịch hẹn gãy hai dòng (thêm khoảng 19 px). Nay hàng một dòng, hồ sơ cao 1 092 px, ca đỏ ở bước kiểm điều kiện. Phần đầu của ca chuyển sang cửa sổ thấp nhất của app (700 px, `minHeight` của `tauri.conf.json`), dư 192 px; ý của ca giữ nguyên.
5. **6d, ô Case size** (mục 3; L63, L116):
   - Câu help của mockup 6d hiện dưới ô, nguyên văn (khóa `outcome.caseSizeHelp`). Câu tĩnh nên hiện ở mọi hộp có ô này (6c, 6d, 6f); mockup chỉ vẽ ở 6d.
   - `TextField` của `@p2c/ui` không có `help`, nên câu là `<span>` dưới ô như câu của "Người đánh giá kết quả", không nằm trong mô tả trợ năng của ô.
   - Dòng đọc lại `caseSizeRead`: dưới 1 triệu chỉ một lần ("500.000 ₫"), cùng cách `kycAmountRead`.
6. **Ô khóa 6f** (L80, mục [T-298] của review #811, ghi sau khi viết Issue): `LOCKED` dùng viền đứt `border-border-strong` như `.input.locked` của mockup sau T-303. `EditOutcomeDialog.tsx` dùng hằng nên không phải sửa.
7. **Lịch tháng** (mục 4; L12):
   - Ô không bấm được (ngoài tháng, ngoài khoảng Tùy chọn) bỏ `aria-hidden`, có `role="img"` + `aria-label={dayLabel(cell)}`: cùng tên với ô bấm được (ngày, số lịch, số theo nhóm).
   - Hình ô không đổi: mờ, chỉ số ngày.
   - Chọn `role="img"` vì `div` không role không mang được tên trợ năng; con của `img` không bị đọc lặp.
8. **Khung Chi tiết** (mục 5; L47):
   - Hàng nút có `key={a.id}`. Khi lưu một hộp mà khung chuyển sang lịch khác (6c kèm hẹn tiếp, 6e, 6h tới hôm nay), nút mở hộp bị gỡ, nên `DialogFocusFallback` đưa focus về tiêu đề lịch mới và tiêu đề được đọc.
   - Khung vẫn ở lịch cũ thì focus về nút như trước.
9. **`stageSince` của hồ sơ** (mục 6; L45): `profileSince(customerId, transitions)` ở `customers-view.ts`; dòng "từ …" ở đầu hồ sơ và dòng dưới tiêu đề hộp 5d dùng hàm này. Unit test: chuyển nhóm mới nhất (không phải lần đầu), mở lại sau khi đóng.
10. **Tài liệu:**
    - `docs/testing/nghiem-thu-v1.md`: bỏ ba dòng lệch 5d, 6a / 6h, 6d. NT-KH-10 chờ "· hạ nhóm" / "· lên nhóm", bỏ ghi chú lệch. NT-KH-12: không có khung cảnh báo RF. NT-LH-17: badge, không ghi RF. NT-LH-25: câu help, `0,500 tr`. NT-LH-30: không có "Các lần hẹn trước". NT-HS-12: ở 1 440 lịch năm nay mỗi hàng một dòng với mọi kết quả, trừ chuyển giữa hai nhóm đóng; năm khác; RF màu nhấn.
    - Cùng file, "Lệch mockup đã biết" thêm ba dòng cho các lệch PR này giữ: 6h còn dòng "Lần gặp thứ n"; câu help Case size ở cả 6c / 6f; thẻ Lịch hẹn (cột Kết quả 120 px thay 92 px, "Hẹn tiếp" 56 px, Ghi chú hẹp hơn mockup; chỉ đóng → đóng xuống hai dòng; mọi trạng thái là chữ màu, mockup vẽ `.badge.plain`).
    - `docs/user-guide/03-lich-hen.md`: Các lần hẹn trước, dấu ngăn nghìn của Case size, 6h không có khối, ô khóa viền đứt. `05-ho-so-kh.md`: thẻ Lịch hẹn.
    - `04-khach-hang.md` (ngoài danh sách) không phải sửa: phần Chuyển nhóm tay không nhắc khung cảnh báo hay dòng "Sau khi lưu". Ảnh `img/04-chuyen-nhom.png` sẽ có "· hạ nhóm" khi chụp lại ở G7.

#### Test chấp nhận

Trên bản dựng trước khi sửa UI, 9 trong 10 ca e2e mới / đổi đỏ, đúng lý do. Ca thứ mười (E19) chỉ thêm kiểm cho hành vi vốn đã đúng. Ca 1 440 khi đó đỏ ngay ở bước "giờ năm khác xuống dòng", chưa tới bước đo. Phần đo được thử riêng trên code mới, mỗi lần bỏ một `whitespace-nowrap`: bỏ ở ô Ngày → chữ ô Ngày cao 34,75 px, đỏ; bỏ ở cột "Hẹn tiếp" → nút cao 37,5 px, đỏ.

Vòng sửa 26/10: ca 1 440 viết lại, chạy trên `9d35f48` (code trước vòng sửa) thì đỏ đúng lý do: hàng "07/09 Không đến" cao 54,5 px.

- [x] e2e 5d, `customer-forms.spec.ts` "changing the stage by hand reads back the move…" (mới): "Sau khi lưu: N2 → N3 · hạ nhóm", "N2 → N1 · lên nhóm", "N2 → Tạm hoãn" không có chữ nào. Ca "a closed customer reopens only to N3" (có sẵn) thêm: có câu "Mở lại không tính RF.", không có khối "Chuyển tay không bao giờ tính RF".
- [x] e2e 6a / 6h, `appointment-outcome.spec.ts` "6a shows the moves of its history as stage badges…" (mới):
  - ghi một cuộc gặp N3 → N2; hộp 6h mở từ cuộc gặp đó không có khối;
  - 6a từ hồ sơ: dòng 15/09 có badge N3 và N2 đúng màu nhóm, không có "RF", tối đa 5 dòng;
  - thẻ Lịch hẹn: dòng đó "N3 → N2 · RF", "RF" màu accent.
  - Ca 6h có sẵn của `appointments.spec.ts` đổi: khối không có (trước: có, ≤ 5 dòng).
- [x] e2e 1 440, `customer-appointments.spec.ts` "at 1 440 a row is one line whatever its result…" (mới, viết lại ở vòng sửa 26/10):
  - KH mới ở N3; mỗi kết quả ghi kèm ghi chú dài như dòng mẫu của mockup. Các lịch: N3 → N2 · RF, N2 → Mất cơ hội, Giữ Mất cơ hội, Mất cơ hội → N3, Không đến, Hủy, Dời lịch (sang Dự kiến 21/09), Chưa ghi kết quả 04/09 20:44, và một lịch 10/12/2025 16:41. Ca kiểm thẻ có đủ từng kết quả trước khi đo.
  - Mọi hàng năm nay cao dưới 45 px (một dòng khoảng 36 px; trước vòng sửa, hàng "Không đến" cao 54,5 px). Chữ ngày "04/09 20:44" dừng trước chữ Kết quả.
  - Dòng 2025 có giờ nằm dưới ngày. Thẻ không tràn ngang ở 1 440 lẫn 1 100.
- [x] Chuyển giữa hai nhóm đóng (142 px) xuống hai dòng: Owner chọn phạm vi ngày 26/10/2026 ([comment](https://github.com/AlexH-AI/Project-2C/pull/838#issuecomment-6401695107)), e2e không kiểm ca này.
- [x] Unit `MetFields.test.ts` `caseSizeRead`: 500 000 → "500.000 ₫"; 800 tr và 1,234 tỷ có phần gọn trong ngoặc.
- [x] e2e 6d, ca đầu của `appointment-outcome.spec.ts` (có sẵn) thêm: `0,500 tr` → mô tả "500.000 ₫"; câu help nằm dưới ô Case size (đo vị trí).
- [x] e2e lịch tháng, `appointments.spec.ts` "a day outside the month or the range is named with its count…" (mới):
  - 31/08 của lịch tháng 09/2026 có tên "31/08/2026: n lịch hẹn…";
  - Tùy chọn 10–20/09: ô 21/09 có tên, trùng tên ô 21/09 khi khoảng gồm ngày đó.
  - Ca "a custom range bands its days…" (có sẵn) tìm ô ngoài khoảng theo tên, không theo `[aria-hidden]`.
- [x] e2e khung Chi tiết, `appointment-outcome.spec.ts` "by the keyboard, rescheduling leaves the focus on the heading of the new appointment" (mới): dời lịch bằng phím, focus ở tiêu đề "22/09/2026 · <tên>". Trước PR focus về nút "Dời lịch" của lịch mới.
- [x] Unit `customers-view.test.ts`: `profileSince` (2 ca), `stageDirection` (lên, hạ, giữ, đóng, mở lại, đổi nhóm đóng).
- [x] e2e 6f E19 (có sẵn) thêm: badge ngay sau nhãn "Nhóm sau cuộc gặp" là N3 🔒, nhóm hộp giữ.

#### Lệch mockup, ngoài phạm vi, đề xuất ghi sổ

Ba lệch dưới đã có dòng ở "Lệch mockup đã biết" của `nghiem-thu-v1.md`:

- 6h: mockup không có dòng "Lần gặp thứ n · lần trước …" dưới ô KH; app vẫn hiện. Issue chỉ nói khối Các lần hẹn trước, nên để nguyên.
- Câu help Case size hiện cả ở 6c / 6f (xem mục 5).
- Thẻ Lịch hẹn (xem mục 4): cột Kết quả 120 px thay 92 px, "Hẹn tiếp" 56 px thay 58 px, nên Ghi chú hẹp hơn mockup; chỉ chuyển giữa hai nhóm đóng xuống hai dòng (Owner 26/10/2026). Mọi trạng thái là chữ màu, mockup vẽ `.badge.plain`. Dòng ở `nghiem-thu-v1.md` đã viết lại theo cách sửa, gồm cả ghi chú [G7] của review về dòng này.

Đề xuất ghi sổ (mới): khung Chi tiết, bấm nút "Dời từ" / "Dời sang" trong phần thông tin thì khung chuyển sang lịch kia. Dòng chứa nút khóa theo nhãn ("Dời sang" ≠ "Dời từ") nên nút bị gỡ và focus rơi về `body`. Ngoài các ca lưu hộp của Issue.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (23 mục "Trùng file"; sổ ở `9d35f48`, sau #839 nên số dòng đổi so với bản trước; L24 và L42 mới vì PR nay sửa `DataTable.tsx`):

- L12 [T-298] ô ngoài tháng / ngoài khoảng `aria-hidden`: **đã sửa** (mục 7).
- L14 [T-298] #165 "RF" accent, năm khác xuống dòng giờ: **đã sửa** (mục 4).
- L15 [T-298] #163 badge ở 6a, 6h có khối thừa: **đã sửa** (mục 3).
- L17 [T-298] #141 (5d, khối cảnh báo, `INVALID_TRANSITION`, `!isPipelineStage`, helper badge): **đã sửa** (mục 1, 2).
- L24 [T-300 #789] `DataTable` chưa có test `sortable: false`, bảng rỗng; `cellClass` chỉ có e2e phủ: để lại, của T-300. Ba tùy chọn mới (`fixed`, `compact`, `width`) cũng chỉ có e2e 1 440 phủ, cùng lý do: repo chưa có công cụ test component (G4).
- L42 [T-300 #789] JSDoc `headerHidden`: để lại, của T-300.
- L45 [T-298] `stageSince` của hồ sơ chưa có unit test: **đã sửa** (mục 9).
- L47 [T-298] khung Chi tiết giữ DOM hàng nút: **đã sửa** (mục 8).
- L59 [T-298] thẻ Lịch hẹn gãy dòng ở 1 440: **đã sửa** (mục 4), theo cách thứ hai mục này nêu: `table-fixed` + bề rộng cột như mockup.
- L61 [T-298] e2e E19 không đọc nhóm hộp giữ: **đã sửa** (test).
- L63 [T-298] `outcome.caseSizeRead` lặp ngoặc dưới 1 triệu: **đã sửa** (mục 5).
- L67 [T-300 #789] `index.css`, thẻ đưa lên đỉnh dưới thanh 64: để lại, của T-300.
- L70 [G7] ca nghiệm thu thư mục cấm tạo file: để lại, PR docs G7.
- L80 [T-298] `LOCKED` viền liền: **đã sửa** (mục 6).
- L84 [G7] ba lệch mockup chưa có dòng (PR #817): để lại, PR docs G7.
- L92 [G7] hai lệch của hộp 10c: để lại, PR docs G7.
- L99 [T-301 #790] `restoreView` dựng câu lặp: để lại, của T-301.
- L102 [G7] hộp 8d không in đậm: để lại, PR docs G7.
- L107 [G7] ba lệch dòng thời gian (PR #835): để lại, PR docs G7.
- L110 [T-301 #790] DR6-37 ký hiệu viết cứng ở `CustomerKyc.tsx` (`✓` / `○`, `join(', ')`) và `AppointmentDialog.tsx` (`×`): để lại, của T-301 (Issue #787 dặn để lại). PR không thêm ký hiệu viết cứng nào: dấu mới đi qua `sep.*`.
- L112 [T-301 #790] export không ai dùng (DR6-66 phần app): để lại, của T-301.
- L114 [T-301 #790] hằng `CARD` / `ALERT` / `LINK` lặp: để lại, của T-301.
- L116 [T-298] lệch mockup 6d, câu help Case size: **đã sửa** (mục 5).

#### Kích thước

Tổng diff 574 dòng: SP +169 / −54, test kể cả e2e +316 / −7, tài liệu +14 / −14. Trong ngưỡng (~400 SP, ~800 tổng). Riêng vòng sửa 26/10 (`9d35f48..bf9c3fd`, 2 commit): SP +29 / −7 (`CustomerAppointments.tsx`, `DataTable.tsx`), test +129 / −29 (ca 1 440 viết lại, ca DR6-81), tài liệu +2 / −2.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local trên `bf9c3fd`
- [x] `pnpm e2e` đủ bộ (293 test) xanh ở local trên `bf9c3fd`. Lần chạy đủ bộ đầu tiên của vòng sửa có một ca đỏ (DR6-81, xem mục 4); ca đó nay xanh, chạy riêng hai lần cũng xanh
- [x] Không thêm dependency ngoài ADR-0005
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-298 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #141, #156, #163, #165, #644, #693, #746, #748, #758, #811 và lệch mockup 6d — T-298 (#787, PR #838, `REVIEW: PASS` @`bf9c3fd`):
  - #156, `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx` (`DayButton`): ô ngoài tháng / ngoài khoảng bỏ `aria-hidden`, nay là `role="img"` có tên `dayLabel(cell)`, cùng tên với ô bấm được (ngày, số lịch, số theo nhóm); hình ô không đổi. e2e "a day outside the month or the range is named with its count…" ở `e2e/appointments.spec.ts`. Ô hôm nay thiếu `aria-current`: ghi mới ở OPEN (review #838).
  - #165, `apps/desktop/src/routes/customers/CustomerAppointments.tsx`: "RF" của "N3 → N2 · RF" màu accent (khóa `customer.rf`); lịch năm khác ghi "dd/mm/yyyy", giờ ở dòng dưới. e2e ở `e2e/appointment-outcome.spec.ts` và `e2e/customer-appointments.spec.ts`.
  - #163, `apps/desktop/src/routes/appointments/AppointmentDialog.tsx` (`History`): "Các lần hẹn trước" của 6a hiện nhóm trước → sau bằng badge, cuộc gặp giữ nhóm là "Giữ" + badge, không ghi RF (như dòng mẫu của mockup 6a); hộp 6h (mở từ một lịch đã qua) không có khối này. e2e ở `e2e/appointment-outcome.spec.ts`, ca 6h của `e2e/appointments.spec.ts`.
  - #141, `apps/desktop/src/routes/customers/CustomerDialogs.tsx` (`ChangeStageDialog`, 5d / 5e): "Sau khi lưu" thêm "· hạ nhóm" / "· lên nhóm" khi chuyển giữa hai nhóm mở (`stageDirection` ở `apps/desktop/src/routes/customers/customers-view.ts`); khối "Chuyển tay không bao giờ tính RF" chỉ hiện với KH đang mở; `!isPipelineStage` thay `CLOSED_STAGES.includes`; `error.INVALID_TRANSITION` (`apps/desktop/src/i18n/vi.ts`) nêu cả hai luật. Một helper badge nhóm: `badge` của `apps/desktop/src/routes/appointments/MetFields.tsx`, dùng ở `CustomerDialogs.tsx`, `CustomerKyc.tsx`, đầu hồ sơ `CustomerProfile.tsx` và `AppointmentDialog.tsx`. e2e ở `e2e/customer-forms.spec.ts`; unit `stageDirection` ở `apps/desktop/src/routes/customers/customers-view.test.ts`. Tên, chỗ đặt của `badge` và năm chỗ còn dựng `StageBadge` tay: ghi mới ở OPEN (review #838).
  - #644, `apps/desktop/src/routes/customers/CustomerProfile.tsx`: dòng "từ …" và hộp 5d dùng `profileSince(customerId, transitions)` (`apps/desktop/src/routes/customers/customers-view.ts`), có unit test ở `apps/desktop/src/routes/customers/customers-view.test.ts` (chuyển nhóm mới nhất, mở lại sau khi đóng).
  - #693, `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx` (`Detail`): hàng nút khóa theo lịch (`key={a.id}`). Lưu một hộp mà khung chuyển sang lịch khác (6c kèm hẹn tiếp, 6e, 6h tới hôm nay) thì nút mở bị gỡ, focus về tiêu đề lịch mới; khung vẫn ở lịch cũ thì focus về nút. e2e "by the keyboard, rescheduling leaves the focus on the heading…" ở `e2e/appointment-outcome.spec.ts`. Bấm "Dời sang" / "Dời từ" trong phần thông tin vẫn làm mất focus: ghi mới ở OPEN (review #838).
  - #746, `apps/desktop/src/routes/customers/CustomerAppointments.tsx` (thẻ Lịch hẹn ở 1 440): bảng `table-layout: fixed` qua ba tùy chọn mới của `packages/ui/src/components/DataTable.tsx` (`fixed`, `compact`, `width`; mặc định như cũ), cột 84 / 120 / phần còn lại / 56 px, đệm ngang 6 px. Mọi hàng năm nay một dòng với mọi kết quả, trừ chuyển giữa hai nhóm đóng (Owner 26/10/2026, sau `REVIEW: CHANGES` @`fc792fb`). e2e "at 1 440 a row is one line whatever its result…" ở `e2e/customer-appointments.spec.ts`. Cột Kết quả 120 px thay 92 px của mockup: ở "Lệch mockup đã biết" của `docs/testing/nghiem-thu-v1.md`.
  - #748, `e2e/appointment-outcome.spec.ts` (ca E19 của 6f): kiểm badge ngay sau nhãn "Nhóm sau cuộc gặp" là N3 🔒, nhóm hộp đang giữ.
  - #758, `apps/desktop/src/routes/appointments/MetFields.tsx` (`caseSizeRead`): dưới 1 triệu chỉ đọc một lần ("500.000 ₫"), cùng cách `kycAmountRead`. Unit ở `apps/desktop/src/routes/appointments/MetFields.test.ts`, e2e 6d ở `e2e/appointment-outcome.spec.ts`. Bản thứ ba `fypRead` vẫn lặp: ghi mới ở OPEN (review #838).
  - #811, `apps/desktop/src/routes/appointments/appointments-view.ts` (`LOCKED`): viền đứt `border-dashed border-border-strong` như `.input.locked` của mockup 6f; `EditOutcomeDialog.tsx` và `MetFields.tsx` dùng hằng nên không phải sửa.
  - Lệch mockup 6d, `apps/desktop/src/routes/appointments/MetFields.tsx`: câu help của mockup 6d hiện dưới ô Case size (khóa `outcome.caseSizeHelp`), ở mọi hộp có ô này (6c, 6d, 6f; ghi ở "Lệch mockup đã biết"). e2e ở `e2e/appointment-outcome.spec.ts`. Dòng lệch 6d của `docs/testing/nghiem-thu-v1.md` đã bỏ. Câu không thuộc mô tả trợ năng của ô: ghi mới ở OPEN (review #838).

---

# Issue #788 — T-299: Team, Báo cáo, Tổng quan: hộp nhân sự, bảng thành viên giữ cách sắp, bảng số cho chart N4–N1, bộ chọn kỳ

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **Hộp nhân sự:**
   - luật "vai trò cần team" (RE, TL) một nguồn, dùng chung với `db`;
   - "Xóa nhân sự" trong hộp Sửa không bỏ thay đổi chưa lưu mà không báo (hỏi trước, hoặc tắt nút khi có thay đổi).
2. **Màn Team:**
   - đổi team giữ cách sắp người dùng đã chọn ở bảng thành viên;
   - lưu đổi team của một RE bằng phím đưa focus về nút "Sửa <tên>" của người đó (chỉ khóa phần đầu thẻ theo team);
   - `resetKey` thừa: bỏ, hoặc ghi comment rằng `key` mới là thứ đưa bảng về 100 dòng;
   - JSDoc `inUseHelp` theo câu hiện tại.
3. **Chart N4–N1:** có bảng ẩn `sr-only` sinh từ cột của chart (`aria-describedby`), để trình đọc màn hình đọc được số liệu.
4. **Bộ chọn kỳ Tùy chọn:** không báo đỏ sớm khi Tab từ ô Từ sang ô Đến. Áp dụng khi rời cả nhóm hoặc Enter.
5. **Báo cáo Theo mốc và khối nhóm của Tổng quan:** dùng một helper cho bất biến "mốc sau hôm nay luôn ở cuối".

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Issue này gom các mục OPEN gắn **[T-299]**:
- Team & nhân sự #144;
- khóa `Members` (#744, Owner 23/10 đưa lại từ đề xuất ACCEPTED); `resetKey`, `inUseHelp` (#744);
- chart N4–N1 (review đóng Phase 4, P8);
- `PeriodPicker` (R4);
- helper mốc (#332).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-299]
- `docs/design/mockups/team.html`, `docs/design/mockups/phase-3-feedback.html` (B1); `docs/design/mockups/overview.html` (khối nhóm N4–N1); `docs/design/mockups/reports.html` (Theo mốc)
- `apps/desktop/src/routes/team/{PersonDialogs.tsx,TeamScreen.tsx,team-view.ts}`
- `apps/desktop/src/routes/overview/{StageBlock.tsx,stage-view.ts,stage-chart.ts}`; `apps/desktop/src/routes/reports/reports-view.ts`
- `packages/ui/src/components/{Chart.tsx,PeriodPicker.tsx}`; `packages/db/src/team.ts` (`ROLES_WITH_TEAM`); `packages/domain/src/model.ts` (`PERSON_ROLES`)

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/team/{PersonDialogs.tsx,TeamScreen.tsx,team-view.ts}` + test
- `apps/desktop/src/routes/overview/{StageBlock.tsx,stage-view.ts,stage-chart.ts}` + test, `apps/desktop/src/routes/reports/reports-view.ts` + test
- `packages/ui/src/components/{Chart.tsx,PeriodPicker.tsx}` (+ phần thuần có test)
- `packages/domain/src/model.ts`, `packages/db/src/team.ts` (nếu luật vai trò cần team đặt ở `domain`) + test
- `apps/desktop/src/i18n/vi.ts`
- `e2e/{team.spec.ts,overview.spec.ts,chart.spec.ts,period-picker.spec.ts,reports.spec.ts}`
- `docs/user-guide/{02-tong-quan.md,07-bao-cao.md,08-team.md}`, `docs/testing/nghiem-thu-v1.md`

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-299]**: gộp. Mục khác trùng file (T-300 `packages/ui`, T-301 cột báo cáo / `markName`) để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Bảng ẩn của chart dùng số của `StageChart.columns` (cùng nguồn với chart), chuỗi qua `vi.ts`.
- `PeriodPicker` giữ API.

##### Test chấp nhận

- [ ] e2e Team:
  - sắp theo cột khác → bấm team khác → vẫn sắp như đã chọn;
  - đổi team của RE bằng phím → focus về "Sửa <tên>".
- [ ] e2e: hộp Sửa nhân sự có thay đổi chưa lưu → bấm Xóa → có báo / hỏi.
- [ ] e2e: chart N4–N1 có bảng ẩn đủ số, nối bằng `aria-describedby`.
- [ ] e2e: gõ ngày Từ rồi Tab sang Đến → không đỏ; rời nhóm với ngày sai → đỏ.
- [ ] Unit: helper mốc dùng ở cả hai nơi; test tương đương trên seed giữ xanh.

Ước lượng: ≈ 180 dòng SP + ≈ 200 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-299] đã sửa sang RESOLVED

##### Rủi ro

risk:med

##### Bị chặn bởi

#787 (T-298)

## PR #841 — fix: team table keeps its sort and focus, Xóa nhân sự asks first, chart numbers for screen readers, custom dates on leaving both fields (T-299)

Trạng thái: MERGED · merge 2026-10-26T04:15:08Z · commit `b226cb9d7423bc8662f8521f6b64b8d27a9d7a0f` · nhánh `task/T-299-team-bao-cao` · nhãn: type:task, risk:med

Closes #788

#### Thay đổi

- **Màn Team** (sổ L47, L48): chỉ phần đầu thẻ thành viên (tiêu đề, TL, Đổi tên / Xóa team, + Thêm TL) khóa theo team; `DataTable` giữ nguyên khi đổi team.
  - Cách sắp người dùng chọn được giữ, kể cả khi đi qua một team chưa có RE (bảng ẩn bằng `hidden`, không bỏ).
  - Lưu đổi team của một RE bằng phím: `<tr>` khóa theo id người được dùng lại, focus về "Sửa <tên>" ở team mới.
  - DR6-116 giữ nguyên: "Xóa team" của team vừa xóa không còn, focus về tiêu đề "Team".
- **`resetKey`** (L48): sổ đề xuất bỏ hoặc ghi rằng `key` đưa bảng về 100 dòng. Nay bảng không còn dựng lại theo team, nên `resetKey` chính là thứ đưa team khác về 100 dòng (DR6-32). Giữ lại kèm comment.
  - Kiểm bằng đột biến: bỏ `resetKey` thì `e2e/team.spec.ts` ca "another team shows its first 100 RE again" đỏ (Sao Mai hiện 111 dòng).
- **Hộp nhân sự** (L12):
  - `ROLES_WITH_TEAM` chuyển sang `packages/domain/src/model.ts` (cạnh `REVIEWER_ROLES`); `db/team.ts` và `PersonDialogs.tsx` dùng chung.
  - Hộp Sửa có thay đổi chưa lưu mà bấm "Xóa nhân sự" thì hỏi trước: dòng `role="alert"` "Có thay đổi chưa lưu: Lưu để giữ, hoặc bỏ thay đổi để xóa nhân sự.", nút đổi thành "Bỏ thay đổi và xóa nhân sự". "Có thay đổi" so với họ tên / vai trò / team đã lưu: RE → IS → RE không tính là thay đổi.
- **Chart N4–N1** (L15): mỗi chart có bảng `sr-only` (`stageChartTable` thuần, cùng cột với chart, các nhóm đang hiện + Tổng như tooltip; mốc sau hôm nay "—"), chuỗi qua `vi.ts`. `Chart` thêm prop `describedBy`.
  - `aria-describedby` trỏ vào `thead` + `tbody`, không trỏ cả `<table>`. Lý do: caption là tên của bảng, mà mô tả của chart chỉ đọc đúng tên đó thay cho các con số (accname bước 2D; e2e thấy mô tả chỉ còn "Số liệu: …"). Bảng vẫn có caption "Số liệu: <tên chart>" để duyệt.
  - Bảng nằm trong `div.sr-only`: `sr-only` đặt thẳng trên `<table>` không thu được bảng (bảng giãn theo nội dung: rộng 314 px, cao vài trăm px).
  - **Giới hạn đã biết**, đo trên cây truy cập của chính Chromium (CDP `Accessibility.getFullAXTree`, bản build e2e, spec tạm không commit):
    - Trỏ cả `<table>`: mô tả chỉ còn caption (39 ký tự).
    - Trỏ `thead` + `tbody`: mô tả có tiêu đề và các dòng, nhưng Chromium dừng ở khoảng 6–7 mốc đầu (Tuần 266 ký tự, Tháng 310, Năm 304). Có vẻ là giới hạn số node khi ghép chữ. Tháng / Năm vì vậy không có dòng hôm nay trong mô tả.
    - Bảng `sr-only` đủ mọi mốc, nằm trong cây truy cập với tên "Số liệu: …", đọc được bằng điều hướng bảng ngay sau chart. Muốn mô tả đủ số thì phải đổi cách làm (vd. một dòng tóm tắt cột cuối, hoặc `aria-details`), tức lệch chữ của Issue: chờ Owner chọn.
- **PeriodPicker** (L13): ô Tùy chọn áp dụng khi Enter hoặc khi focus rời cả hai ô (bọc `span.contents`, kiểm `relatedTarget`), không còn báo đỏ khi Tab từ Từ ngày sang Đến ngày. API giữ nguyên.
- **Helper mốc** (L17): `eachMark(values, batch)` ở `stage-view.ts`, dùng ở `stageBlock` và `reportRows` (Theo mốc). Kết quả ghép theo vị trí giữa các mốc có giá trị, nên không còn dựa vào bất biến "mốc sau hôm nay luôn ở cuối". Unit test có mốc trống ở giữa và trường hợp mọi mốc trống.
- **JSDoc `inUseHelp`** (L49) theo câu hiện tại (DR6-115).
- **Tài liệu:** hướng dẫn 02 (Tùy chọn, bảng số của biểu đồ), 08 (sắp xếp khi đổi team, hỏi khi chưa lưu); nghiệm thu thêm NT-TQ-26, NT-TM-17, NT-TM-18 (dòng mới, không sửa dòng cũ).
- **Cỡ:** ≈ 301 dòng sản phẩm (+/−), 208 dòng test / e2e, 13 dòng tài liệu / codemap; tổng ≈ 522 (ngưỡng ~400 / ~800).
- **Nhánh:** đã merge `main` (#838, #840) vào nhánh, không xung đột (`vi.ts`, `nghiem-thu-v1.md` tự gộp; `DataTable.tsx` của #838 chỉ thêm prop `width` / `fixed` / `compact`, mặc định không đổi).
- **Ngoài danh sách file của Issue** (hệ quả bắt buộc):
  - `packages/domain/src/index.ts`: một dòng export `ROLES_WITH_TEAM`; `packages/domain/CLAUDE.md` của domain yêu cầu export mới đi qua `index.ts`.
  - `packages/domain/CLAUDE.md`: codemap sinh lại (`pnpm codemap`).

#### Test chấp nhận

- [x] e2e Team:
  - sắp theo cột khác → bấm team khác → vẫn sắp như đã chọn (thêm: qua team chưa có RE);
  - đổi team của RE bằng phím → focus về "Sửa <tên>" (`e2e/team.spec.ts`).
- [x] e2e: hộp Sửa nhân sự có thay đổi chưa lưu → bấm Xóa → hỏi; bỏ thay đổi thì sang 9b với tên cũ; không đổi gì thì sang thẳng 9b.
- [x] e2e: chart N4–N1 có bảng ẩn đủ số, nối bằng `aria-describedby`; dòng hôm nay = 4 ô N4–N1 + Tổng; dòng sau hôm nay "—" (`e2e/chart.spec.ts`).
- [x] e2e: gõ ngày Từ (không có thật) rồi Tab sang Đến → không đỏ; rời nhóm → đỏ; Enter ở mỗi ô áp dụng (`e2e/period-picker.spec.ts`).
- [x] Unit: `eachMark` có test riêng và dùng ở cả hai nơi; test tương đương trên seed (stage-view "each column equals the snapshot of its day alone", reports-view "Theo mốc equals each mark counted on its own") giữ xanh.
- Mỗi e2e mới đã chạy đỏ trên code cũ trước khi sửa. Ca "qua team chưa có RE" kiểm bằng đột biến: dựng lại bảng thì đỏ.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `b319576` (sau khi merge `main` có #838, #840):

- L12 `PersonDialogs.tsx` [T-299]: đã sửa (`ROLES_WITH_TEAM` một nguồn ở domain; Xóa nhân sự hỏi trước).
- L13 `PeriodPicker.tsx` [T-299]: đã sửa (áp dụng khi rời cả hai ô hoặc Enter).
- L15 `Chart.tsx`, `StageBlock.tsx` [T-299]: đã sửa (bảng `sr-only` từ `StageChart.columns`, `aria-describedby`; giới hạn của Chromium ở mục Thay đổi).
- L17 `reports-view.ts`, `stage-view.ts` [T-299]: đã sửa (`eachMark`, không còn dựa vào bất biến).
- L47 `TeamScreen.tsx` [T-299]: đã sửa (khóa phần đầu thẻ; bảng giữ cách sắp, focus về "Sửa <tên>").
- L48 `TeamScreen.tsx`, `e2e/team.spec.ts` [T-299]: đã sửa theo hướng giữ `resetKey` + comment (nay nó là thứ đưa bảng về 100 dòng; ca e2e lại giữ nó, đã kiểm bằng đột biến).
- L49 `team-view.ts` [T-299]: đã sửa (JSDoc).
- L56, L68, L76, L86, L91 `nghiem-thu-v1.md` [G7]: để lại: việc của PR docs nghiệm thu G7; PR này chỉ thêm NT-TQ-26, NT-TM-17, NT-TM-18.
- L83 `vi.ts` [T-301 #790]: để lại: thuộc T-301 (`trash-view.ts` `restoreView`).
- L95 `vi.ts` [T-301 #790]: để lại: thuộc T-301 (ô RF của `CustomerAppointments.tsx` ráp lại khuôn `appointments.moveRf`).
- L97 `StageBlock.tsx` [T-301 #790]: để lại: thuộc T-301 (đổi tên `badge` của `MetFields.tsx` thành `stageBadge` ở module trung tính, cần sửa `CustomersScreen.tsx`, `RestoreDialog.tsx`, `SettingsTrash.tsx`, ba file `customers/` ngoài danh sách của #788).
- L107 `reports-view.ts`, `vi.ts` [T-301 #790]: để lại: thuộc T-301 (export không ai import, `markName`…).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local, trước và sau khi merge `main` có #838
- [x] `pnpm e2e` đầy đủ xanh ở local: 293 / 293 trước khi merge `main`, 298 / 298 sau khi merge (`b319576`)
- [x] Không thêm dependency ngoài ADR-0005
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-299 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #144, #332, #744, R4 và review đóng Phase 4 (P8) — T-299 (#788, PR #841, `REVIEW: PASS` @`b319576`):
  - #144, `apps/desktop/src/routes/team/PersonDialogs.tsx`: luật "vai trò cần team" một nguồn, `ROLES_WITH_TEAM` ở `packages/domain/src/model.ts`, dùng chung với `packages/db/src/team.ts`. Hộp Sửa có thay đổi chưa lưu (họ tên / vai trò / team so với bản đã lưu; RE → IS → RE không tính) mà bấm "Xóa nhân sự" thì hỏi trước: dòng `role="alert"`, nút đổi thành "Bỏ thay đổi và xóa nhân sự". e2e "Xóa nhân sự asks first…" ở `e2e/team.spec.ts`; NT-TM-18. Bấm đúp bỏ qua câu hỏi: ghi mới ở OPEN (review #841).
  - R4, `packages/ui/src/components/PeriodPicker.tsx`: ô Tùy chọn áp dụng khi Enter hoặc khi focus rời cả hai ô (`onBlur` trên `span.contents` bọc hai ô, kiểm `relatedTarget`); Tab giữa hai ô không báo đỏ, API giữ nguyên. e2e "a custom date is refused once the focus leaves both date fields…" ở `e2e/period-picker.spec.ts`; NT-TQ-26.
  - Review đóng Phase 4 (P8), `apps/desktop/src/routes/overview/StageBlock.tsx`, `packages/ui/src/components/Chart.tsx`: mỗi chart N4–N1 có bảng `sr-only` từ `StageChart.columns` (`stageChartTable` ở `apps/desktop/src/routes/overview/stage-chart.ts`: các nhóm đang hiện + Tổng, mốc sau hôm nay "—"); `Chart` thêm prop `describedBy`, `aria-describedby` trỏ vào `thead` + `tbody`. Unit ở `apps/desktop/src/routes/overview/stage-chart.test.ts`, e2e ở `e2e/chart.spec.ts`. Chromium cắt mô tả sau khoảng 6–7 mốc: ghi mới ở OPEN (review #841).
  - #332, `apps/desktop/src/routes/overview/stage-view.ts`, `apps/desktop/src/routes/reports/reports-view.ts`: helper `eachMark(values, batch)` ghép kết quả theo vị trí giữa các mốc có giá trị, dùng ở `stageBlock` và `reportRows`; không còn dựa vào bất biến "mốc sau hôm nay luôn ở cuối". Unit ở `apps/desktop/src/routes/overview/stage-view.test.ts` (mốc trống ở giữa, mọi mốc trống); hai test tương đương trên seed giữ xanh.
  - #744, `apps/desktop/src/routes/team/TeamScreen.tsx` (`key` của `Members`, DR6-116): chỉ phần đầu thẻ (tiêu đề, TL, Đổi tên / Xóa team, + Thêm TL) khóa theo team; `DataTable` không dựng lại khi đổi team. Cách sắp người dùng chọn được giữ, kể cả khi qua team chưa có RE (bảng ẩn bằng `hidden`); lưu đổi team của một RE bằng phím đưa focus về "Sửa <tên>" ở team mới. e2e "the member table keeps the sort picked…" và "by the keyboard, moving an RE to another team…" ở `e2e/team.spec.ts`; NT-TM-17.
  - #744, `apps/desktop/src/routes/team/TeamScreen.tsx` (`resetKey`, DR6-32): giữ kèm comment. Bảng không còn dựng lại theo team, nên `resetKey` là thứ đưa team khác về 100 dòng; ca `e2e/team.spec.ts:150` nay giữ nó (thân PR #841: bỏ `resetKey` thì ca đó đỏ).
  - #744, NIT `apps/desktop/src/routes/team/team-view.ts` (`inUseHelp`): JSDoc theo câu hiện tại (DR6-115).

---

# Issue #789 — T-300: packages/ui và vỏ: token tương phản, DataTable, token-guard, ngưỡng nhánh, favicon, thanh trên cùng

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **Token tương phản:** viền ô nhập và mũi tên sắp xếp đạt ≥ 3:1. App chỉ có theme tối (ADR-0013), nên "cả hai theme" là theme tối. Dùng token `--border-control` #687890 Owner duyệt ở T-284 (G3, 23/10/2026, PR #795; `docs/design/mockups/index.html#contrast`) cho:
   - viền `TextField`, `SelectField`, ô ngày Tùy chọn của `PeriodPicker`, mũi tên ↕ chưa chọn của `DataTable`;
   - hai ô nhập tự viết class ngoài `packages/ui` (Owner thêm vào Issue này ở cùng lần duyệt): ô tìm của Thùng rác (`SettingsTrash.tsx`), ô tin nhắn ChatGPT web (`KycWebSession.tsx`).
2. **`DataTable`:**
   - test cho `sortable: false` và bảng rỗng; tách logic cần test ra hàm thuần, không thêm thư viện DOM (G4: không);
   - `headerHidden` chỉ có tác dụng khi `sortable: false` (ràng bằng kiểu, hoặc JSDoc nói rõ).
3. **`token-guard`:**
   - miễn trừ chỉ nhận `flex` từ định danh, không nhận hằng `flex: 1`;
   - doc comment gọn;
   - hai nhánh chưa test (`token-guard` dòng 63, `compare-cells` dòng 37) có test → ngưỡng coverage nhánh của `packages/ui/src/**` lên 100.
4. **Favicon** một nguồn từ icon của app, bỏ bản sao trong `public/`.
5. **Thanh trên cùng (`index.css`):**
   - một thẻ đưa lên đỉnh bằng `scrollIntoView({ block: 'start' })` ở màn có bộ chọn phạm vi (thanh 64) không nằm dưới thanh;
   - comment ghi "64 px (`--spacing(16)`)";
   - ca e2e focus trong hộp thoại đã cuộn (giữ phần loại trừ `:not(dialog, dialog *)`).

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Issue này gom các mục OPEN gắn **[T-300]**:
- token G3 (R4);
- `DataTable` (Phase 1, #630); `token-guard` (#247); ngưỡng nhánh (#644);
- favicon (#128); `index.css` (#760).

Mục 1 chờ T-284 merge.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-300]
- `docs/design/mockups/index.html` (bảng token, bản Owner duyệt ở T-284); `.claude/rules/i18n-ui.md` (token, tương phản AA)
- `packages/ui/src/{tokens.css,token-guard.ts,components/DataTable.tsx,components/compare-cells.ts,components/Dialog.tsx}`; `packages/ui/CLAUDE.md`
- `vitest.config.ts` (ngưỡng coverage)
- `apps/desktop/index.html`, `apps/desktop/public/favicon.svg`, `apps/desktop/app-icon.svg`, `apps/desktop/vite.config.ts`
- `apps/desktop/src/index.css`; `e2e/topbar-focus.spec.ts`; Issue #735, thân PR #760 (Lệch 1–3)
- `apps/desktop/src/routes/SettingsTrash.tsx` (ô tìm), `apps/desktop/src/routes/customers/KycWebSession.tsx` (ô tin nhắn)

##### File / thư mục được phép sửa

- `packages/ui/src/**` + test, `packages/ui/CLAUDE.md`
- `vitest.config.ts`
- `apps/desktop/{index.html,app-icon.svg,public/favicon.svg,vite.config.ts}` (sửa `vite.config.ts` → nhãn `build-exe`)
- `apps/desktop/src/index.css`
- `apps/desktop/src/routes/SettingsTrash.tsx`, `apps/desktop/src/routes/customers/KycWebSession.tsx`: chỉ class viền ô nhập (Owner duyệt ở T-284 G3, 23/10/2026)
- `e2e/{topbar-focus.spec.ts,data-table.spec.ts,theme.spec.ts}`

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-300]**: gộp. Mục khác trùng file (T-299 `Chart` / `PeriodPicker`, T-301 export thừa của `packages/ui`) để lại cho Issue ghi ở nhãn. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Không thêm dependency (G4).
- Token đổi theo bản Owner duyệt; `pnpm lint:tokens` xanh.

##### Test chấp nhận

- [ ] Tương phản viền ô nhập / mũi tên sắp xếp ≥ 3:1 trên theme tối, theme duy nhất (e2e đo màu tính được, hoặc test token); gồm cả hai ô nhập ngoài `packages/ui`.
- [ ] Test thuần cho `sortable: false`, bảng rỗng, `headerHidden`.
- [ ] `pnpm lint:tokens` báo `style={{ flex: 1 }}`.
- [ ] Coverage nhánh `packages/ui/src/**` đạt 100, ngưỡng trong config là 100.
- [ ] e2e:
  - hộp thoại đã cuộn, Shift+Tab về ô bị khuất → ô dừng sát mép trên của hộp;
  - thẻ đưa lên đỉnh ở màn có bộ chọn phạm vi nằm dưới thanh.
- [ ] Bản build có favicon đúng icon của app; không còn bản sao.

Ước lượng: ≈ 80 dòng SP + ≈ 200 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (thêm build exe nếu sửa `vite.config.ts`)
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-300] đã sửa sang RESOLVED

##### Rủi ro

risk:med

##### Bị chặn bởi

#773 (T-284), #788 (T-299), #797 (T-303)

## PR #843 — fix: fields and sort arrows at 3:1, DataTable and TextField logic tested, one favicon, card headings below the bar (T-300)

Trạng thái: MERGED · merge 2026-10-26T08:37:20Z · commit `ff03c8ab970f0191e20a5be0178fea6ddd78bde2` · nhánh `task/T-300-ui-contrast-table-shell` · nhãn: type:task, risk:med

Closes #789

#### Thay đổi

T-300: các mục sổ OPEN gắn **[T-300]** (10 mục, gồm mục `TextField` mà review #838 thêm sau khi viết Issue).

**1. Token tương phản (G3 T-284, PR #795).**
- `packages/ui/src/tokens.css`: `--border-control: #687890`; `theme.css` map thành `border-control` của Tailwind.
- Dùng cho viền `TextField`, `SelectField`, ô ngày Tùy chọn của `PeriodPicker` (trước là `--border`), mũi tên ↕ chưa chọn của `DataTable`, và hai ô ngoài `packages/ui` (chỉ đổi class viền, như Owner duyệt): ô tìm của `SettingsTrash.tsx`, ô "Tin nhắn để copy" của `KycWebSession.tsx`.
- Giữ nguyên `--border` / `--border-strong` cho khung, đường kẻ, trục chart, viền đứt; ô khóa 6f giữ viền đứt `--border-strong` (T-303).
- Số đo e2e trên Edge (WCAG, viền so với màu hai bên, lấy số thấp hơn). Cột "Sau" trùng cột "Sau" của mockup `index.html#contrast`. Cột "Trước" lấy từ mockup; ba dòng có dấu * đã đo lại được khi các ca e2e còn đỏ.

| Thành phần | Nền kề | Trước | Sau |
|---|---|---|---|
| Mũi tên ↕ (`DataTable`, danh sách lịch hẹn) | thẻ bg-1 | 1,76* | 3,97 |
| Ô ngày Tùy chọn (`PeriodPicker`) | ruột bg-2 · màn bg-0 | 1,25 | 3,61 |
| Ô RE của thanh trên cùng (`SelectField`) | bg-0 | 1,88 | 4,25 |
| Họ tên, RE phụ trách của hộp "Khách hàng mới" | ruột bg-0 · hộp bg-1 | 1,76 | 3,97 |
| Ô tìm Thùng rác | ruột bg-0 · thẻ bg-1 | 1,76* | 3,97 |
| Tin nhắn để copy (ChatGPT web) | ruột bg-0 · panel bg-1 | 1,76* | 3,97 |

**2. `DataTable`.**
- Phần thuần tách sang `packages/ui/src/components/table-view.ts`: `tableView` trả tiêu đề từng cột (nút sắp với `aria-sort` + mũi tên, hoặc chữ, ẩn hay không), các dòng hiện và chân bảng (`showMore`). Component chỉ render kết quả đó. `sorts` (cột sắp được trừ khi `sortable: false`) dùng chung cho `enableSorting` của TanStack và cho tiêu đề.
- `headerHidden` ràng bằng kiểu: `ColumnSorting` chỉ cho `headerHidden` khi `sortable: false`. Test kiểu bằng `@ts-expect-error` (như `mock-adapter.test.ts`); đột biến cho phép `headerHidden` ở cột sắp được → `pnpm typecheck` đỏ (TS2578).
- Không thêm thư viện DOM (G4).

**3. `token-guard`.** Miễn trừ `style={{ flex: … }}` chỉ nhận định danh (`cell.met`, `counts[group.key]`), số (`1`, `0.5`, `.5`) bị báo. Doc comment gọn: một dòng cho `TokenViolation`, một đoạn cho `findTokenViolations`. Hai nhánh chưa có test: `token-guard.ts:63` (dòng có cả `//` lẫn `/*`), `compare-cells.ts:37` (hai mốc phụ bằng nhau). Ngưỡng nhánh `packages/ui/src/**` lên 100.

**4. Favicon một nguồn.** `index.html` trỏ thẳng `./app-icon.svg`; Vite đóng gói thành `/assets/app-icon-<hash>.svg` (icon không bao giờ inline). Xóa `public/favicon.svg` (thư mục `public/` không còn gì). Không sửa `vite.config.ts`, nên không cần nhãn `build-exe`.

**5. Thanh trên cùng (`apps/desktop/src/index.css`).**
- `main h2:not(dialog *)` dừng ở `--spacing(21)` (84), mọi phần tử khác của màn vẫn ở `--spacing(20)` (80). Thẻ đưa lên đỉnh bằng tiêu đề nay có mép ở 66,5 trên màn có bộ chọn (thanh 64), trước là 62,5.
- Comment ghi "64 px (`--spacing(16)`)" thay "16", và lý do của mốc tiêu đề.

**6. `TextField` (sổ L91, review #838).** Thêm `help`: dòng cuối dưới ô, hiện cả khi có lỗi hay dòng đọc lại, đọc trong `aria-describedby` cùng dòng trên nó. Các dòng dưới ô và `aria-describedby` cùng sinh từ `fieldNotes` (`field-notes.ts`, có test), nên id đọc luôn khớp dòng đang hiện. Chưa có chỗ nào dùng `help`: T-301 chuyển câu `outcome.caseSizeHelp` của `MetFields.tsx` vào đó (sổ L92).

##### Lệch so với Issue / cần review xem

**1. Ca e2e hộp thoại: ô bị mép trên cắt ngang, không phải ô khuất hẳn.** Đo trên Edge (spec tạm, đã xóa): khi focus phải cuộn một ô vào khung, Chromium **căn giữa** ô khuất hẳn, còn ô bị cắt một phần thì đưa về **mép gần nhất** (cộng `scroll-margin-top`).
- Hộp dài nhất ở 1 100 × 700 là 6c bật "Hẹn lần tiếp theo" (cuộn được 255). Ô khuất hẳn phía trên luôn bị căn giữa và chạm đầu (về `scrollTop` 0), nên có hay không có phần loại trừ đều ra cùng vị trí: ca như vậy không bắt được gì.
- Ca thêm vào: chip "N2" của "Nhóm sau cuộc gặp" bị mép trên cắt ngang, Shift+Tab từ ô "Người đánh giá" → chip dừng sát mép trên của hộp (lệch < 1). Đúng câu của test chấp nhận.
- Đột biến bỏ `:not(dialog, dialog *)` → chip dừng cách mép 79,75, ca đỏ.

**2. Thêm một ca canh ngoài danh sách test của Issue.** Tiêu đề của khung Chi tiết lịch hẹn, khi khung dính dưới thanh (`top-20`), nằm ở 97 (đo ở 1 100 và 1 440) và nhận focus sau khi lưu (DR6-83). Mốc của tiêu đề phải ≤ 97, nếu không trang nhảy khi tiêu đề nhận focus; ca DR6-83 có sẵn chỉ đo khung trống (không phải `h2`).
- Ca mới: trang cuộn 600, focus tiêu đề → trang đứng yên.
- Đột biến `--spacing(25)` (100) → 600 → 597, ca đỏ. `--spacing(24)` (96) vẫn xanh.
- Vậy mốc tiêu đề hợp lệ trên thang là 21–24: phải hơn 81 (thanh 64 + 17 viền và lề của thẻ; vị trí cuộn bị làm tròn nên mép thẻ còn thấp thêm 0,5, như 62,5 ở mốc 80), và ≤ 97. PR lấy 21, gần mốc 80 của phần còn lại nhất.

**3. `help` của `TextField` hiện cả khi có lỗi**, khác `help` của `SelectField` (ẩn khi có lỗi). Lý do: giữ đúng câu Case size hiện nay (luôn hiện, mockup 6d), để T-301 chuyển sang `help` mà màn không đổi. JSDoc ghi rõ.

**4. Hàm đo viền ở `e2e/theme.spec.ts` lặp một phần `lowestContrast` của `e2e/support.ts`** (công thức luminance, cách đọc màu bằng canvas). `support.ts` ngoài danh sách file của Issue nên không gom về đó.

**5. Cỡ:** sản phẩm +147 / −60 (kể cả 8 dòng `favicon.svg` xóa), test và e2e +359 / −4, tài liệu (`packages/ui/CLAUDE.md`, gồm khối codemap) +6 / −4; tổng +512 / −68, dưới ngưỡng ~400 / ~800. Issue ước ≈ 80 + ≈ 200. Phần vượt: hai file thuần mới (`table-view.ts`, `field-notes.ts`) và test của chúng, mục `TextField` thêm sau, các ca e2e đo màu gồm cả hai ô ngoài `packages/ui`, ca canh ở lệch mục 2.

#### Test chấp nhận

- [x] Tương phản viền ô nhập / mũi tên sắp xếp ≥ 3:1 trên theme tối (theme duy nhất): 2 ca e2e ở `e2e/theme.spec.ts` đo màu tính được (bảng trên). Ca thứ hai đo hai ô ngoài `packages/ui`: tin nhắn để copy khi ChatGPT web không copy được, rồi ô tìm Thùng rác sau khi xóa KH vừa tạo. Trước khi sửa, các ca đỏ ở 1,76.
- [x] Test thuần cho `sortable: false`, bảng rỗng, `headerHidden`: `table-view.test.ts` (6 ca + 1 test kiểu).
- [x] `pnpm lint:tokens` báo `style={{ flex: 1 }}` (cả `0.5`, `.5`): `token-guard.test.ts`; app vẫn sạch.
- [x] Coverage nhánh `packages/ui/src/**` 100 % (31 / 31), ngưỡng trong config là 100.
- [x] e2e (`e2e/topbar-focus.spec.ts`):
  - hộp thoại đã cuộn, Shift+Tab về ô bị mép trên che → ô dừng sát mép trên của hộp (lệch mục 1);
  - thẻ đưa lên đỉnh bằng tiêu đề ở màn có bộ chọn phạm vi (Lịch hẹn, thanh 64) nằm dưới thanh: 66,5 ≥ 64, trước khi sửa đỏ (62,5).
- [x] Bản build có favicon đúng icon của app, không còn bản sao: `href` là `/assets/app-icon-<hash>.svg`, nội dung trùng từng byte `apps/desktop/app-icon.svg`, `dist/` không có `favicon.svg`.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`:

- L13 (`DataTable`: chưa có test `sortable: false`, bảng rỗng): đã sửa (`tableView` + test). `cellClass`, `fixed`, `compact`, `width` là class của component, vẫn chỉ e2e phủ (không thêm công cụ test component, G4).
- L15 (`token-guard.ts:26` nhận `flex: 1`; doc comment dài): đã sửa.
- L16 (token G3, viền ô nhập / mũi tên dưới 3:1): đã sửa.
- L31 (`headerHidden` bị bỏ qua ở cột sắp được): đã sửa, ràng bằng kiểu.
- L33 (ngưỡng nhánh `packages/ui` 92): đã sửa, lên 100.
- L41 (chưa ca nào đặt focus trong hộp thoại): đã sửa, cách đo ở lệch mục 1.
- L43 (thẻ đưa lên đỉnh ở màn có bộ chọn nằm dưới thanh 1): đã sửa.
- L44 (NIT "16" → "64 px (`--spacing(16)`)"): đã sửa.
- L91 (`TextField`: thêm `help` vào `aria-describedby`): đã sửa.
- L74 (NIT comment `SettingsTrash.tsx:331`, [T-301]): để lại cho T-301; Issue này chỉ được sửa class viền ô tìm của file đó.
- L87 (`badge` của `MetFields.tsx`, có chỗ ở `SettingsTrash.tsx:54`, [T-301]): để lại cho T-301, cùng lý do.
- L102 (`class="dark"` của `index.html`, export không ai import gồm `TokenViolation`, [T-301]): để lại cho T-301 (#790 được sửa `index.html`, `packages/ui/src/**`); Issue này ghi để lại mục T-301.

Mục không có trong `--diff` vì đường dẫn trong sổ là `public/favicon.svg` (file đã xóa):
- L12 (`public/favicon.svg` là bản sao `app-icon.svg`): đã sửa.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (124 file test, 3 957 test)
- [x] e2e toàn bộ xanh ở local (Home PC): 305 / 305; sau đó gộp hai ca đo màu của `theme.spec.ts` thành một, chạy lại spec đó: 8 / 8
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-300 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #128, #247, #630, #644, #760, #838, mục `DataTable` Phase 1 và token G3 (R4) — T-300 (#789, PR #843, `REVIEW: PASS` @`df24283`):
  - #128, `apps/desktop/index.html`: favicon một nguồn, `<link rel="icon">` trỏ `./app-icon.svg`, Vite đóng gói thành `/assets/app-icon-<hash>.svg` (Vite 8 không inline `<link rel="icon">`); bản sao `apps/desktop/public/favicon.svg` đã xóa. e2e "the tab shows the icon of the app, built from its one source" ở `e2e/theme.spec.ts`: nội dung trùng từng byte `apps/desktop/app-icon.svg`, `dist/` không có `favicon.svg`.
  - Phase 1, `packages/ui/src/components/DataTable.tsx`: phần thuần tách sang `packages/ui/src/components/table-view.ts` (`tableView`: tiêu đề từng cột, dòng hiện, chân bảng; `sorts` dùng chung cho `enableSorting` và tiêu đề). Test `sortable: false`, bảng rỗng, `headerHidden` ở `packages/ui/src/components/table-view.test.ts`. Phần class của component (`cellClass`, `fixed`, `compact`, `width`) vẫn chỉ e2e phủ: chuyển sang ACCEPTED.
  - #247, `packages/ui/src/token-guard.ts`: miễn trừ `style={{ flex: … }}` chỉ nhận định danh (`cell.met`, `counts[group.key]`), số (`1`, `0.5`, `.5`) bị báo; doc comment gọn (một dòng cho `TokenViolation`, một đoạn cho `findTokenViolations`). Test ở `packages/ui/src/token-guard.test.ts`.
  - R4 (token G3, T-284), `packages/ui/src/tokens.css`: `--border-control` #687890 (map `border-control` ở `packages/ui/src/theme.css`) cho viền `TextField`, `SelectField`, ô ngày Tùy chọn của `PeriodPicker`, mũi tên ↕ chưa chọn của `DataTable`, ô tìm Thùng rác (`apps/desktop/src/routes/SettingsTrash.tsx`) và ô "Tin nhắn để copy" (`apps/desktop/src/routes/customers/KycWebSession.tsx`): 3,61–4,25, trùng cột "Sau" của mockup `docs/design/mockups/index.html#contrast`. Hai ca e2e đo màu tính được ở `e2e/theme.spec.ts`.
  - #630, `packages/ui/src/components/table-view.ts` (`ColumnSorting`): `headerHidden` chỉ cho cột `sortable: false`, ràng bằng kiểu; test kiểu `@ts-expect-error` ở `packages/ui/src/components/table-view.test.ts`.
  - #644, `vitest.config.ts`: ngưỡng nhánh của `packages/ui/src/**` lên 100; hai nhánh có test: `packages/ui/src/token-guard.ts:63` (dòng có cả `//` lẫn `/*`), `packages/ui/src/components/compare-cells.ts:37` (hai mốc phụ bằng nhau).
  - #760, `apps/desktop/src/index.css` (`:not(dialog, dialog *)`): ca "Shift+Tab to a field cut by the top edge of a scrolled dialog…" ở `e2e/topbar-focus.spec.ts`. Ca dùng ô bị mép trên cắt ngang, vì Chromium căn giữa ô khuất hẳn nên ca ô khuất hẳn không bắt được gì (thân PR #843, lệch 1). Bỏ phần loại trừ thì ô dừng cách mép 79,75, ca đỏ.
  - #760, `apps/desktop/src/index.css`: `main h2:not(dialog *)` dừng ở `--spacing(21)` (84), nên thẻ đưa lên đỉnh bằng tiêu đề ở màn có bộ chọn (thanh 64) có mép ở 66,5. Ca "a card brought to the top by its heading, on a screen with the scope picker…" và ca tiêu đề khung Chi tiết lịch hẹn dính dưới thanh (mốc ≤ 97) ở `e2e/topbar-focus.spec.ts`. Review đo cả ba Góc nhìn: thanh cao như nhau.
  - #760 NIT, `apps/desktop/src/index.css`: comment ghi "64 px (`--spacing(16)`)", kèm lý do mốc của tiêu đề.
  - #838, `packages/ui/src/components/TextField.tsx`: prop `help`, dòng cuối dưới ô, hiện cả khi có lỗi hay dòng đọc lại, đọc trong `aria-describedby`. Các dòng dưới ô và id cùng sinh từ `fieldNotes` (`packages/ui/src/components/field-notes.ts`, test ở `packages/ui/src/components/field-notes.test.ts`). Chưa chỗ nào dùng: phần app (`MetFields.tsx`) ở OPEN [T-301].

---

# Issue #790 — T-301: Dọn app: mã chết và hằng lặp (DR6-66, DR6-67 phần app), ký hiệu viết cứng (DR6-37)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

Dọn phần app còn lại của DR6-66 / DR6-67 và DR6-37. Issue cuối của đợt, vì chạm nhiều màn.

1. **DR6-66, phần app / ui:** bỏ hoặc thu hẹp:
   - `PersistQueue.unsaved()`;
   - `markName` (Báo cáo);
   - export không ai import: `ConfirmProposal`, `TokenReader`, `ShowMoreFoot`, `TokenViolation`;
   - `class="dark"` không tác dụng của trang app;
   - khóa `birth.error.empty` không tới được;
   - `PLAIN_SLOTS` chỉ test dùng.
2. **DR6-67, phần app:**
   - hằng class `CARD` / `ALERT` / `LINK` khai một nơi, các màn import lại;
   - 17 cột báo cáo khai một lần, dùng cho bảng Báo cáo, file Excel và `reportCells`.
3. **DR6-37:** dấu / ký hiệu viết cứng trong JSX qua `sep.*` / khóa i18n:
   - `✓` / `○` và hai chỗ `join(', ')` ở thẻ KYC;
   - `×` ở hộp lịch hẹn;
   - `▾` / `▸` ở So sánh team.

##### Bối cảnh

Owner 23/10: sửa hết sổ OPEN trước v1.0 (#771), duyệt kế hoạch T-283…T-301. Issue này gom các mục OPEN gắn **[T-301]**: phần app / ui của DR6-66, DR6-67 và DR6-37. Lượt 1 Owner 15/10 hoãn; 23/10 đổi thành sửa trước v1.0.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-301]
- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §8.5 (DR6-37, DR6-66, DR6-67); vị trí: `docs/reviews/raw/2026-10-15/home-pc/claude/A.md`
- `.claude/rules/i18n-ui.md`
- `apps/desktop/src/data/persist-queue.ts`; `apps/desktop/src/i18n/{index.ts,vi.ts}`; `apps/desktop/index.html`
- `apps/desktop/src/routes/reports/{ReportTable.tsx,report-workbook.ts,reports-view.ts}`; `apps/desktop/src/routes/appointments/appointments-view.ts` (`CARD`, `LINK`)
- `apps/desktop/src/routes/customers/CustomerKyc.tsx`; `apps/desktop/src/routes/appointments/AppointmentDialog.tsx`; `apps/desktop/src/routes/overview/TeamCompare.tsx`
- `packages/ui/src/index.ts` và các file export `TokenReader`, `ShowMoreFoot`, `TokenViolation`

##### File / thư mục được phép sửa

- `apps/desktop/src/**` (các file nêu ở mục 1–3 và các màn đang khai lại `CARD` / `ALERT` / `LINK`) + test
- `apps/desktop/index.html`
- `packages/ui/src/**` (export thừa) + test
- `apps/desktop/CLAUDE.md`, `packages/ui/CLAUDE.md` (khối codemap)
- `e2e/**` (nếu nhãn / chữ đổi)

##### Ghi chú OPEN liên quan

Mọi mục OPEN gắn **[T-301]**: gộp. Mục khác trùng file để lại cho Issue ghi ở nhãn. Lúc làm Issue này, các Issue khác của đợt nên đã merge. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Không đổi hành vi hay chữ người dùng thấy, trừ ký hiệu nay đi qua i18n với cùng chữ.
- File Excel giữ đúng 17 cột, thứ tự, định dạng.

##### Test chấp nhận

- [ ] Không còn export / khóa / hằng lặp trong danh sách (rg ghi trong PR).
- [ ] `pnpm verify` + e2e xanh.
- [ ] Bảng Báo cáo và file Excel lấy cột từ một định nghĩa (test so tên / thứ tự cột).
- [ ] Không còn ký hiệu viết cứng trong JSX ở các chỗ DR6-37 (rg trong PR).

Ước lượng: ≈ 250 dòng SP (phần lớn là xóa / dời) + ≈ 100 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-301] đã sửa sang RESOLVED

##### Rủi ro

risk:med

##### Bị chặn bởi

#789 (T-300)

## PR #845 — refactor: shared class names, one list of report columns, marks through i18n (T-301, 1/2)

Trạng thái: MERGED · merge 2026-10-26T13:36:40Z · commit `5abef686a6cdd1be2f6f571fe9de944a93659294` · nhánh `task/T-301-cleanup` · nhãn: type:task, risk:med

Refs #790

PR 1 / 2 của T-301 (`risk:med`). PR này dọn code, không đổi hành vi: phần app / ui của DR6-66, DR6-67, DR6-37 và sáu mục đổi tên / dời của sổ. PR 2 / 2 xếp trên PR này, làm 18 ghi chú review còn lại (hành vi, trợ năng, test) và đóng #790. Owner 26/10 chọn tách hai PR xếp chồng.

#### Thay đổi

- **DR6-66, export / khóa thừa:**
  - Bỏ `PersistQueue.unsaved()`; test đọc `status()` (`saving` / `failed`) thay. Sau review: hai ca `flush()` kiểm thêm một lần `flush()` sau không ghi gì (mục "Sửa theo review").
  - Bỏ `export` của bốn tên không file nào import: `markName` (`reports-view.ts`), `ConfirmProposal` (`KycExtraction.tsx`), `TokenReader` (`chart-theme.ts`), `TokenViolation` (`token-guard.ts`). `ShowMoreFoot` giữ export vì nay `table-view.ts` import (PR #843).
  - Bỏ `class="dark"` của `index.html`: không nơi nào dùng `dark:` / `.dark`; chế độ tối là `color-scheme: dark` + token. CSS build chỉ còn biến `--lightningcss-dark` của `color-scheme`, không liên quan tới class.
  - Bỏ khóa `birth.error.empty`: kiểu lỗi của `parseBirthDate` không còn `'empty'`, vì chữ rỗng là "không có ngày sinh". Nhánh `'empty'` của `parseQuickDate` không tới được, nên đọc là `'format'`, có comment.
  - Dời `PLAIN_SLOTS` từ `i18n/index.ts` vào `i18n/index.test.ts`, nơi duy nhất đọc nó.
  - `REPORT_STAGES` cũng thôi export: test "Σ RE = team" nay đọc `REPORT_COLUMNS`.
- **DR6-67, code lặp:**
  - `apps/desktop/src/routes/classes.ts` khai một lần `FOCUS`, `CARD`, `SETTINGS_SECTION` (thẻ Cài đặt), `PANEL` (khối Tổng quan / Báo cáo), `ALERT`, `LINK`. Các màn (và thanh bên, sau review) import lại, thay vì khai lại, viết lại chuỗi hay import từ `appointments-view.ts` / `CustomerDialogs.tsx`.
  - Biến thể ghép thêm class: `${ALERT} border-danger text-danger`, `${LINK} text-xs`, `${SETTINGS_SECTION} flex flex-col gap-3 text-sm`; sau review `${LINK} self-start text-sm`, `${LINK} tabular-nums`, `… ${FOCUS}`. Mỗi chỗ vẫn đúng tập class cũ.
  - Hai chỗ khác giá trị giữ tên riêng: thẻ cột kanban `p-3` của Khách hàng (`STAGE_CARD`), link tên KH của khối đã đóng (không màu accent: `truncate rounded-sm hover:underline ${FOCUS}`).
  - Một khác biệt không thấy được: link `<a>` của Khách hàng, và sau review ba `<a href>` (Quay lại của hồ sơ, "Hồ sơ KH →" của chi tiết lịch hẹn, link sang hồ sơ của khối AI), nay có `cursor-pointer` như mọi `LINK`; con trỏ của `<a href>` vốn đã là pointer.
  - `REPORT_COLUMNS` (`reports-view.ts`) khai 17 cột báo cáo một lần: nhóm, nhãn, định dạng Excel, số cho Excel, chữ trên màn.
    - `reportCells`, `ReportTable` (tiêu đề, nhóm, vạch đầu nhóm, màu tiêu đề) và file Excel (tiêu đề, nhóm gộp ô, `numFmt`) cùng đọc danh sách này.
    - `REPORT_GROUPS` (5 · 6 · 6) suy từ danh sách, thay `GROUPS` / `GROUP_STARTS` viết tay.
    - Tỉ lệ chốt: Excel vẫn giữ phân số, màn vẫn dùng `closeRateText`.
- **DR6-37, ký hiệu viết cứng:**
  - `✓` / `○` / `!` của thẻ KYC, `×` của chip người phối hợp, `▾` / `▸` của So sánh team nay là khóa `vi.ts`, cùng ký tự (đã so mã: U+2713, U+25CB, U+00D7, U+25BE, U+25B8).
  - Hai `join(', ')` của thẻ KYC dùng `sep.list`.
  - `findHardcodedSeparators` (`token-guard.ts`, chạy trong `pnpm lint:tokens`) nay chặn các ký hiệu này (luật `hardcoded-mark`) và `.join(', ')` / `.join('; ')`. Chạy luật mới trên ba file ở `main`: bắt đủ 7 chỗ.
  - Sau review: `—` của `outcomeText` (dịch chuyển không có nhóm trước) lấy từ `appointments.none`, và luật `hardcoded-mark` chặn cả `—` (U+2014).
- **Đổi tên / dời (các mục sổ):**
  - L75: `badge` của `MetFields.tsx` → `stageBadge` ở `routes/stage-badge.tsx`. 8 file dùng cũ và 5 chỗ dựng `StageBadge` tay (`CustomersScreen.tsx` ×2, `StageBlock.tsx`, `RestoreDialog.tsx`, `SettingsTrash.tsx`) cùng dùng.
  - L88: `HeaderCell.kind` `'sort' | 'text'` → `'button' | 'label'`.
  - L53: `SAVE_MEASURES` → `MAX_SAVE_MEASURES`.
  - L87: `lowestContrast(area, 'border')` (`e2e/support.ts`) thay `borderContrast` của `theme.spec.ts`. Cùng cách đọc màu, nay tính cả `opacity` của khối cha.
  - L73: bỏ khuôn `appointments.moveRf`. `outcomeText` ghép `appointments.move` với `appointments.rf` bằng `joinParts`; ô RF của thẻ Lịch hẹn trong hồ sơ ghép cùng các phần đó, RF tô accent. `customer.rf` gộp vào `appointments.rf`.
  - L74: `writtenDay` (`appointment-form.ts`) trả chữ ngày và cờ có ghi năm; `dayText` đọc từ đó. Ô ngày của thẻ Lịch hẹn không tự so năm nữa.
- **Ngoài danh sách file của Issue:**
  - `packages/ui/scripts/check-tokens.ts`, hai dòng comment và câu báo lỗi theo luật mới của `token-guard.ts`;
  - sau review, `apps/desktop/src/shell/Sidebar.tsx` (vỏ, không phải màn): link của thanh bên lấy `FOCUS` thay chuỗi viết tay, một dòng import.
- **Cỡ:** +560 / −460 không tính khối codemap (SP +369 / −382, test kể cả e2e +188 / −75), net +100. Vòng sửa theo review thêm SP +35 / −43, test +28 / −8. Vượt ngưỡng ~400 / ~800 vì:
  - ≈ 30 màn đổi dòng import (hằng class, `stageBadge`), mỗi chỗ tính một dòng − và một dòng +;
  - `PLAIN_SLOTS` dời sang test, 63 dòng tính hai lần;
  - 17 cột báo cáo viết lại một lần ở ba file.

  Hai PR đã là cách tách Owner chọn: PR này chỉ dời / đổi tên, PR 2 / 2 đổi hành vi.

#### Sửa theo review `ab7e6e7` (REVIEW: CHANGES)

- **[chặn] Test của hàng đợi lưu không còn kiểm bản chụp lỗi bị bỏ** (commit `1976a66`, chỉ sửa test, theo gợi ý của review):
  - Cuối hai ca `flush()` của `persist-queue.test.ts` ("writes the latest snapshot again after a failed write, and only once", "leaves a newer running write last on disk, never the snapshot that failed") gọi thêm một lần `flush()` (đóng exe, Nạp lại), rồi kiểm `disk.started` không đổi: `['v1', 'v1']` và `['v1', 'v2']`; ca thứ hai kiểm cả trên đĩa còn `v2`.
  - `fakeDisk().finishAll()` cho mọi lần ghi chạy xong, kể cả lần ghi sai thêm vào, nên ca đỏ ngay thay vì treo tới hết giờ. Vòng lặp cũ của ca thứ hai dùng chung hàm này.
  - Đột biến của review (bỏ `lost = undefined;`, `persist-queue.ts:95`): 2 ca đỏ, `started` = `v1, v1, v1` và `v1, v2, v1`; trả lại thì 12 / 12 xanh.
- **Ba mục không chặn, anh chọn sửa luôn trong PR này (26/10)** (commit `df35e3c`, không đổi hành vi):
  - `'—'` viết cứng ở `outcomeText` (`appointments-view.ts:71`): nay là `t('appointments.none')`, khóa "—" của màn Lịch hẹn mà chi tiết lịch hẹn đã dùng. Luật `hardcoded-mark` chặn thêm `—`: ca test mới đỏ khi thiếu `—` trong luật; chạy luật trên file cũ bắt đúng dòng 71. Ngoài comment, app không còn chỗ nào viết `—` (`pnpm lint:tokens` sạch).
  - `LINK` / `FOCUS` còn viết tay:
    - ba `<a href>` review nêu dùng `LINK`: `CustomerProfile.tsx` (Quay lại, `${LINK} self-start text-sm`), `AppointmentsScreen.tsx` ("Hồ sơ KH →", như trên), `AppointmentAi.tsx` (`LINK`);
    - thêm nút ngày của lịch hẹn dời từ / dời sang trong chi tiết (`AppointmentsScreen.tsx`): đúng tập class của `LINK` cộng `tabular-nums`, nay `${LINK} tabular-nums`;
    - chuỗi `FOCUS` viết tay ở 6 chỗ review nêu (`CustomersScreen.tsx`, `KycHistory.tsx`, `TeamCompare.tsx`, `Settings.tsx`, `SettingsTrash.tsx`, `team/TeamScreen.tsx`) và ở link của thanh bên (`shell/Sidebar.tsx`) nay ghép `${FOCUS}`. `rg -n "focus-visible:outline-2 focus-visible:outline-accent" apps/desktop/src` chỉ còn `classes.ts:8`;
    - để lại: hai link trong câu của `KycIntelligence.tsx` (`text-accent hover:underline`, vòng focus mặc định của trình duyệt). Khác giá trị: đổi sang `LINK` là đổi vòng focus, tức đổi hành vi.
  - `SECTION` → `SETTINGS_SECTION` (`classes.ts` và năm file Cài đặt); tên cũ đứng cạnh `SECTIONS` / `Section` (các mục của Cài đặt) trong `Settings.tsx`.
- **Để lại, như review ghi:** cỡ PR → bảng "Kích thước PR vượt ngưỡng" của `docs/metrics/phase-6.md` **[G7]**.

#### Test chấp nhận

- [x] Không còn export / khóa / hằng lặp trong danh sách:
  ```
  $ rg -n "unsaved\(|export (function|const) markName|export type (ConfirmProposal|TokenReader)|export interface TokenViolation|class=\"dark\"|birth\.error\.empty|PLAIN_SLOTS" apps/desktop/src apps/desktop/index.html packages/ui/src --glob '!*.test.*'
  (không có dòng nào)
  $ rg -n "const (CARD|ALERT|LINK|FOCUS)\b" apps/desktop/src
  apps/desktop/src/routes/classes.ts:8:export const FOCUS = …
  apps/desktop/src/routes/classes.ts:11:export const CARD = …
  apps/desktop/src/routes/classes.ts:20:export const ALERT = …
  apps/desktop/src/routes/classes.ts:23:export const LINK = …
  $ rg -n "const [A-Z_]*(COLUMNS|GROUPS)\b" apps/desktop/src/routes/reports
  apps/desktop/src/routes/reports/reports-view.ts:357:export const REPORT_COLUMNS …
  apps/desktop/src/routes/reports/reports-view.ts:391:export const REPORT_GROUPS …
  ```
- [x] `pnpm verify` + e2e xanh (304 / 304 ở local, `ab7e6e7` và sau review `df35e3c`).
- [x] Bảng Báo cáo và file Excel lấy cột từ một định nghĩa. Test `report-workbook.test.ts` "has the columns and groups of the table on screen, in its order" render `ReportTable` rồi so tên / thứ tự cột và nhóm (chữ, số cột gộp) với sheet Excel; tiêu đề tiền chỉ khác "(₫)".
  - Test xanh cả trên code cũ, vì giữ hợp đồng chứ không giữ cách làm.
  - Đột biến: đổi chỗ hai cột chỉ ở bảng màn thì test đỏ.
  - Các test cũ của `reportCells` và file Excel (giá trị, `numFmt`, ô trống của "—") giữ nguyên, xanh.
- [x] Không còn ký hiệu viết cứng ở các chỗ DR6-37:
  ```
  $ rg -n "[✓○×▾▸]|join\(', '\)" apps/desktop/src --glob '!**/i18n/**' --glob '!*.test.*'
  apps/desktop/src/routes/customers/CustomerProfile.tsx:177:      {/* … 1 440 × 900 window … */}   (comment)
  ```
  `pnpm lint:tokens` (luật mới) sạch, và luật này giữ cho các ký hiệu không quay lại. Sau review luật chặn cả `—`.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `df35e3c` (như @ `ab7e6e7`), 22 mục "Trùng file":

- L53 `app-data.ts` [T-301]: đã sửa (`MAX_SAVE_MEASURES`).
- L73 `CustomerAppointments.tsx`, `vi.ts` [T-301]: đã sửa (bỏ khuôn `moveRf`; thẻ và `outcomeText` ghép cùng phần).
- L74 `CustomerAppointments.tsx`, `appointment-form.ts` [T-301]: đã sửa (`writtenDay`).
- L75 `MetFields.tsx`, … [T-301]: đã sửa (`stageBadge` ở `routes/stage-badge.tsx`, 13 chỗ cùng dùng).
- L87 `theme.spec.ts`, `support.ts` [T-301]: đã sửa (`lowestContrast(area, 'border')`).
- L88 `table-view.ts`, `DataTable.tsx` [T-301]: đã sửa (`'button' | 'label'`).
- L90 DR6-37 [T-301]: đã sửa.
- L92 DR6-66 phần app / ui [T-301]: đã sửa.
- L94 DR6-67 phần app [T-301]: đã sửa.
- L48, L49 `app-data.ts`, `SettingsDataFile.tsx`, `Sidebar.tsx` [T-301]: để lại cho PR 2 / 2 (`lastSave`, `useSaveStatus`).
- L61 `vi.ts` (`restoreView`) [T-301]: để lại cho PR 2 / 2.
- L62 `SettingsTrash.tsx` [T-301]: để lại cho PR 2 / 2.
- L67 `KycDialogs.tsx` [T-301]: để lại cho PR 2 / 2.
- L72 `PolicyDialogs.tsx`, `MetFields.tsx` [T-301]: để lại cho PR 2 / 2 (FYP dưới 1 triệu).
- L76, L77 `AppointmentsScreen.tsx` [T-301]: để lại cho PR 2 / 2.
- L79 `MetFields.tsx` [T-301]: để lại cho PR 2 / 2.
- L82, L84, L85 `StageBlock.tsx` [T-301]: để lại cho PR 2 / 2 (mô tả chart theo cách Owner chọn 26/10).
- L83 `PersonDialogs.tsx` [T-301]: để lại cho PR 2 / 2 (nút riêng trong dòng hỏi, Owner chọn 26/10).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (sau review: 124 file, 3 960 test)
- [x] `pnpm e2e` đầy đủ xanh ở local: 304 / 304 (`ab7e6e7`); sau review 304 / 304 (`df35e3c`)
- [x] Không thêm dependency ngoài ADR-0005
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #846 — fix: chart described by its last numbers, delete person asks with a button of its own, review notes (T-301, 2/2)

Trạng thái: MERGED · merge 2026-10-26T15:51:38Z · commit `1fd8e9e70adc77148d470f2ecc97f3fb680ef291` · nhánh `task/T-301-review-notes` · nhãn: type:task, risk:med

Closes #790

PR 2 / 2 của T-301 (`risk:med`). PR 1 / 2 #845 đã merge ngày 26/10, nên base nay là `main`; nhánh đã merge `main` (có sổ của #847). PR này làm 18 ghi chú review còn lại của sổ [T-301], gồm thay đổi hành vi, trợ năng và test, cộng một ghi chú của review #845 mà Owner 26/10 gộp vào PR này (vòng focus của hai link trong câu). Hai mục làm theo cách Owner chọn ngày 26/10 (chart N4–N1, nút "Xóa nhân sự"); tên nút khôi phục KH theo quyết định Owner ngày 25/10.

#### Thay đổi

- **Chart N4–N1 (L78, L80, L81):**
  - Owner 26/10 chọn: mô tả của chart là một dòng ẩn, `stageChartSummary` (`stage-chart.ts`, thuần, có test). Dòng này đọc mốc cuối có số liệu như dòng của nó trong bảng, rồi chỉ sang bảng. Ví dụ: "15/09/2026 · cuối ngày: N4 … · N3 … · N2 … · N1 … · Tổng …. Số liệu từng mốc ở bảng ngay sau."
  - Dòng mô tả là `<span hidden>`: chỉ được đọc kèm hình, không đọc lại như chữ khi duyệt.
  - Bảng `sr-only` giữ nguyên để duyệt mọi mốc.
  - Chart chưa có số thì không có mô tả, vẫn hiện "Kỳ chưa bắt đầu" như cũ.
  - Hậu tố id `-head` / `-body` và `numbersOf` bỏ hẳn: mục L81 không còn đối tượng.
  - e2e `chart.spec.ts` (L80): ngoài `toHaveAccessibleDescription` (accname Playwright tự tính), ca này đọc mô tả từ cây truy cập của chính Chromium (CDP `Accessibility.getFullAXTree`) và đòi đúng nguyên dòng tóm tắt, ở kỳ Tháng mặc định (30 mốc). Bản cũ trỏ vào cả bảng thì Chromium dừng ở khoảng mốc thứ 7.
- **"Xóa nhân sự" của hộp Sửa (L79):**
  - Owner 26/10 chọn: dòng hỏi có nút riêng "Bỏ thay đổi và xóa nhân sự". "Xóa nhân sự" giữ tên; bấm lại hay bấm đúp chỉ hỏi lại.
  - Focus không tự nhảy sang nút đi tiếp, để Enter hai lần không vừa hỏi vừa xóa.
  - e2e: bấm đúp → vẫn ở hộp Sửa, thay đổi còn, nút "Xóa nhân sự" còn.
- **Tên nút khôi phục KH (L58):** "Khôi phục KH <tên> · <nhóm>", nhóm bằng chữ của huy hiệu, theo quyết định Owner 25/10, ngoại lệ cho câu "không đổi chữ người dùng thấy" của #790. Test thêm ca hai KH cùng tên khác nhóm; hai ca e2e dò nút theo tên mới.
- **FYP dưới 1 triệu (L71):**
  - `amountRead` (`routes/money-view.ts`, có test) là cách đọc số tiền dùng chung của case size (6c / 6d), trường tiền của KYC (7b / 7c) và FYP (8a / 8b).
  - FYP "500k" nay đọc "500.000 ₫" thay vì "500.000 ₫ (500.000 ₫)".
  - Ba khóa `{amount} ({compact})` gộp thành `money.read`.
  - e2e `customer-policies.spec.ts` kiểm FYP "500k".
- **Trợ năng:**
  - L72: ô hôm nay không bấm được (`role="img"`, ngoài tháng / ngoài khoảng Tùy chọn) có `aria-current="date"` như ô bấm được.
  - L73: "Dời từ" / "Dời sang" trong khung Chi tiết đưa focus đi như sau khi lưu hộp: về tiêu đề của lịch vừa hiện, hay về dòng báo lịch nằm ngoài góc nhìn khi RE của lịch đó ngoài góc nhìn (sửa theo review #846, mục dưới). Dòng chứa nút bị gỡ; trước đây focus rơi về `body`.
  - L75: hai câu help của hộp Kết quả (Case size, người đánh giá) thành `help` của `TextField` / `SelectField`, nên là phần mô tả của ô. Vị trí và khoảng cách trên màn như cũ.
  - L83 (review #845, Owner 26/10 gộp vào PR này): hai link trong câu của `KycIntelligence.tsx` ("Xem ở Dữ kiện KYC →" khi cổng chặn vì mâu thuẫn, "Cài đặt → AI" của lỗi `AI_NO_KEY`) dùng `LINK` của `routes/classes.ts`: vòng focus accent như mọi link của app, thay vòng mặc định của trình duyệt. e2e `customer-ai.spec.ts` tới hai link bằng bàn phím (Shift+Tab rồi Tab) và đòi vòng nét liền màu accent; đỏ trên code cũ (`outline-style` là `auto`).
- **Vỏ app, lưu file:**
  - L42: chỉ `main.tsx` phân biệt exe / web. `AppShell` nhận `appWindow` từ `App`; `AppWindow` (`CloseGuard.tsx`) thêm `setTitle`. `AppShell` không còn import `@tauri-apps/api`.
  - L48: bỏ `AppData.lastSave()` / `subscribeLastSave`; Cài đặt → Dữ liệu đọc `lastSave` từ `useSaveStatus()`.
  - L49: hook `useSaveStatus()` (`AppDataContext.tsx`) thay bốn chỗ `useSyncExternalStore(saves.subscribe, saves.status)`. Dòng bản web của Cài đặt → Dữ liệu dùng `WEB_MODE` của `Sidebar.tsx` (chấm + câu) thay vì viết lại.
- **Thùng rác:**
  - L59: `purgePlan` đếm bằng `trashCounts(going)`. Comment ghi đúng: cùng số với lệnh dọn, `kept` theo thứ tự danh sách. Test so `counts` và tập `kept` (không theo thứ tự) với `previewPurge`.
  - L60: dòng "Trạng thái" của hộp khôi phục HĐ dùng `policyStatusText`; khóa `trash.restore.issued` nhận slot `{status}`. Chữ trên màn không đổi (test cũ giữ nguyên).
  - L61: comment "The plan of every row, whatever the filter (TR-11)".
- **L66:** hộp 7a báo dữ kiện bị từ chối bằng `refusalText(field, raw)` như hộp 3f, cả khi `normalizeKycValue` từ chối lẫn khi preview `refused`.
- **e2e không đỏ được (L50, L67):**
  - `save-state.spec.ts`: trước lần bấm "Thử lại" đầu, đặt `failSaves = 'DISK_FULL'` và chờ dải đổi sang câu ổ đầy.
  - `customer-ai.spec.ts`: sau khi thấy lỗi, sang Cài đặt rồi quay lại, panel không còn `alert`.
  - Kiểm bằng đột biến:
    - "Thử lại" gọi `saves.idle()` thay `flush()` → `save-state` đỏ ở câu ổ đầy;
    - bỏ effect `drop` của `use-ai-job.ts` → `customer-ai` đỏ ở `alert` còn lại.
- **Ngoài danh sách file của Issue** (hệ quả của quyết định Owner):
  - `docs/testing/nghiem-thu-v1.md`: ô kết quả NT-TM-18 theo nút riêng (mã dòng giữ nguyên);
  - `docs/user-guide/02-tong-quan.md`: câu về trình đọc màn hình theo mô tả mới;
  - `packages/ui/src/components/Chart.tsx`: JSDoc của `describedBy` (có trong danh sách: `packages/ui/src/**`).
- **Cỡ:** so với `main`, +453 / −216 không tính khối codemap (SP +217 / −162, test kể cả e2e +234 / −52, tài liệu +2 / −2), trong ngưỡng. Vòng sửa theo review #846 (`00fe30b..0f0c281`): +136 / −37.

#### Sửa theo review #846 (vòng 1, `REVIEW: CHANGES` @`00fe30b`)

- **[chặn] L73, lịch đích nằm ngoài góc nhìn** (`5a2764a`):
  - Effect focus sau "Dời từ" / "Dời sang" đi theo chuỗi `toDetail()` (tiêu đề → dòng ngoài góc nhìn → khung Chi tiết), như các hộp sau khi lưu (`DialogFocusFallback`). `toDetail` thành `useCallback` chỉ đọc ref, nên nằm được trong deps của effect mà effect không chạy lại mỗi lần vẽ.
  - Dòng ngoài góc nhìn có câu riêng khi chỉ đi theo link: `appointments.linkedOutside` "Lịch hẹn {date} do {re} phụ trách. RE này nằm ngoài góc nhìn hiện tại nên lịch không hiện ở đây; đổi góc nhìn để xem." Ba đường của hộp (tạo lịch, Dời lịch, hộp Kết quả) vẫn là "Đã tạo lịch hẹn…". State `hiddenCreated` thành `outOfSight` (`{ appointment, linked }`); chỉ link của khung Chi tiết gọi `show(appointment, true)`.
  - e2e mới "by the keyboard, a reschedule link to an appointment out of sight…" (`e2e/appointments.spec.ts`): góc nhìn Team Sao Mai, dời một lịch Dự kiến sang 02/10, Sửa hồ sơ KH sang RE của team khác (lịch mới đi theo, lịch cũ ở lại); Enter ở "Dời sang" → focus ở dòng, câu "Lịch hẹn 02/10/2026 do <RE mới> phụ trách…"; đổi sang team của RE mới, Enter ở "Dời từ" → focus ở dòng, câu nêu RE cũ. Đỏ trên `00fe30b` theo thứ tự: câu "Đã tạo lịch hẹn…", rồi (sau khi sửa câu) focus không ở dòng.
- **Mùi code (không chặn), `stage-chart.ts`** (`0f0c281`): hàm riêng `lastNumbers` lấy mốc cuối có số liệu từ dòng của `stageChartTable`; `stageChartSummary` và `stageChartLastText` (mới: chữ cạnh tên team của mockup 1b, không có Tổng) cùng đọc nó. `lastText` của `StageBlock.tsx` bỏ. Unit `stageChartLastText`: các nhóm đang hiện, mốc cuối có số khi có hai mốc, chuỗi rỗng khi chưa có số.

#### Test chấp nhận

Test chấp nhận của #790 phần lớn đã làm ở PR #845 (rg export / hằng / ký hiệu, 17 cột). PR này thêm test cho từng ghi chú:

- [x] `stageChartSummary` (unit): mốc cuối có số, các nhóm đang hiện, `null` khi chưa có số. e2e: mô tả của Chromium (CDP) đúng nguyên dòng; bảng còn đủ 30 mốc; dòng hôm nay = 4 ô + Tổng.
- [x] e2e Team: bấm đúp "Xóa nhân sự" khi có thay đổi chỉ hỏi; "Bỏ thay đổi và xóa nhân sự" mở 9b. Đỏ trên code cũ: nút đổi tên.
- [x] `restoreLabel` (unit): KH có nhóm; hai KH cùng tên khác nhóm có hai tên nút khác nhau.
- [x] `amountRead` (unit): dưới 1 triệu chỉ dạng đầy đủ. e2e: FYP "500k" → mô tả "500.000 ₫".
- [x] e2e: ô hôm nay ngoài khoảng Tùy chọn có `aria-current="date"` (đỏ trên code cũ); focus về tiêu đề sau "Dời từ" (click) và "Dời sang" (Enter) (đỏ trên code cũ); hai câu help nằm trong mô tả của ô (đỏ trên code cũ).
- [x] e2e: hai link trong câu của KYC Intelligence, tới bằng bàn phím, có vòng focus của app (nét liền, accent); đỏ trên code cũ.
- [x] e2e (review #846): "Dời sang" / "Dời từ" tới lịch có RE ngoài góc nhìn → focus ở dòng báo, câu "Lịch hẹn … do … phụ trách…", không nói "Đã tạo"; đỏ trên `00fe30b`. Ca "Đã tạo lịch hẹn…" của hộp (NT-LH-20, DR6-83) giữ nguyên và xanh.
- [x] `stageChartLastText` (unit, review #846): chữ cạnh tên team cùng đọc mốc cuối có số với `stageChartSummary`.
- [x] `pnpm verify` + e2e xanh.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `0f0c281` (base `main`, sau khi merge `main` có sổ #847: số dòng là của sổ mới; vòng sửa theo review #846 không thêm file), 25 mục "Trùng file":

- L42 `AppShell.tsx`, `App.tsx`, `CloseGuard.tsx` [T-301]: đã sửa.
- L48 `app-data.ts`, `SettingsDataFile.tsx` [T-301]: đã sửa.
- L49 `SaveWarning.tsx`, `CloseGuard.tsx`, `Sidebar.tsx`, `AppDataContext.tsx`, `SettingsDataFile.tsx` [T-301]: đã sửa (`useSaveStatus`, `WEB_MODE`).
- L50 `e2e/save-state.spec.ts` [T-301]: đã sửa.
- L58 `trash-view.ts`, `trash-view.test.ts` [T-301]: đã sửa.
- L59 `trash-view.ts` [T-301]: đã sửa.
- L60 `trash-view.ts`, `vi.ts` [T-301]: đã sửa.
- L61 `SettingsTrash.tsx` [T-301]: đã sửa.
- L66 `KycDialogs.tsx` [T-301]: đã sửa.
- L67 `e2e/customer-ai.spec.ts` [T-301]: đã sửa.
- L71 `PolicyDialogs.tsx`, `kyc-view.ts`, `MetFields.tsx` [T-301]: đã sửa.
- L72, L73 `AppointmentsScreen.tsx` [T-301]: đã sửa (L73 cả ca lịch đích có RE ngoài góc nhìn, theo review #846).
- L75 `MetFields.tsx` [T-301]: đã sửa.
- L78, L80, L81 `StageBlock.tsx`, `e2e/chart.spec.ts` [T-301]: đã sửa (cách Owner chọn 26/10; L81 hết đối tượng).
- L79 `PersonDialogs.tsx` [T-301]: đã sửa (cách Owner chọn 26/10).
- L83 `KycIntelligence.tsx` [T-301] (review #845, Owner 26/10 gộp vào PR này): đã sửa (`LINK` cho hai link).
- L84 `KycIntelligence.tsx` [G7] (review #845, `HEADING` / `BADGE`): để lại cho PR nhỏ ở G7 (Owner 26/10). PR này chỉ đổi hai link của file đó.
- L34, L46, L53, L63, L68 `nghiem-thu-v1.md` [G7]: để lại cho PR docs nghiệm thu G7. PR này chỉ sửa ô kết quả của NT-TM-18.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] `pnpm e2e` đầy đủ xanh ở local: 304 / 304 (`2dc0fa7`); sau khi merge PR 1 / 2 đã sửa theo review (`fd24f3b`) 304 / 304, `pnpm verify` xanh (125 file, 3 964 test). Merge chỉ xung đột ở dòng import của `SettingsDataFile.tsx` (`WEB_MODE` của PR này cạnh tên mới `SETTINGS_SECTION`), giữ cả hai.
- [x] Sau khi merge `main` (chỉ sổ #847 đổi) và sửa L83 (`00fe30b`): `pnpm verify` xanh (125 file, 3 964 test), `pnpm e2e` đầy đủ 304 / 304.
- [x] Sau khi sửa theo review #846 (`0f0c281`): `pnpm verify` xanh (125 file, 3 966 test), `pnpm e2e` đầy đủ 305 / 305.
- [x] Không thêm dependency ngoài ADR-0005
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-301 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #807, #817, #833, #835, #838, #841, #845 — T-301 PR 2/2 (#790, PR #846, `REVIEW: PASS` @`0f0c281`):
  - #807 *Repeated Switches*, `apps/desktop/src/shell/AppShell.tsx`: chỉ `apps/desktop/src/main.tsx` phân biệt exe / web. `AppWindow` (`apps/desktop/src/shell/CloseGuard.tsx`) thêm `setTitle`, `apps/desktop/src/App.tsx` đưa `appWindow` xuống `AppShell`; `AppShell` không còn import `@tauri-apps/api`. Tiêu đề cửa sổ exe vẫn do ca "the exe gives its title bar the name of the screen too…" của `e2e/navigation.spec.ts` canh.
  - #817 *Mysterious Name*, `apps/desktop/src/data/app-data.ts`: bỏ `AppData.lastSave()` / `subscribeLastSave`; `apps/desktop/src/routes/SettingsDataFile.tsx` đọc `lastSave` từ `useSaveStatus()`, test của `apps/desktop/src/data/app-data.test.ts` đọc `saves.status()`.
  - #817 *Duplicated Code*, `apps/desktop/src/data/AppDataContext.tsx`: hook `useSaveStatus()` thay bốn chỗ `useSyncExternalStore(saves.subscribe, saves.status)` (`SaveWarning.tsx`, `CloseGuard.tsx`, `Sidebar.tsx`, `SettingsDataFile.tsx`). Dòng bản web của Cài đặt → Dữ liệu dùng `WEB_MODE` của `apps/desktop/src/shell/Sidebar.tsx` (chấm + câu); màu chữ còn viết lại: ghi mới ở OPEN (review #846).
  - #817, `e2e/save-state.spec.ts` (bước "Still failing"): trước lần bấm "Thử lại" đầu, đặt `failSaves = 'DISK_FULL'` và chờ dải đổi sang câu ổ đầy. Thân PR #846: "Thử lại" gọi `saves.idle()` thay `flush()` thì ca đỏ.
  - #833, `apps/desktop/src/routes/trash-view.ts` (`restoreLabel`): tên nút KH "Khôi phục KH <tên> · <nhóm>", chữ `stage.*` như huy hiệu (Owner 25/10, ngoại lệ cho câu "không đổi chữ người dùng thấy" của #790). Ca hai KH cùng tên khác nhóm ở `apps/desktop/src/routes/trash-view.test.ts`; `e2e/trash.spec.ts`, `e2e/team.spec.ts` dò nút theo tên mới. Việc chọn huy hiệu viết ở hai nơi: ghi mới ở OPEN (review #846).
  - #833 *Duplicated Code*, `apps/desktop/src/routes/trash-view.ts` (`purgePlan`): đếm bằng `trashCounts(going)`; comment ghi cùng số với lệnh dọn, `kept` theo thứ tự danh sách (Owner 25/10: chỉ sửa phần app, không sửa purge.ts của `@p2c/db`). Ca "D1, D5" ở `apps/desktop/src/routes/trash-view.test.ts` so `counts` và tập `kept` (không theo thứ tự) với `previewPurge`.
  - #833 *Duplicated Code*, `apps/desktop/src/routes/trash-view.ts` (`restoreView`): dòng "Trạng thái" của hộp khôi phục HĐ dùng `policyStatusText`; khóa `trash.restore.issued` (`apps/desktop/src/i18n/vi.ts`) nhận slot `{status}`. Chữ trên màn không đổi.
  - #833 NIT, `apps/desktop/src/routes/SettingsTrash.tsx`: comment "The plan of every row, whatever the filter (TR-11)".
  - #835 *Duplicated Code*, `apps/desktop/src/routes/customers/KycDialogs.tsx` (`add` của hộp 7a): báo dữ kiện bị từ chối bằng `refusalText(field, raw)` (`apps/desktop/src/routes/customers/kyc-view.ts`) như hộp 3f, cả khi `normalizeKycValue` từ chối lẫn khi preview `refused`.
  - #835, `e2e/customer-ai.spec.ts` (ca "a run that fails while the profile is left…"): sau khi thấy lỗi, sang Cài đặt rồi quay lại, panel không còn `alert`. Thân PR #846: bỏ effect `drop` của `apps/desktop/src/routes/customers/use-ai-job.ts` thì ca đỏ.
  - #838 (FYP dưới 1 triệu; *Duplicated Code*), `apps/desktop/src/routes/money-view.ts`: `amountRead` là cách đọc số tiền chung của case size (6c / 6d), trường tiền KYC (7b / 7c) và FYP (8a / 8b); FYP "500k" nay đọc "500.000 ₫". Ba khóa `{amount} ({compact})` gộp thành `money.read`. Unit ở `apps/desktop/src/routes/money-view.test.ts`, e2e FYP "500k" ở `e2e/customer-policies.spec.ts`.
  - #838, `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx` (ô không bấm được, `role="img"`): ô hôm nay ngoài tháng / ngoài khoảng Tùy chọn có `aria-current="date"`; e2e ở `e2e/appointments.spec.ts`.
  - #838, `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx` (`Detail`): "Dời từ" / "Dời sang" đưa focus theo chuỗi `toDetail()` như sau khi lưu hộp: về tiêu đề của lịch vừa hiện, hay về dòng báo lịch ngoài góc nhìn khi RE của lịch đó ngoài góc nhìn (mục chặn của review #846 vòng 1). Dòng đó có câu riêng `appointments.linkedOutside` khi chỉ đi theo link. e2e "rescheduling keeps the old appointment…" và "by the keyboard, a reschedule link to an appointment out of sight…" ở `e2e/appointments.spec.ts`.
  - #838, `apps/desktop/src/routes/appointments/MetFields.tsx`: câu help của Case size và người đánh giá là `help` của `TextField` / `SelectField`, nên thuộc mô tả của ô; vị trí và khoảng cách như cũ. e2e ở `e2e/appointment-outcome.spec.ts`. Vế "không thuộc mô tả" ở `docs/testing/nghiem-thu-v1.md` ("Lệch mockup đã biết"): ghi mới ở OPEN (review #846).
  - #841 (P8), `apps/desktop/src/routes/overview/StageBlock.tsx`: theo cách Owner chọn 26/10, `aria-describedby` của chart trỏ vào một dòng `hidden` (`stageChartSummary` ở `apps/desktop/src/routes/overview/stage-chart.ts`): mốc cuối có số liệu như dòng của nó trong bảng (các nhóm đang hiện + Tổng), rồi "Số liệu từng mốc ở bảng ngay sau". Bảng `sr-only` giữ để duyệt; chart chưa có số thì không có mô tả. Câu ở `docs/user-guide/02-tong-quan.md` theo mô tả mới.
  - #841, `e2e/chart.spec.ts`: ngoài `toHaveAccessibleDescription` (accname Playwright tự tính), ca đọc mô tả từ cây truy cập của Chromium (CDP `Accessibility.getFullAXTree`) và đòi đúng nguyên dòng tóm tắt ở kỳ Tháng (30 mốc).
  - #841 *Duplicated Code*, `apps/desktop/src/routes/overview/StageBlock.tsx`: hậu tố id `-head` / `-body` và `numbersOf` bỏ hẳn cùng mô tả cũ, mục hết đối tượng.
  - #841, `apps/desktop/src/routes/team/PersonDialogs.tsx` (nút "Xóa nhân sự" của hộp Sửa): theo cách Owner chọn 26/10, dòng hỏi có nút riêng "Bỏ thay đổi và xóa nhân sự"; "Xóa nhân sự" giữ tên, bấm lại hay bấm đúp chỉ hỏi lại. Ca "Xóa nhân sự asks first…" ở `e2e/team.spec.ts` bấm đúp; NT-TM-18 của `docs/testing/nghiem-thu-v1.md` theo nút mới.
  - #845, `apps/desktop/src/routes/customers/KycIntelligence.tsx`: hai link trong câu ("Xem ở Dữ kiện KYC →" khi cổng chặn vì mâu thuẫn, "Cài đặt → AI" của lỗi `AI_NO_KEY`) dùng `LINK` của `apps/desktop/src/routes/classes.ts`, vòng focus accent như mọi link. Ca ở `e2e/customer-ai.spec.ts` tới hai link bằng bàn phím và đòi vòng nét liền màu accent.
  - Mùi code của vòng `REVIEW: CHANGES` @`00fe30b` đã làm trong PR #846: `lastNumbers` (`apps/desktop/src/routes/overview/stage-chart.ts`) lấy mốc cuối có số từ dòng của `stageChartTable`; `stageChartSummary` và `stageChartLastText` (chữ cạnh tên team, mockup 1b) cùng đọc, `lastText` của `StageBlock.tsx` bỏ. Unit ở `apps/desktop/src/routes/overview/stage-chart.test.ts`.

- Ghi chú review PR #825, #838, #843 và deep review Phase 1–6 lượt 1 (DR6-37, DR6-66, DR6-67, phần app / ui) — T-301 PR 1/2 (#790, PR #845, `REVIEW: PASS` @`df35e3c`):
  - DR6-66 (phần app / ui; phần `db` / `domain` PR #801, phần `ai` PR #812 và `useMemo` của thẻ Lịch hẹn PR #693 đã ở RESOLVED), `apps/desktop/src/data/persist-queue.ts`: bỏ `PersistQueue.unsaved()`; test đọc `status()`, và hai ca `flush()` của `apps/desktop/src/data/persist-queue.test.ts` gọi thêm một `flush()` rồi kiểm không ghi lại bản chụp đã lỗi (review #845: bỏ `lost = undefined;` thì hai ca đỏ). Thôi export: `markName`, `REPORT_STAGES` (`apps/desktop/src/routes/reports/reports-view.ts`), `ConfirmProposal` (`apps/desktop/src/routes/customers/KycExtraction.tsx`), `TokenReader` (`packages/ui/src/components/chart-theme.ts`), `TokenViolation` (`packages/ui/src/token-guard.ts`). Bỏ `class="dark"` của `apps/desktop/index.html` và khóa `birth.error.empty`; kiểu lỗi của `parseBirthDate` (`apps/desktop/src/routes/customers/customers-view.ts`) không còn `'empty'`. `PLAIN_SLOTS` dời vào `apps/desktop/src/i18n/index.test.ts`, nơi duy nhất đọc nó.
  - DR6-67 (phần app; các phần khác PR #799, #801, #807, #812 đã ở RESOLVED), `apps/desktop/src/routes/classes.ts`: `FOCUS`, `CARD`, `SETTINGS_SECTION`, `PANEL`, `ALERT`, `LINK` khai một lần; các màn và thanh bên import lại, cùng tập class (chỉ thêm `cursor-pointer` trên năm `<a href>`, không thấy được). `REPORT_COLUMNS` (`apps/desktop/src/routes/reports/reports-view.ts`) khai 17 cột báo cáo một lần; `reportCells`, `ReportTable` và file Excel (`apps/desktop/src/routes/reports/report-workbook.ts`) cùng đọc, `REPORT_GROUPS` (5 · 6 · 6) suy từ danh sách. Ca "has the columns and groups of the table on screen, in its order" ở `apps/desktop/src/routes/reports/report-workbook.test.ts`.
  - DR6-37, `apps/desktop/src/routes/customers/CustomerKyc.tsx`, `apps/desktop/src/routes/appointments/AppointmentDialog.tsx`, `apps/desktop/src/routes/overview/TeamCompare.tsx`: `✓` / `○` / `!` của thẻ KYC, `×` của chip người phối hợp, `▾` / `▸` của So sánh team là khóa của `apps/desktop/src/i18n/vi.ts`, cùng ký tự; hai `join(', ')` của thẻ KYC dùng `sep.list`. `findHardcodedSeparators` (`packages/ui/src/token-guard.ts`, chạy trong `pnpm lint:tokens`) chặn các ký hiệu này và `—` (luật `hardcoded-mark`), cùng `.join(', ')` / `.join('; ')`; ca ở `packages/ui/src/token-guard.test.ts`.
  - #825 *Mysterious Name*, `apps/desktop/src/data/app-data.ts`: `SAVE_MEASURES` đổi thành `MAX_SAVE_MEASURES`.
  - #838 *Duplicated Code*, `apps/desktop/src/routes/customers/CustomerAppointments.tsx` (ô RF của thẻ Lịch hẹn): bỏ khuôn `appointments.moveRf`; `outcomeText` (`apps/desktop/src/routes/appointments/appointments-view.ts`) ghép `appointments.move` với `appointments.rf` bằng `joinParts`, ô RF ghép cùng các phần đó, RF tô accent; `customer.rf` gộp vào `appointments.rf` (comment ở `apps/desktop/src/i18n/vi.ts`).
  - #838 *Duplicated Code*, `apps/desktop/src/routes/appointments/appointment-form.ts`: `writtenDay` trả chữ ngày và cờ có ghi năm, `dayText` đọc từ đó; ô ngày của thẻ Lịch hẹn (`apps/desktop/src/routes/customers/CustomerAppointments.tsx`) đọc cờ đó, không tự so năm. Unit ở `apps/desktop/src/routes/appointments/appointment-form.test.ts`.
  - #838 *Mysterious Name*, `apps/desktop/src/routes/stage-badge.tsx`: `badge` của `MetFields.tsx` thành `stageBadge` ở một module trung tính; tám file dùng tên cũ và năm chỗ dựng `StageBadge` tay (`CustomersScreen.tsx` ×2, `StageBlock.tsx`, `RestoreDialog.tsx`, `SettingsTrash.tsx`) cùng dùng.
  - #843 *Duplicated Code*, `e2e/support.ts`: `lowestContrast(area, 'border')` thay `borderContrast` của `e2e/theme.spec.ts`; cùng cách đọc màu, nay tính cả `opacity` của khối cha.
  - #843 *Mysterious Name*, `packages/ui/src/components/table-view.ts`: `HeaderCell.kind` `'sort' | 'text'` đổi thành `'button' | 'label'`; `packages/ui/src/components/DataTable.tsx` đọc theo tên mới.
  - Ba ghi chú không chặn của vòng `REVIEW: CHANGES` @`ab7e6e7` đã làm trong PR #845 (Owner 26/10): `'—'` của `outcomeText` (`apps/desktop/src/routes/appointments/appointments-view.ts`) lấy từ `appointments.none`, và luật `hardcoded-mark` chặn cả `—`; `LINK` / `FOCUS` không còn viết tay (ba `<a href>` ở `CustomerProfile.tsx`, `AppointmentsScreen.tsx`, `AppointmentAi.tsx`; chuỗi focus ở bảy chỗ, kể cả `apps/desktop/src/shell/Sidebar.tsx`); `SECTION` của `apps/desktop/src/routes/classes.ts` đổi tên thành `SETTINGS_SECTION`.

---

# Issue #793 — T-302: Luật lint bắt cả import() động của @playwright/test; docsRead nhận join có ngoặc lồng và đường dẫn tách đoạn

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Đóng hai giới hạn mà review PR #792 (T-283) ghi lại; hai mục OPEN gắn **[T-302]** của sổ ghi chú review.

1. **Luật lấy `test` của Playwright (DR6-129):** spec hay helper e2e lấy `@playwright/test` bằng `import()` động (vd. `const { test } = await import(…)` ở đầu file) bị lint báo như import tĩnh. Như vậy trang không thể quay lại chạy theo ngày của máy qua đường này.
2. **Danh sách tài liệu mà test đọc (R2-21):** cách nhận đường dẫn tài liệu đọc từ gốc repo nhận thêm hai dạng đang lọt:
   - lời gọi có ngoặc lồng trước đường dẫn (vd. `join(dirname(fileURLToPath(import.meta.url)), '..', '<đường dẫn docs>')`);
   - đường dẫn tách thành nhiều đoạn (`join(root, 'docs', '<thư mục>', '<file>.md')`).

   Nhờ vậy tài liệu mà test so nguyên văn không thể thiếu trong `CODE_DOCS` (PR docs-only bỏ qua CI).

##### Bối cảnh

- Review PR #792 (`REVIEW: PASS` @`ae72dfb`) ghi hai mục này là không chặn. Lúc review, hiện chưa test nào đọc tài liệu theo hai dạng trên, và chưa spec nào dùng `import()` động của Playwright.
- Không Issue nào của đợt T-283…T-301 được sửa các file này. Owner 23/10 chọn mở Issue riêng, thay vì gộp vào T-301 hay ghi ACCEPTED.
- Thuộc đợt sửa hết sổ OPEN trước v1.0 (#771).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: hai mục OPEN gắn [T-302] (khối ghi chú của review #792); mục RESOLVED của T-283 (#736 luật `no-restricted-imports`, #524 `docsRead`)
- `eslint.config.js`: khối `no-restricted-imports` cho `e2e/**/*.ts` (thêm ở PR #792)
- `e2e/fixtures.spec.ts`: ca "lint refuses Playwright's own test to every e2e file but fixtures.ts"
- `e2e/navigation.spec.ts:321`: `import('@playwright/test').Locator` ở vị trí kiểu, phải vẫn được
- `tools/pr-core.test.mjs`: `FROM_ROOT`, `docsRead`, ca "sees a docs file read by a path from the test or from the root, not a path given as data", ca kiểm `CODE_DOCS`
- `tools/pr-core.mjs`: `CODE_DOCS`
- `.claude/rules/tests.md`, `.claude/rules/ci.md`

##### File / thư mục được phép sửa

- `eslint.config.js`
- `e2e/fixtures.spec.ts`
- `tools/pr-core.test.mjs`

##### Ghi chú OPEN liên quan

Hai mục OPEN gắn **[T-302]** (khối ghi chú của review #792): gộp, chính là Issue này. Ngoài hai mục đó, `notes-for --files` trên ba file không ra mục OPEN nào (sổ sau PR sổ của review #792). Phiên làm task chạy lại `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- `import()` động của `@playwright/test` bị báo với mọi tên được lấy, vì lint không biết trước tên nào. Cùng phạm vi file với luật hiện có: mọi `e2e/**/*.ts`, trừ `e2e/fixtures.ts`, `*.guide.ts`, `*.perf.ts`. Lời nhắn chỉ về `test` của `e2e/fixtures.ts`.
- Vẫn được: `import()` động của module khác; kiểu lấy bằng `import('@playwright/test')` ở vị trí kiểu (TS import type); `expect` / kiểu import tĩnh từ `@playwright/test`.
- `docsRead` vẫn không tính chuỗi đường dẫn tài liệu là dữ liệu của test (file của PR, của commit). `CODE_DOCS` không đổi.

##### Test chấp nhận

- [ ] Ca lint của e2e: lint báo `import()` động của `@playwright/test` (dạng `await import(…)` lấy `test`, và dạng `.then(…)`), cả trong spec lẫn trong helper. `import()` động của `./fixtures` và của `node:fs`, cùng `import('@playwright/test').Locator` ở vị trí kiểu, không bị báo. Tắt luật mới thì ca đỏ.
- [ ] Unit `docsRead`: nhận hai dạng của Mục tiêu 2, với một tài liệu của `CODE_DOCS`. Chuỗi đường dẫn tài liệu là dữ liệu vẫn không bị nhận. Các ca hiện có vẫn xanh.
- [ ] Ca kiểm `CODE_DOCS` (mọi tài liệu mà test đọc đều nằm trong `CODE_DOCS`) vẫn xanh trên repo.

Ước lượng: ≈ 10 dòng cấu hình + ≈ 40 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (Verify + e2e)
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển hai mục [T-302] sang RESOLVED

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #815 — chore: refuse a dynamic import of Playwright's test in e2e, read nested and split docs paths (T-302)

Trạng thái: MERGED · merge 2026-10-24T17:50:14Z · commit `17601a32ebbfb686eed7967c4fd41fc3ecc79bcf` · nhánh `task/T-302-playwright-import-docs-read` · nhãn: type:task, risk:low

Closes #793

#### Thay đổi

1. **Luật lấy `test` của Playwright (DR6-129, Mục tiêu 1), `eslint.config.js`:** khối của `e2e/**/*.ts` thêm `no-restricted-syntax`, cùng phạm vi file với `no-restricted-imports` (trừ `e2e/fixtures.ts`, `*.guide.ts`, `*.perf.ts`). Luật báo mọi `import()` động của `@playwright/test`, viết trong nháy hay trong backtick, bất kể lấy tên nào (`await import(…)`, `.then(…)`): `no-restricted-imports` chỉ đọc `import` / `export … from` tĩnh, và lint không biết trước `import()` lấy tên nào. Lời nhắn chỉ về `test` của `e2e/fixtures.ts`, tên khác thì import tĩnh. Kiểu `import('@playwright/test').Locator` (`e2e/navigation.spec.ts:343`) là TS import type (node `TSImportType`, không phải `ImportExpression`), nên vẫn được.
2. **`docsRead` (R2-21, Mục tiêu 2), `tools/pr-core.test.mjs`:** regex `FROM_ROOT` (một mức ngoặc, cả đường dẫn trong một chuỗi) thay bằng:
   - `DOCS_PATH`: đường dẫn `docs/….md` trong một chuỗi, hoặc tách thành các đối số chuỗi liền nhau (`'docs', 'golden', 'ai-eval.md'`), ghép lại bằng `posix.join`;
   - `callAround`: đi ngược từ đường dẫn tới dấu `(` còn mở, bỏ qua mọi lời gọi lồng đã đóng trước đó (không giới hạn độ sâu), rồi lấy tên lời gọi. Chỉ tính khi tên thuộc `FROM_ROOT` (`join`, `resolve`, `readFileSync`, `readFile`), như trước.

   Chuỗi `docs/….md` không phải đối số của các lời gọi đó vẫn là dữ liệu của test, kể cả khi đứng sau một `join(…)` đã đóng. `CODE_DOCS` không đổi.
3. **`ignores` của ESLint (mục sổ L152, gắn [T-302] sau khi viết Issue), `eslint.config.js`:** thêm `playwright-report/**`, `test-results/**`. ESLint không đọc `.gitignore`, nên một báo cáo e2e còn trong checkout (CI ghi; giải nén artifact `e2e-report-*`) làm `pnpm lint` đỏ hàng nghìn lỗi ở file đóng gói. Test ở `tools/pr-core.test.mjs`: "pnpm verify › lints none of the folders Playwright writes its report to".

#### Test chấp nhận

- [x] Ca lint của e2e (`e2e/fixtures.spec.ts`): lint báo `import()` động của `@playwright/test` ở dạng `await import(…)` lấy `test`, dạng `.then(…)` và dạng backtick, cả trong spec lẫn trong helper. `import()` động của `./fixtures`, của `node:fs`, và kiểu `import('@playwright/test').Locator` không bị báo. Chạy trước khi có luật (như tắt luật mới): ca đỏ ở dạng đầu, `Expected: 1, Received: 0`. Thêm: ghim `export * from '@playwright/test'` (luật cũ đã báo), và mọi đoạn code mẫu phải parse được, để ca "không bị báo" không xanh nhờ lỗi parse.
- [x] Unit `docsRead`: nhận `readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'docs/golden/ai-eval.md'))` và `readFileSync(join(root, 'docs', 'golden', 'ai-eval.md'), 'utf8')` (tài liệu của `CODE_DOCS`); trước khi sửa ca đỏ (`[]`). Chuỗi dữ liệu vẫn không bị nhận; thêm ca đường dẫn đứng sau `join(root, 'docs')` đã đóng. Đột biến bỏ đếm `)` trong `callAround` làm ca đỏ. Các ca hiện có vẫn xanh.
- [x] Ca kiểm `CODE_DOCS` xanh trên repo. So `docsRead` cũ và mới trên 151 file test của repo (script tạm): từng file cùng kết quả, cả repo đọc `docs/design/phase-5-prompts.md` và `docs/golden/ai-eval.md`.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`: 3 mục trùng file.

- L141 `tools/pr-core.test.mjs` **[T-302 #793]** (`FROM_ROOT` chỉ một mức ngoặc, cả đường dẫn trong một chuỗi): đã sửa (`DOCS_PATH`, `callAround`).
- L142 `e2e/fixtures.spec.ts`, `eslint.config.js` **[T-302 #793]** (`import()` động của `@playwright/test` lọt luật): đã sửa (`no-restricted-syntax`, ca lint).
- L152 `eslint.config.js` **[T-302 #793]** (`ignores` thiếu `playwright-report/**`, `test-results/**`): đã sửa.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local, Home PC (`DESKTOP-KDURKJP`).
- [x] e2e: ca lint của `fixtures.spec.ts` xanh ở local (`--project edge --no-deps`); cả bộ e2e chạy trên CI.
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-302 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #792, #805 — T-302 (#793, PR #815, `REVIEW: PASS` @`dfc7203`):
  - #792 (R2-21), `tools/pr-core.test.mjs` (`docsRead`): `DOCS_PATH` nhận đường dẫn `docs/….md` viết trong một chuỗi hoặc tách thành các đối số chuỗi liền nhau (`'docs', 'golden', 'ai-eval.md'`, ghép bằng `posix.join`); `callAround` đi ngược từ đường dẫn tới dấu `(` còn mở, bỏ qua mọi lời gọi lồng đã đóng, và chỉ tính khi tên lời gọi thuộc `FROM_ROOT` (`join`, `resolve`, `readFileSync`, `readFile`). Ca mới: `readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'docs/golden/ai-eval.md'))`, `join(root, 'docs', 'golden', 'ai-eval.md')`, chuỗi dữ liệu đứng sau một `join(…)` đã đóng. Hai giới hạn còn lại của cách đoán: mục review #815 ở ACCEPTED.
  - #792 (DR6-129), `eslint.config.js` (`import()` động của `@playwright/test`): `no-restricted-syntax` báo `ImportExpression` có nguồn `@playwright/test` (trong nháy hay backtick), bất kể lấy tên nào, cùng phạm vi file với `no-restricted-imports`; kiểu `import('@playwright/test').Locator` (TS import type) vẫn được. Ca ở `e2e/fixtures.spec.ts`: ba dạng động (`await import`, `.then`, backtick), trong spec lẫn helper; mọi đoạn mẫu phải parse được.
  - #805, `eslint.config.js` (`ignores`): thêm `playwright-report/**`, `test-results/**`; ca "pnpm verify › lints none of the folders Playwright writes its report to" ở `tools/pr-core.test.mjs`.

---

# Issue #797 — T-303: G3: mockup ô khóa và câu ngoài phạm vi của token viền ô nhập (sau T-284)

Trạng thái: CLOSED · nhãn: type:task, risk:med, gate, ready-for-agent

##### Mục tiêu

Sửa chữ của mockup G3 T-284 (PR #795) ở hai chỗ mà review #795 ghi là không chặn. Đây là hai mục OPEN của sổ ghi chú review, PR sổ #796 ghi vào sổ; PR sổ đi kèm Issue này đổi nhãn của chúng sang **[T-303]**. Làm trước T-300 (#789), để T-300 code theo mockup không còn chỗ đọc nhầm.

1. **Ô khóa (`.input.locked`):**
   - Hiện trạng: `.input.locked` chỉ đổi `border-style`, nên viền của nó theo `.input` sang token mới `--border-control` (#687890). Ba ô khóa của hộp 6f "Sửa kết quả cuộc gặp" vì vậy có viền đứt sáng ngang ô sửa được. Thẻ quyết định G3 (`#t284`) và thẻ tương phản (`#contrast`) không nhắc ô khóa.
   - Bối cảnh: app vẽ ô khóa bằng hằng `LOCKED` của `apps/desktop/src/routes/appointments/appointments-view.ts` (viền liền `border-border`). WCAG 1.4.11 không đòi 3:1 cho ô không thao tác được.
   - Đề xuất: giữ ô khóa ở màu viền cũ: `.input.locked { border-color: var(--border-strong); }`. Ghi ở `#contrast` rằng ô khóa nằm ngoài phạm vi token.
   - Phương án khác: giữ màu mới, chỉ ghi "ô khóa ngoài phạm vi" ở `#contrast`.
2. **Câu "Ngoài phạm vi" ở `#contrast` (`index.html:278`):**
   - Hiện trạng: câu ghi "nút, ô chọn, Segmented có chữ…". Trong tài liệu repo, "ô chọn" là ô chọn team, tức `SelectField` (`overview.html`, `reports.html`, `phase-4-chi-so.md`). Nhưng bảng ngay trên lại đưa `SelectField` vào phạm vi.
   - Ý của câu là `Choices`, tức lựa chọn có chữ → ghi đúng tên component, cùng kiểu với bảng.

##### Bối cảnh

- Review PR #795 (`REVIEW: PASS` @`5a8e068`, [comment](https://github.com/AlexH-AI/Project-2C/pull/795#issuecomment-6369203855)) ghi hai mục này là không chặn. PR sổ #796 ghi chúng vào OPEN, lúc đầu gắn [T-300 #789].
- T-300 không được sửa mockup. Owner 23/10 chọn mở Issue riêng.
- Đổi mockup đã duyệt nên qua G3: Owner duyệt trên PR.
- Thuộc đợt sửa hết sổ OPEN trước v1.0 (#771).

##### Tài liệu cần đọc

- `.claude/rules/mockups.md`; `docs/design/mockups/README.md`
- `docs/state/review-notes.md`: hai mục OPEN của khối ghi chú review #795
- `docs/design/mockups/forms.css` (`.input`, `.input.locked`); `docs/design/mockups/appointment-forms.html` (6f, ô khóa)
- `docs/design/mockups/index.html`: thẻ `#t284`, `#contrast`
- `apps/desktop/src/routes/appointments/appointments-view.ts` (`LOCKED`); `packages/ui/src/components/Choices.tsx`, `SelectField.tsx`

##### File / thư mục được phép sửa

- `docs/design/mockups/**` (gồm `README.md`: ghi lần duyệt G3)

##### Ghi chú OPEN liên quan

Hai mục OPEN của khối ghi chú review #795 (`forms.css:191`, `index.html:278`): gộp, chính là Issue này. Chạy `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Chỉ sửa mockup, không sửa code.
- Không đổi token, số đo hay phạm vi T-300 đã duyệt ở T-284.
- T-300 đọc mockup sau PR này.

##### Test chấp nhận

- [ ] Ô khóa của 6f (`appointment-forms.html`) có viền theo phương án Owner chọn. `#contrast` nói rõ ô khóa nằm ngoài phạm vi `--border-control`.
- [ ] Câu "Ngoài phạm vi" ở `#contrast` ghi tên component (`Choices`), không còn "ô chọn".
- [ ] `README.md` của mockup ghi lần duyệt G3 (ngày, Issue).
- [ ] Mockup mở trên server `mockups` (1440 × 900), không lỗi console.

Ước lượng: ≈ 10 dòng mockup / tài liệu.

##### Định nghĩa hoàn thành

- [ ] Review phiên sạch: PASS (PR docs, không chạy CI)
- [ ] Owner duyệt G3 trên PR rồi merge. PR mang nhãn `risk:med` và `gate`, để `merge-pr` không cho Claude tự merge trước khi Owner duyệt
- [ ] PR sổ sau review chuyển hai mục [T-303] sang RESOLVED

##### Rủi ro

risk:med

##### Bị chặn bởi

Không

## PR #811 — docs: G3 mockup for locked inputs and the out-of-scope line of the contrast card (T-303)

Trạng thái: MERGED · merge 2026-10-24T15:03:06Z · commit `bb29ab6e6fec7fd6b80fac0d50b23a787c2d8b10` · nhánh `task/T-303-locked-input-mockup` · nhãn: risk:med, gate

Closes #797

PR mockup **G3**: sửa chữ của mockup T-284 (PR #795) ở hai chỗ mà review #795 ghi là không chặn, để T-300 (#789) code theo mockup không còn chỗ đọc nhầm. Chỉ sửa `docs/design/mockups/**`, không code. Mở bằng server `mockups` (1440 × 900): `appointment-forms.html` (hộp 6f), `index.html#contrast`.

**Cổng G3: Owner duyệt đề xuất ngày 24/10/2026** (ô khóa giữ viền đứt `--border-strong`, câu ngoài phạm vi ghi `Choices`). Commit `e8e1a3e` ghi lần duyệt vào README mockup và câu ở `#contrast`, như PR #795.

#### Thay đổi

1. **Ô khóa `.input.locked`** (`forms.css`): thêm `border-color: var(--border-strong)`, kèm một dòng comment. Ba ô khóa của hộp 6f (`appointment-forms.html:331–339`, file này không sửa) về lại viền đứt `--border-strong` như trước T-284, thay vì viền đứt `--border-control` sáng ngang ô sửa được.

   | Viền | trên ruột ô khóa bg-2 | trên hộp thoại bg-1 |
   |---|---|---|
   | Ô khóa trước PR này (`--border-control`) | 3,61 | 3,97 |
   | Ô khóa sau PR này (`--border-strong`) | 1,60 | 1,76 |
   | Ô sửa được, không đổi (`--border-control`, ruột bg-3) | 3,15 | 3,97 |

   - Ô khóa không thao tác được: WCAG 1.4.11 không đòi 3:1 cho thành phần không hoạt động.
   - Mục 1 của thẻ `#t284` và bảng token đã ghi `--border-strong` cho "viền đứt", loại không cần 3:1; ô khóa là viền đứt.
   - Viền mờ hơn ô sửa được cũng giúp nhận ra ô nào bị khóa.
2. **Câu "Ngoài phạm vi" ở `#contrast`** (`index.html:278`):
   - "ô chọn" → `Choices` (lựa chọn có chữ); `Segmented` viết dạng code như bảng ngay trên. `SelectField` vẫn trong phạm vi như bảng ghi: T-300 đổi viền `SelectField`, không đổi `Choices`.
   - Thêm vế ô khóa: "ô khóa (`.input.locked`, hộp 6f) không thao tác được nên WCAG 1.4.11 không đòi 3:1, giữ viền đứt `--border-strong` như bảng token ghi cho viền đứt (T-303 #797, duyệt 24/10/2026, PR #811)".
3. **`README.md`** của mockup: dòng `appointment-forms.html` ghi "ô khóa 6f giữ viền đứt `--border-strong`, ngoài phạm vi `--border-control` (câu ngoài phạm vi ở `index.html#contrast`): T-303 #797, duyệt 24/10/2026 (PR #811)"; đoạn CSS ghi ô khóa giữ `--border-strong`.

NIT của review @`e8e1a3e` (cụm "như mọi viền đứt") sửa ở `b8bde2f` theo Owner 24/10/2026: câu ở mục 2 và comment ở `forms.css:191` ("the token table's border for dashed lines") nay dựa vào bảng token (`index.html:244`: `--border-strong` cho "viền đứt"), không nói mọi viền đứt (`.mcell.future`, viền trên `.stile.off` đứt màu khác). Trên `b8bde2f`: `pnpm verify` xanh (120 / 120 file, 3 753 / 3 753 test), mockup mở lại trên server `mockups` không lỗi console.

Không đổi token, số đo hay phạm vi T-300 đã duyệt ở T-284.

#### Quyết định G3 — Owner duyệt đề xuất (24/10/2026)

1. Ô khóa: **giữ viền cũ `--border-strong`** (đề xuất, Owner chọn). Phương án không chọn: giữ màu mới #687890, tức bỏ dòng `border-color` ở `forms.css`, chỉ ghi "ô khóa ngoài phạm vi" ở `#contrast`; khi đó mockup vẫn vẽ ô khóa sáng ngang ô sửa được, trái với câu ghi chú và với bảng token (`--border-strong` cho viền đứt).
2. Câu ngoài phạm vi ghi tên component `Choices` (có ở cả hai phương án).

#### Test chấp nhận

- [x] Ô khóa của 6f có viền theo phương án Owner chọn (viền đứt `--border-strong`); `#contrast` nói rõ ô khóa nằm ngoài phạm vi `--border-control`.
- [x] Câu "Ngoài phạm vi" ở `#contrast` ghi tên component (`Choices`), không còn "ô chọn".
- [x] `README.md` của mockup ghi lần duyệt G3 (ngày, Issue): "T-303 #797, duyệt 24/10/2026 (PR #811)".
- [x] Mockup mở trên server `mockups` (1440 × 900), không lỗi console.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (sổ @ `0ae6529`), 2 mục "Trùng file":

- L154 `docs/design/mockups/forms.css` (**[T-303]** `.input.locked` đổi theo token mới, ba ô khóa 6f sáng ngang ô sửa được): **đã sửa** (phương án Owner chọn).
- L155 `docs/design/mockups/index.html` (**[T-303]** câu "Ngoài phạm vi: nút, ô chọn, Segmented có chữ…"): **đã sửa**.

#### Quan sát ngoài phạm vi

- App vẽ ô khóa bằng hằng `LOCKED` (`apps/desktop/src/routes/appointments/appointments-view.ts:65`, dùng ở `EditOutcomeDialog.tsx:259`, `MetFields.tsx:76`): viền **liền** `border-border` (#263241, 1,25 trên ruột bg-2), còn mockup vẽ viền **đứt** `--border-strong`. Lệch này có từ trước T-284 (mục L154 của sổ nhắc như bối cảnh); PR này không đổi, T-300 cũng không đổi ô khóa (file ngoài danh sách).
- Khi L154 chuyển sang RESOLVED, lệch này không còn mục nào theo dõi. T-298 (#787) được sửa `appointments-view.ts`: nếu cần khớp mockup thì đổi một class `LOCKED` (`border-dashed border-border-strong`). Để review / PR sổ quyết định có ghi mục mới không.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (docs-only, không chạy CI) trên `7c9f9fc`. Trên head `e8e1a3e` (sau commit ghi lần duyệt):
  - lần đầu đỏ 1 test, ở `packages/ai/src/web.test.ts` (log chỉ giữ các dòng cuối; tên file đọc từ cache kết quả của Vitest). File này có ca đo thời gian DR5-09 (ngưỡng 50 ms) mà sổ ghi là chập chờn khi máy bận (mục **[T-290]** `web.ts:121`); PR không đụng `packages/ai`;
  - lần hai xanh: 120 / 120 file, 3 753 / 3 753 test.

  Không test nào đọc file mockup.
- [x] Không thêm dependency
- [x] Mockup mở trên server `mockups` (1440 × 900): `appointment-forms.html` 6f, `index.html#contrast`, không lỗi console. Màu tính được: ba ô khóa viền đứt 1 px #34425A (`--border-strong`), ruột #18212D; ô sửa được viền liền #687890 (`--border-control`).
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` (docs-only; nhãn `gate`, để `merge-pr` không cho Claude tự merge trước khi anh duyệt G3).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-303 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #795 — T-303 (#797, PR #811, `REVIEW: PASS` @`b8bde2f`):
  - #795, `docs/design/mockups/forms.css` (`.input.locked`): ô khóa giữ viền đứt `--border-strong` (`border-color: var(--border-strong)`), ngoài phạm vi `--border-control`; ba ô khóa của hộp 6f (`docs/design/mockups/appointment-forms.html:331–339`) không còn sáng ngang ô sửa được. Owner duyệt G3 24/10/2026. Hằng `LOCKED` của app chưa khớp: xem mục review #811 ở OPEN.
  - #795, `docs/design/mockups/index.html` (thẻ tương phản `#contrast`, câu "Ngoài phạm vi"): ghi `Choices`, `Segmented` thay "ô chọn"; thêm vế ô khóa (`.input.locked`, hộp 6f): không thao tác được nên WCAG 1.4.11 không đòi 3:1, giữ viền đứt `--border-strong` như bảng token ghi cho viền đứt. Owner duyệt G3 24/10/2026.

---

# Issue #831 — T-304: Luật lint chặn import zod bản đầy đủ; mặc định của schema AI là mảng mới mỗi lần parse

Trạng thái: CLOSED · nhãn: type:task, risk:high, ready-for-agent

##### Mục tiêu

Đóng hai ghi chú không chặn của review PR #830 (T-292, `zod/mini`), tức hai mục OPEN gắn **[T-304]** của sổ ghi chú review.

1. **Giữ `zod` bản đầy đủ ngoài bundle.** Hiện `pnpm verify` không có gì chặn một `import { z } from 'zod'` mới:
   - ESLint không có luật nào cho import này;
   - luật `ai-only-on-domain-and-zod` của dependency-cruiser cho qua mọi đường của gói `zod`.

   Một import như vậy qua hết lint / test nhưng kéo lại ≈ 62 KB min vào `assets/index.js`. Cấu hình của zod nằm trên `globalThis`, nên nó cũng nạp lại locale `en` và memoizer cho mọi schema. Việc cần làm: thêm luật lint báo import `zod` bản đầy đủ, chỉ cho `zod/mini`.
2. **Mặc định của schema AI là mảng mới mỗi lần parse.** Với `zod/mini`, `.check()` gọi trên một schema `z._default(…)` chỉ đọc giá trị mặc định một lần, nên mọi lần parse sau trả về cùng một mảng (`zod` bản đầy đủ thì không).
   - Schema hiện tại đúng, vì mọi `_default` đều bọc ngoài cùng, nhưng không có gì giữ điều đó.
   - Việc cần làm: thêm test, và thêm nửa câu nhắc vào comment ở import của `packages/ai/src/schema.ts`.

##### Bối cảnh

- Review PR #830 (`REVIEW: PASS` @`7ca936e`, mức high) ghi hai mục này là không chặn. Thân PR #830 đã đề xuất luật ở mục 1, nhưng `eslint.config.js` nằm ngoài danh sách file của #781.
- Tái hiện mục 2 trên zod 4.6.5:
  - `z._default(z.array(z.string()), []).check(z.refine(() => true))`: parse `undefined` hai lần ra cùng một mảng;
  - `zod` bản đầy đủ, `z.array(z.string()).default([]).refine(() => true)`: ra hai mảng khác nhau (`mergeDefs` giữ getter `defaultValue`).
- Không Issue nào còn mở được sửa các file này. Owner 25/10 chọn mở Issue riêng.
- Thuộc đợt sửa hết sổ OPEN trước v1.0 (#771).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: hai mục OPEN gắn [T-304] (khối ghi chú của review #830)
- `eslint.config.js`: khối `no-restricted-imports` của `e2e/**/*.ts` (mẫu)
- `tools/pr-core.test.mjs`: khối `describe('pnpm verify')`, các ca chạy ESLint (`new ESLint({ cwd })`)
- `e2e/fixtures.spec.ts`: ca lint của Playwright (mẫu `lintText` với `filePath`)
- `packages/ai/src/schema.ts` (`personalityNotes`, `hypotheses` của discovery, `evidence` của `actionItem`), `packages/ai/src/schema.test.ts`
- `packages/ai/CLAUDE.md`

##### File / thư mục được phép sửa

- `eslint.config.js`
- `tools/pr-core.test.mjs`
- `packages/ai/src/schema.ts` (chỉ comment ở import) + test

##### Ghi chú OPEN liên quan

Hai mục OPEN gắn **[T-304]** (khối ghi chú của review #830): gộp, chính là Issue này. Ngoài hai mục đó, `notes-for --files` trên các file này không ra mục OPEN nào (sổ sau PR sổ của review #830). Phiên làm task chạy lại `node tools/notes-for.mjs <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- **Luật lint.**
  - Báo import `zod` và các subpath bản đầy đủ (`zod/v4`, `zod/v3`) ở mọi file TypeScript của `packages/*/src` và `apps/desktop/src`, kể cả test.
  - Bắt các dạng: import tĩnh, `export … from`, `import type`. `import()` động không cần bắt.
  - Lời nhắn chỉ sang `zod/mini` (DR6-25).
  - Vẫn được: `zod/mini`, kể cả `import type`.
- **Mặc định của schema.** `personalityNotes`, `hypotheses` của discovery và `evidence` của hành động: mỗi lần parse dùng mặc định thì ra một mảng mới. Comment ở import của `schema.ts` thêm nửa câu: với `zod/mini`, check đặt trên schema bên trong, `_default` bọc ngoài cùng.
- **Không đổi:** hành vi của schema, `detail` V1, prompt (không qua G5).

##### Test chấp nhận

- [ ] Ca lint (khối `pnpm verify` của `tools/pr-core.test.mjs`), ở một file của `packages/ai/src` và một file của `apps/desktop/src`:
  - bị báo: `import { z } from 'zod'`, `import * as z from 'zod/v4'`, `import type { z } from 'zod'`;
  - không bị báo: `import * as z from 'zod/mini'`, `import type * as z from 'zod/mini'`;
  - tắt luật mới thì ca đỏ.
- [ ] Unit `packages/ai/src/schema.test.ts`: parse hai lần cùng một output thiếu khối có mặc định (`personalityNotes` của analysis / discovery, `hypotheses` của discovery, `evidence` của một hành động).
  - Hai kết quả có hai mảng khác nhau: thêm phần tử vào mảng của kết quả này không đổi kết quả kia.
  - Đặt `.check(…)` lên `personalityNotes` sau `_default` thì ca đỏ.
- [ ] `pnpm verify` xanh trên repo (không file nào đang import `zod` bản đầy đủ).

Ước lượng: ≈ 10 dòng cấu hình + ≈ 40 dòng test + 1–2 dòng comment.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (Verify + e2e)
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển hai mục [T-304] sang RESOLVED

##### Rủi ro

risk:high. Thay đổi nhỏ (comment, test, cấu hình lint), nhưng diff chạm `packages/ai/**`, mà `review-pr` §2 đặt mức tối thiểu high cho vùng này. Vì vậy Owner merge.

##### Bị chặn bởi

Không. Khác file với chuỗi T-296…T-301, nên làm song song được.

## PR #837 — chore: refuse the full zod by lint, test the AI schema's default lists (T-304)

Trạng thái: MERGED · merge 2026-10-25T16:56:43Z · commit `4f9082a492894b95fafdb5c5811547bc8022a8f2` · nhánh `task/T-304-zod-mini-lint` · nhãn: type:task, risk:high

Closes #831

PR code của T-304: đóng hai ghi chú không chặn của review PR #830 (T-292, `zod/mini`), tức hai mục [T-304] của sổ ghi chú review. Không đổi hành vi của schema, `detail` V1 hay prompt (không qua G5).

#### Thay đổi

- `eslint.config.js`: thêm khối `no-restricted-imports` cho mọi file TypeScript của `packages/*/src` và `apps/desktop/src` (`*.{ts,tsx}`, kể cả test).
  - `paths` chặn tên trần `zod`; `patterns` dùng `group: ['zod/*', '!zod/mini']`, tức chặn mọi subpath của gói trừ `zod/mini`. Cả hai dùng chung lời nhắn `ZOD_MINI`: "Take zod/mini, by that name (DR6-25): the full zod puts 62 KB back into the bundle."
  - Dùng luật lõi của ESLint như khối `e2e/**/*.ts`, không dùng bản `@typescript-eslint` có `allowTypeImports`. Vì vậy `import type` từ `zod` cũng bị báo.
  - Bắt import tĩnh, `export … from` và `export * from`. `import()` động để ngoài: Issue không yêu cầu, và code không có.
  - **Phạm vi:** luật đọc theo câu "chỉ cho `zod/mini`" của Issue. Ngoài ba subpath bản đầy đủ (`zod`, `zod/v4`, `zod/v3`), luật còn báo các subpath khác của gói 4.6.5:
    - `zod/v4/mini`, `zod/v4-mini`: chính `zod/mini` dưới tên khác;
    - `zod/v4/core`;
    - `zod/compile`: cài bộ biên dịch lên cấu hình chung của zod;
    - `zod/locales`.

    Hiện không file nào import các subpath này. Muốn chỉ chặn ba subpath bản đầy đủ thì thay `patterns` bằng hai mục `paths` `zod/v4`, `zod/v3`.
  - Tên trần `zod` nằm ở `paths`, không ở `patterns`. Lý do: pattern gitignore không có `/` bắt mọi `zod` ở bất kỳ độ sâu nào, và bắt luôn `zod/mini` bên dưới, vì `!zod/mini` không gỡ được con của thư mục đã bị loại. Đã thử trên thư viện `ignore` mà ESLint 10.11.0 dùng (`allowRelativePaths: true`, cùng tùy chọn với luật):

    | import | `['zod', '!zod/mini']` | luật này |
    |---|---|---|
    | `zod`, `zod/v4`, `zod/v4/mini` | báo | báo |
    | `zod/mini` | **báo** | không |
    | `./zod`, `../lib/zod`, `@x/zod` | **báo** | không |
- `tools/pr-core.test.mjs`, khối `describe('pnpm verify')`: thêm ca lint dạng `lintText`, theo mẫu `e2e/fixtures.spec.ts`. Ca chạy trên `packages/ai/src/probe.test.ts` (một file test của package) và `apps/desktop/src/probe.tsx` (một file `.tsx` của app).
  - Bị báo, mỗi dòng đúng một lời nhắn có `zod/mini`:
    - `import { z } from 'zod'`, `import type { z } from 'zod'`, `export { z } from 'zod'`;
    - `import * as z from 'zod/v4'`, `export * from 'zod/v4'`;
    - `import * as z from 'zod/v3'`;
    - `import * as z from 'zod/v4/mini'`.
  - Không bị báo: `import * as z from 'zod/mini'`, `import type * as z from 'zod/mini'`.
  - Mọi dòng phải parse được (không có lời nhắn `fatal`), nên ca "không bị báo" không xanh nhờ lỗi parse.
- `packages/ai/src/schema.test.ts`: thêm `describe('a list the model may leave out')`. Ca parse hai lần cùng một output thiếu các khối có mặc định, thêm phần tử vào các mảng của lần parse đầu, rồi kiểm các mảng của lần parse sau vẫn là `[]`:
  - analysis: `personalityNotes`, và `evidence` của chiến lược đầu tiên (chỉ có `missingCategory`);
  - discovery: `hypotheses`, `personalityNotes`.
- `packages/ai/src/schema.ts`: chỉ thêm một dòng vào comment ở import: "Checks go inside `_default`, not on it: zod/mini would give every parse the same default list."

#### Test chấp nhận

- [x] Ca lint (khối `pnpm verify` của `tools/pr-core.test.mjs`) ở một file của `packages/ai/src` và một file của `apps/desktop/src`: báo / không báo như mục Thay đổi.
  - Viết test trước khi có luật thì ca đỏ ngay ở dòng đầu: `packages/ai/src/probe.test.ts: import { z } from 'zod';: expected [] to deeply equal [ StringContaining "zod/mini" ]`.
  - Thêm luật thì ca xanh.
- [x] Unit `schema.test.ts`: hai ca xanh trên schema hiện tại. Thử đột biến bằng script tạm ngoài repo: thêm `.check(z.refine(() => true))` sau từng `_default`, mỗi lần một chỗ, khôi phục file sau mỗi lần.
  - Sau `personalityNotes`: cả hai ca đỏ.
  - Sau `hypotheses` của discovery: ca discovery đỏ.
  - Sau `evidence` của `actionItem`: ca analysis đỏ.
- [x] `pnpm verify` xanh trên repo, tức không file nào đang import `zod` bản đầy đủ. Mọi import hiện có đều là `zod/mini`: `ai/src/schema.ts`, `ai/src/validator.ts` (`import type`), `ai/src/validator-union.test.ts`, `db/src/backup.ts`, `db/src/backup-validation.ts`.

#### File ngoài danh sách của Issue

Không có.

#### Cỡ

- Cấu hình +21, gồm 6 dòng comment và hằng `ZOD_MINI`.
- Test +66: `pr-core.test.mjs` +40, `schema.test.ts` +26.
- Comment +1.

Issue ước khoảng 10 + 40 + 1–2 dòng. Phần test dài hơn ước lượng vì có thêm các dạng `export … from`, `zod/v3`, `zod/v4/mini` và phép kiểm `fatal`.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `8fbee71`: 2 mục "Trùng file".

- L97 `eslint.config.js` [T-304 #831] (không gì trong `pnpm verify` giữ `zod` bản đầy đủ ngoài bundle): đã sửa. Luật `no-restricted-imports` chỉ cho `zod/mini`; ca lint ở `tools/pr-core.test.mjs`.
- L98 `packages/ai/src/schema.ts` [T-304 #831] (`.check()` trên `z._default(…)` đọc mặc định một lần): đã sửa. Test mảng mặc định mới mỗi lần parse ở `schema.test.ts`, cộng một dòng ở comment import.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:high` (diff chạm `packages/ai/**`, `review-pr` §2 đặt mức tối thiểu high; Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-304 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Hai ghi chú review PR #830 — T-304 (#831, PR #837, `REVIEW: PASS` @`8fbee71`):
  - #830, `eslint.config.js`: luật `no-restricted-imports` ở mọi file TypeScript của `packages/*/src` và `apps/desktop/src`, kể cả test, chỉ cho `zod/mini`. Tên trần `zod` ở `paths`, mọi subpath khác của gói ở `patterns` (`zod/*`, `!zod/mini`); bắt cả `import type` và `export … from`, còn `import()` động để ngoài như Issue #831. Ca lint ở khối `pnpm verify` của `tools/pr-core.test.mjs`. Lỗ `'Zod'` / `'ZOD'` của luật: Owner 25/10 nhận, ở ACCEPTED.
  - #830, `packages/ai/src/schema.ts` (comment ở import): thêm câu "Checks go inside `_default`, not on it"; `packages/ai/src/schema.test.ts` kiểm mỗi lần parse ra mảng mặc định mới (`personalityNotes` của analysis / discovery, `hypotheses` của discovery, `evidence` của hành động). Review thử đặt `.check()` sau từng `_default`: ca tương ứng đỏ.

---

# Issue #849 — T-305: Gom class tiêu đề / huy hiệu về classes.ts, recordBadge, WEB_MODE.tone, đồng hồ bộ chụp ảnh hướng dẫn

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Dọn các mục [G7] còn lại của sổ thuộc về code, trước vòng review toàn bộ code. Không đổi hành vi hay chữ, trừ 2 px padding dọc của huy hiệu "n HĐ" trên thẻ KH (cho khớp mockup).

1. **`HEADING` / `BADGE` (review #845):** class tiêu đề thẻ và class huy hiệu khai một lần ở `classes.ts`, các màn import lại.
   - `HEADING`: ba hằng `HEADING` (Cài đặt → AI, KYC Intelligence, thẻ KYC), `CARD_TITLE` (Team) và 10 tiêu đề `<h2>` / `<h3>` viết thẳng chuỗi đó.
   - `BADGE`: hằng của thẻ KYC (đang export, bốn màn import từ màn đó) và bản chép ở Cài đặt → AI.
   - Thêm hai bản chép mà sổ chưa ghi (rà 26/10): huy hiệu "Chưa ghi kết quả" của Lịch hẹn (`UNRECORDED_BADGE`), và huy hiệu "n HĐ" của thẻ KH, đang thiếu padding dọc so với `.badge` của mockup (2px 8px).
   - `StageBadge` / `PolicyBadge` của `packages/ui` giữ nguyên, vì ui không import được app.
2. **`recordBadge` (review #846):** việc chọn huy hiệu của một dòng Thùng rác (KH → nhóm, HĐ → trạng thái) nằm ở một hàm. Ô "Bản ghi", tên nút khôi phục và test cùng đọc hàm đó.
3. **`WEB_MODE.tone` (review #846):** dòng bản web của Cài đặt → Dữ liệu dùng `WEB_MODE.tone`, thay `text-fg-2` viết tay.
4. **Bộ chụp ảnh hướng dẫn (review #792, phần chữ của review #547):**
   - đồng hồ cài theo múi giờ của project, `anchorMorning(timezoneId)` như fixture e2e, không theo múi của máy;
   - "150 KB" ghi là "150 KiB" ở tên test và comment (giới hạn thật là 150 × 1024 byte).

##### Bối cảnh

Rà sổ OPEN ngày 26/10 (Owner duyệt 27/10): mọi mục [G7] làm được trước vòng review toàn bộ code chia thành T-305 (code), T-306 (spec, nghiệm thu, hướng dẫn) và T-307 (số đo). Còn [G7] là lần chụp lại ảnh hướng dẫn và nghiệm thu exe, làm sau vòng review. Owner 26/10: `HEADING` / `BADGE`, `recordBadge`, `WEB_MODE.tone` làm chung một PR nhỏ.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-305]
- `apps/desktop/src/routes/classes.ts`
- `apps/desktop/src/routes/customers/CustomerKyc.tsx` (`HEADING`, `BADGE`); `apps/desktop/src/routes/SettingsAi.tsx` (`HEADING`, `BADGE`); `apps/desktop/src/routes/customers/KycIntelligence.tsx`; `apps/desktop/src/routes/team/TeamScreen.tsx` (`CARD_TITLE`)
- `apps/desktop/src/routes/appointments/appointments-view.ts` (`UNRECORDED_BADGE`); `apps/desktop/src/routes/customers/CustomersScreen.tsx` (huy hiệu "n HĐ"); `docs/design/mockups/mockups.css` (`.badge`)
- `apps/desktop/src/routes/trash-view.ts` (`restoreLabel`); `apps/desktop/src/routes/SettingsTrash.tsx` (`RecordCell`); `apps/desktop/src/routes/trash-view.test.ts` (ca "names the record as the first line of its "Bản ghi" cell does…")
- `apps/desktop/src/routes/SettingsDataFile.tsx`; `apps/desktop/src/shell/Sidebar.tsx` (`WEB_MODE`)
- `e2e/guide/shots.guide.ts`, `e2e/guide/check.guide.ts`, `e2e/anchor.ts` (`anchorMorning`), `e2e/fixtures.ts`, `playwright.guide.config.ts`

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/classes.ts`
- Các màn khai lại hoặc viết thẳng hai class:
  - `apps/desktop/src/routes/{SettingsAi,SettingsBackup,SettingsTrash,SettingsDataFile}.tsx`
  - `apps/desktop/src/routes/customers/{CustomerKyc,KycIntelligence,KycDialogs,KycHistory,CustomerAppointments,CustomersScreen}.tsx`
  - `apps/desktop/src/routes/team/TeamScreen.tsx`, `apps/desktop/src/routes/reports/ReportsScreen.tsx`
  - `apps/desktop/src/routes/appointments/{AppointmentAi,AppointmentsScreen,YearGrid}.tsx`, `apps/desktop/src/routes/appointments/appointments-view.ts`
  - `apps/desktop/src/routes/overview/{StageBlock,TeamCompare}.tsx`
- `apps/desktop/src/routes/trash-view.ts`, `apps/desktop/src/routes/trash-view.test.ts`
- `e2e/guide/shots.guide.ts`, `e2e/guide/check.guide.ts`
- `apps/desktop/CLAUDE.md` (khối codemap, nếu lệch)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` (sổ @ `de57d40`, nhãn theo PR sổ gắn lại nhãn ngày 27/10):

- **Gộp** mọi mục [T-305]: `HEADING` / `BADGE` (review #845); `recordBadge` và `WEB_MODE.tone` (review #846); `anchorMorning` của `shots.guide.ts` (review #792); chữ "150 KiB" của `check.guide.ts` (phần chữ của review #547).
- **Để lại** [G7], là việc của lần chụp lại ảnh sau vòng review:
  - `shots.guide.ts:30` (`style`, review #760): xem dòng đầu ảnh khi chụp lại;
  - ảnh `03-ket-qua.png` (review #838);
  - phần "ảnh vượt thì chụp phần trên" của review #547.

##### Interface / hợp đồng

- `classes.ts` thêm `HEADING`, `BADGE`, chuỗi giữ như hiện có.
- `trash-view.ts`: `recordBadge(row: TrashRow): { text: string; stage: CustomerStage } | { text: string; issued: boolean } | null`.
  - KH → nhóm, HĐ → trạng thái, loại khác → `null`.
  - `RecordCell` vẽ `StageBadge` / `PolicyBadge` với `label` lấy từ `recordBadge(row).text`; `restoreLabel` ghép cùng `text` đó.
- Không đổi chữ, nhãn, hành vi. Riêng huy hiệu "n HĐ" thêm `py-0.5`.

##### Test chấp nhận

- [ ] Trong `apps/desktop/src`, chuỗi `m-0 text-sm font-medium text-heading` và chuỗi gốc huy hiệu `rounded-full border border-current px-2 py-0.5 text-xs font-semibold` chỉ còn ở `classes.ts` (lệnh rg ghi trong PR).
- [ ] Không màn nào import `BADGE` từ `customers/CustomerKyc`.
- [ ] Test của `restoreLabel` đọc `recordBadge`, không dựng lại toán tử ba ngôi; thêm loại huy hiệu thì tên nút theo.
- [ ] Dòng bản web của `SettingsDataFile.tsx` dùng `WEB_MODE.tone`.
- [ ] `shots.guide.ts` cài đồng hồ bằng `anchorMorning` theo `timezoneId` của project; tên test và comment ghi "150 KiB".
- [ ] Chạy bộ chụp ảnh một lần ở local (`pnpm exec playwright test -c playwright.guide.config.ts`) và qua. Ảnh sinh ra bỏ đi (`git restore docs/user-guide/img`), không commit. Lý do: spec này không chạy trong CI, và đã có nhiều commit UI từ lần chạy cuối (15/10).
- [ ] `pnpm verify` + e2e xanh.

Ước lượng: ≈ 90 dòng SP (phần lớn đổi import / class ở ≈ 20 file) + ≈ 30 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-305] sang RESOLVED

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #855 — refactor: shared heading and badge classes, recordBadge, WEB_MODE.tone, guide shots on the config's zone (T-305)

Trạng thái: MERGED · merge 2026-10-27T06:36:56Z · commit `fc40dfae85f0344afac16b0dccf2770eaa779afe` · nhánh `task/T-305-heading-badge` · nhãn: type:task, risk:low

Closes #849

#### Thay đổi

Không đổi hành vi hay chữ của app, trừ 2 px padding dọc của huy hiệu "n HĐ" trên thẻ KH (`py-0.5`, cho khớp `.badge` 2px 8px của mockup). Thẻ có huy hiệu nay cao hơn thẻ không có, như ở mockup `customers.html` (hàng `.top` có `.badge` ≈ 22,5 px, tên KH ≈ 18 px).

1. **`HEADING` / `BADGE` vào `apps/desktop/src/routes/classes.ts`** (review #845, chuỗi giữ nguyên):
   - `HEADING` thay ba hằng `HEADING` (`SettingsAi.tsx`, `KycIntelligence.tsx`, `CustomerKyc.tsx`), `CARD_TITLE` (`TeamScreen.tsx`) và 10 tiêu đề `<h2>` / `<h3>` viết thẳng chuỗi (`CustomerAppointments`, `AppointmentAi`, `AppointmentsScreen`, `YearGrid`, `SettingsDataFile`, `SettingsBackup`, `SettingsTrash`, `StageBlock`, `TeamCompare`, `ReportsScreen`).
   - `BADGE` thay hằng đã export ở `CustomerKyc.tsx` (bốn màn import từ đó nay import `classes.ts`: `KycIntelligence`, `KycHistory`, `KycDialogs`, `AppointmentAi`), bản chép ở `SettingsAi.tsx`, chuỗi gốc của `UNRECORDED_BADGE` (`appointments-view.ts`) và huy hiệu "n HĐ" (`CustomersScreen.tsx`).
   - `StageBadge` / `PolicyBadge` của `packages/ui` giữ nguyên (ui không import được app; hai huy hiệu đó có chấm, mockup `.badge`).
2. **`recordBadge`** (review #846): `trash-view.ts` chọn huy hiệu của một dòng Thùng rác, KH → nhóm `{ text, stage }`, HĐ → trạng thái `{ text, issued }`, loại khác → `null` (hợp đồng của Issue). `RecordCell` vẽ `StageBadge` / `PolicyBadge` với `label` = `text`; `restoreLabel` ghép cùng `text`. Test đọc `recordBadge`, bỏ toán tử ba ngôi dựng lại (TDD: đỏ `recordBadge is not a function` → xanh).
3. **`WEB_MODE.tone`** (review #846): dòng bản web của Cài đặt → Dữ liệu dùng `WEB_MODE.tone` (cùng `text-fg-2`).
4. **Bộ chụp ảnh hướng dẫn** (review #792, review #547):
   - `shots.guide.ts` cài đồng hồ `anchorMorning(timezoneId)` theo múi của config (`Asia/Ho_Chi_Minh`) như `e2e/fixtures.ts`, không theo múi của máy;
   - "150 KB" → "150 KiB" ở tên test, thông báo `expect` và comment mới trên hai hằng của `check.guide.ts`, và comment của ca `05-ho-so-kh`; cùng lý do "4 MB" → "4 MiB" (`MAX_TOTAL` = 4 × 1024 × 1024);
   - **Owner 27/10 (trong phiên, G8):** khung chụp hai ảnh 04 (xem "Test chấp nhận" dòng bộ chụp ảnh).

#### Test chấp nhận

- [x] Hai chuỗi chỉ còn ở `classes.ts`:
  ```
  rg -n "m-0 text-sm font-medium text-heading|rounded-full border border-current px-2 py-0.5 text-xs font-semibold" apps/desktop/src
  ```
  → `apps/desktop/src/routes/classes.ts:20` (`HEADING`), `:27` (`BADGE`).
- [x] Không màn nào import `BADGE` từ `customers/CustomerKyc`: `rg -n "CustomerKyc'" apps/desktop/src` chỉ còn `KycCard` / `Timeline` (`CustomerProfile`), `YES_NO` (`KycDialogs`), `UpdateHead` / `VersionLines` / `YES_NO` (`KycExtraction`).
- [x] Test của `restoreLabel` (ca "names the record as the first line of its "Bản ghi" cell does…") đọc `recordBadge`, không dựng lại toán tử ba ngôi: huy hiệu thêm vào `recordBadge` thì ô, tên nút và test cùng theo. Thêm `describe('recordBadge')`: KH (N3, Tạm hoãn), HĐ đã nộp / đã phát hành, lịch hẹn / nhân sự / team → `null`.
- [x] Dòng bản web của `SettingsDataFile.tsx` dùng `WEB_MODE.tone`.
- [x] `shots.guide.ts` cài đồng hồ bằng `anchorMorning(timezoneId)`; tên test và comment ghi "150 KiB".
- [x] Bộ chụp ảnh chạy ở local (`pnpm exec playwright test -c playwright.guide.config.ts`): 13 ca qua (11 chụp, 2 kiểm) sau khi đổi khung hai ảnh 04 như dưới. Ảnh sinh ra đã bỏ (`git restore docs/user-guide/img`), không commit.
  - Lần chạy đầu: 11 ca chụp và kiểm link qua, kiểm cỡ đỏ ở hai ảnh (giới hạn 153 600 byte). Cột "Bỏ `py-0.5`": chụp lại ca 04 khi cất riêng thay đổi của `CustomersScreen.tsx` (mọi thay đổi khác của PR giữ nguyên class):

    | Ảnh | Nhánh này | Bỏ `py-0.5` | Ghi chú |
    |---|---|---|---|
    | `04-khach-hang-bang.png` (Bảng) | 155 335 | 155 335 | vượt từ trước (các commit UI từ 15/10) |
    | `04-khach-hang.png` (Kanban) | 163 413 | 151 143 | `py-0.5` của "n HĐ": thẻ có huy hiệu cao hơn, các cột hết thẳng hàng, PNG nén kém hơn |

  - Chụp phần trên (mục [G7] L22) đủ cho ảnh Bảng (600 px: 100 179 byte), không đủ cho ảnh Kanban (640 px: 157 782 byte; phần trống bên dưới gần như không tốn byte).
  - Owner 27/10 chọn sửa cách chụp ngay trong T-305 (gộp phần "chụp phần trên" của L22): ảnh Bảng chụp 600 px trên như `05-ho-so-kh`; ảnh Kanban chụp phần bên phải sidebar (`01-bat-dau-sidebar` đã có sidebar), từ đầu màn tới chân `main`. Ảnh vẫn có mọi thứ mục "Kanban" của `docs/user-guide/04-khach-hang.md` nhắc tới (số KH theo góc nhìn, ô Cách xem, bốn cột, "+ … KH · xem dạng bảng", hai khung KH đã đóng). Cỡ lần chạy cuối: Kanban 142 964 byte (1 208 × 661 px), Bảng 100 179 byte (1 440 × 600 px, 11 dòng); ảnh lớn nhất nay là ảnh Kanban, rồi `05-ho-so-kh` (142 742); tổng 28 ảnh 1 753 030 byte.
- [x] `pnpm verify` xanh ở local; e2e ở local (`pnpm e2e`): 305 ca qua (4,1 phút), trên code app cuối cùng.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (sổ @ `90b1313`):

- L20 (`check.guide.ts`, `shots.guide.ts`, "150 KiB"): đã sửa.
- L22 (khi chụp lại ảnh, ảnh vượt 150 KiB thì chụp phần trên như `05-ho-so-kh`): đã sửa theo quyết định Owner 27/10 (mục [G7] gộp vào T-305): hai ảnh vượt ở lần chạy này là `04-khach-hang-bang` (chụp 600 px trên) và `04-khach-hang` (chụp phần bên phải sidebar, vì phần trên không đủ). Lần chụp lại ở G7 vẫn chạy `check.guide.ts`, nên ảnh nào vượt sau vòng review sẽ đỏ ở đó.
- L35 (`style` của `shot`, xem dòng đầu các ảnh Playwright phải cuộn tới): để lại [G7] — việc của lần chụp lại ảnh có commit; ảnh của lần chạy này bỏ đi theo Issue.
- L39 (`setFixedTime(ANCHOR_MORNING)` theo múi của máy): đã sửa.
- L63 (`03-ket-qua.png` chưa có câu help dưới ô Case size): để lại [G7] — việc của lần chụp lại ảnh có commit. Ảnh do lần chạy này chụp đã có câu help dưới ô (đã xem), nên chỉ còn chờ commit ảnh ở G7.
- L65 (`HEADING` / `BADGE`): đã sửa.
- L69 (`recordBadge`): đã sửa.
- L70 (`WEB_MODE.tone`): đã sửa.

#### Quan sát ngoài phạm vi

- `docs/design/phase-6-hoan-thien.md:237` (§4.3) ghi "mỗi ảnh ≤ 150 KB, tổng ≤ 4 MB". T-306 (#850) sửa §4.3 thành "150 KiB"; cùng lý do có thể ghi luôn "4 MiB" cho khớp `check.guide.ts`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Cỡ: SP +76 / −62, test (unit + bộ chụp ảnh e2e) +42 / −17; tổng 197 dòng, trong ngưỡng.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-305 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #547, #792, #845, #846 — T-305 (#849, PR #855, `REVIEW: PASS` @`1c6f9e3`):
  - #845 *Duplicated Code*, `apps/desktop/src/routes/classes.ts`: `HEADING`, `BADGE` khai một lần, chuỗi giữ nguyên. `HEADING` thay ba hằng `HEADING` (`SettingsAi.tsx`, `KycIntelligence.tsx`, `CustomerKyc.tsx`), `CARD_TITLE` (`TeamScreen.tsx`) và 10 tiêu đề viết thẳng chuỗi. `BADGE` thay hằng đã export ở `CustomerKyc.tsx` (bốn màn nay import từ `classes.ts`), bản chép ở `SettingsAi.tsx`, chuỗi gốc của `UNRECORDED_BADGE` (`apps/desktop/src/routes/appointments/appointments-view.ts`) và huy hiệu "n HĐ" của thẻ KH (`apps/desktop/src/routes/customers/CustomersScreen.tsx`), nay có `py-0.5` như `.badge` 2px 8px của mockup. Bốn tiêu đề `HEADING` + class khoảng cách còn viết thẳng: ghi mới ở OPEN (review #855).
  - #846 *Duplicated Code*, `apps/desktop/src/routes/trash-view.ts` (`recordBadge`): KH → `{ text, stage }`, HĐ → `{ text, issued }`, loại khác → `null`. `RecordCell` (`apps/desktop/src/routes/SettingsTrash.tsx`) vẽ `StageBadge` / `PolicyBadge` với `label` = `text`, `restoreLabel` ghép cùng `text`; ca `restoreLabel` của `apps/desktop/src/routes/trash-view.test.ts` đọc `recordBadge`, thêm `describe('recordBadge')`. Ô vẽ `StageBadge` tay, trái doc comment của `stage-badge.tsx`: ghi mới ở OPEN (review #855).
  - #846 NIT, `apps/desktop/src/routes/SettingsDataFile.tsx`: dòng bản web dùng `WEB_MODE.tone`.
  - #792, `e2e/guide/shots.guide.ts`: đồng hồ trang cài `anchorMorning(timezoneId)` theo `timezoneId` của `playwright.guide.config.ts` (`Asia/Ho_Chi_Minh`), như `e2e/fixtures.ts`; máy ở múi khác không chụp ảnh sang ngày khác.
  - #547 (phần chữ), `e2e/guide/check.guide.ts`: tên test, thông báo `expect` và comment trên hai hằng ghi "150 KiB" / "4 MiB"; comment của ca `05-ho-so-kh` ở `e2e/guide/shots.guide.ts` cũng vậy.
  - #547 (phần [G7] "chụp phần trên"; Owner 27/10 gộp vào T-305 vì test chấp nhận 6 của #849 không qua nếu không đổi), `e2e/guide/shots.guide.ts`: `04-khach-hang-bang` chụp 600 px trên như `05-ho-so-kh`; `04-khach-hang` (Kanban) chụp phần bên phải sidebar, từ đầu màn tới chân `main`, vì phần trên vẫn vượt 150 KiB. Lần chạy của PR: 13 ca qua, Kanban 142 964 byte, Bảng 100 179 byte; ảnh không commit, chụp lại ở G7.

---

# Issue #850 — T-306: Tài liệu trước vòng review: spec Phase 6 (S2-6, TR-3, hộp 11i, 150 KiB), nghiệm thu (thư mục cấm tạo file, lệch mockup), gạch ngang ở hướng dẫn

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sửa các mục [G7] của sổ thuộc về tài liệu, để spec, nghiệm thu và hướng dẫn khớp code trước vòng review toàn bộ code. Luật không đổi; chỉ sửa phần giải thích và test chấp nhận theo code đã merge.

1. **Spec Phase 6 (`phase-6-hoan-thien.md`):**
   - **S2-6 (review #817):** câu "File sau đó là dữ liệu mới đủ" sai khi lần thay bị từ chối hay lỗi → thêm "(lần thay bị từ chối hay lỗi: dữ liệu cũ đủ)". Dòng test chấp nhận "`flush()` (đóng app) ở từng bước của `replace`…" viết lại theo S2-6: dữ liệu mới ở mọi bước, như ca "closing the app at any step of a replace waits for it…" của `app-data.test.ts`.
   - **TR-3, dòng E7 (review #740):** thêm lý do D10 cho ca A / B của DR6-104: "hoặc chuyển nhóm của cuộc gặp phải ghi lùi trước một chuyển nhóm ngày sau (D10, DR6-104)". Owner 23/10: sửa ở PR docs G7, chỉ phần giải thích.
   - **"Mô hình dữ liệu của dọn sạch" (review #833):** hộp 11i đọc kế hoạch từ các dòng `listTrash` (`purgePlan` của app); `previewPurge` là kế hoạch của lệnh dọn và là chuẩn so của test.
   - **§4.3 (phần của review #547):** giới hạn ảnh ghi "150 KiB".
2. **Nghiệm thu (`nghiem-thu-v1.md`):**
   - **Ca mới (review #764, #750):** thư mục dữ liệu cấm tạo file, lúc mở và giữa phiên (dải lưu, hộp đóng app, Thử lại khi còn cấm, gỡ quyền thì lưu được); file dữ liệu chỉ đọc giữa phiên. Bước theo bảng exe trong thân PR #764: `icacls Project2C-data /deny *S-1-1-0:(WD)`, gỡ bằng `/remove:d`.
   - **"Lệch mockup đã biết",** thêm dòng cho:
     - **10d (review #817):** lưu lỗi hiện bằng dải ngang đầu cột, câu theo nguyên nhân, thay cho toast góc trên phải; "Đã lưu" không có giờ khi chưa lưu gì trong phiên; câu D7 của 11j thêm vế "Bấm "Thử lại"…".
     - **10c (review #825):** ngày neo không in đậm; câu backup là đoạn chữ thường, không phải khung "alert info" có tên file (app chưa biết tên file trước khi backup).
     - **8d (review #833):** không in đậm số tiền của dòng FYP và "−1" / "+1" của dòng số HĐ.
     - **Dòng thời gian (review #835):** mục v1 "KYC lần đầu · N4 → N3" của mockup gộp chuyển nhóm, app để chuyển nhóm thành mục riêng; app không có mã ghi chú (N-0914); nút AI trích xuất xuống dòng khi đầu mục có nhãn "thay đổi quan trọng" và cột hẹp.
     - **Thẻ KH ở Kanban (mới, rà 26/10):** app ghi "n HĐ" màu đã phát hành cho mọi HĐ đã nộp. Mockup `customers.html` vẽ KH chỉ có HĐ nộp là "1 HĐ nộp", màu `pol-submitted`. Ghi lệch theo đề xuất 26/10; Owner muốn sửa theo mockup thì tách Issue riêng.
   - **Dòng "Ô Case size dự kiến" (review #846):** bỏ vế sai "Câu không thuộc mô tả trợ năng của ô (`TextField` chưa có `help`)".
3. **Hướng dẫn (`07-bao-cao.md`, review #554):** ví dụ mốc "01-06/09 (T3-CN)", "14-20/09 (tới 15/09)" dùng gạch ngang `–` như app (`reports.mark.range`, `reports.mark.weekdays`).

##### Bối cảnh

Rà sổ OPEN ngày 26/10 (Owner duyệt 27/10): mọi mục [G7] làm được trước vòng review toàn bộ code chia thành T-305 (code), T-306 (spec, nghiệm thu, hướng dẫn) và T-307 (số đo). Đã kiểm 26/10: app vẫn lệch thật ở 10c, 10d, 11j, 8d, dòng thời gian và thẻ KH; `MetFields.tsx` truyền câu help qua `help`.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-306]
- `docs/design/phase-6-hoan-thien.md` §4.1 (S2-6, test chấp nhận), §4.2 (TR-3, "Mô hình dữ liệu của dọn sạch"), §4.3
- `docs/testing/nghiem-thu-v1.md` §13 (NT-DB), mục "Lệch mockup đã biết"
- Thân PR #764 (bảng exe), #817, #825, #833, #835, #846 (các lệch đã nêu)
- Mockup: `docs/design/mockups/settings-data.html` (10c, 10d), `trash.html` (11j), `policy-forms.html` (8d), `customer.html` (dòng thời gian), `customers.html` (thẻ KH)
- Code để kiểm lệch còn thật:
  - `apps/desktop/src/shell/SaveWarning.tsx`, `apps/desktop/src/shell/Sidebar.tsx`
  - `apps/desktop/src/routes/Settings.tsx` (`ReloadDialog`), `apps/desktop/src/routes/customers/PolicyDialogs.tsx`, `apps/desktop/src/routes/customers/kyc-view.ts`, `apps/desktop/src/routes/customers/CustomersScreen.tsx`, `apps/desktop/src/routes/appointments/MetFields.tsx`
  - `apps/desktop/src/data/app-data.test.ts` (ca S2-6), `apps/desktop/src/routes/trash-view.ts` (`purgePlan`), `packages/db/src/purge.ts` (`previewPurge`)
  - `apps/desktop/src/i18n/vi.ts` (`reports.mark.*`, câu dải lưu khi file chỉ đọc / thư mục cấm tạo file)

##### File / thư mục được phép sửa

- `docs/design/phase-6-hoan-thien.md`
- `docs/testing/nghiem-thu-v1.md`
- `docs/user-guide/07-bao-cao.md`

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` (sổ @ `de57d40`, nhãn theo PR sổ gắn lại nhãn ngày 27/10):

- **Gộp** mọi mục [T-306]: review #554, #740, #764, #817 (S2-6, 10d), #825 (10c), #833 (hộp 11i, 8d), #835, #846, và phần §4.3 của review #547.
- **Để lại:** không có.

##### Interface / hợp đồng

- Spec: không đổi luật, không mở lại G2.
- Nghiệm thu: mã dòng mới nối tiếp NT-DB-22; mỗi dòng có đủ bước gây lỗi an toàn và kết quả mong đợi, như các dòng NT-DB hiện có.

##### Test chấp nhận

- [ ] Bốn chỗ của spec sửa như mục tiêu; mỗi câu khớp code hoặc test hiện có (PR dẫn tên test / hàm).
- [ ] Các ca NT-DB mới theo bảng exe của PR #764; ca file chỉ đọc giữa phiên ghi đúng câu dải lưu hiện có.
- [ ] Mỗi dòng "Lệch mockup đã biết" mới đã kiểm trên app (code hoặc màn) là còn lệch thật; vế sai ở dòng "Ô Case size dự kiến" đã bỏ.
- [ ] `07-bao-cao.md` dùng `–` ở hai ví dụ.
- [ ] PR chỉ đổi tài liệu (không chạy CI).

Ước lượng: ≈ 60 dòng tài liệu.

##### Định nghĩa hoàn thành

- [ ] Review phiên sạch: PASS (PR docs: không gọi `code-review`)
- [ ] PR sổ sau review chuyển các mục [T-306] sang RESOLVED

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #857 — docs: Phase 6 spec, acceptance list and report guide match the code before the full review (T-306)

Trạng thái: MERGED · merge 2026-10-27T07:43:21Z · commit `fa4023e16c40eb7c638f4196676b4510c634f9ab` · nhánh `task/T-306-docs-before-review` · nhãn: type:task, risk:low

Closes #850

#### Thay đổi

1. **Spec Phase 6 (`docs/design/phase-6-hoan-thien.md`)**, chỉ phần giải thích và test chấp nhận, luật không đổi:
   - **S2-6** (review #817): "File sau đó là dữ liệu mới đủ (lần thay bị từ chối hay lỗi: dữ liệu cũ đủ)". Dòng test chấp nhận `flush()` của §4.1: chờ lần thay và lần lưu dữ liệu mới; bytes lưu cuối cùng là DB mới ở mọi bước. Khớp `apps/desktop/src/data/app-data.test.ts`:
     - "closing the app at any step of a replace waits for it, leaving the new data whole (S2-6, review of PR 125)": file ở mọi bước là `NEW`;
     - "counts a replace as saving until the new data is saved, so a flush waits for it", "stops counting a refused replace as saving";
     - vế "từ chối hay lỗi" theo S2-4: "when %s, writes again and keeps saving the current data, its generation unchanged (S2-4)" (backup lỗi, mở DB mới lỗi, lần lưu trước lỗi); `PersistQueue.track` thôi tính khi lần thay xong hay lỗi (`work.then(settled, settled)`), rồi `flush` lưu dữ liệu cũ.
   - **TR-3, dòng E7** (review #740): thêm "hoặc chuyển nhóm của cuộc gặp phải ghi lùi trước một chuyển nhóm ngày sau (D10, DR6-104)". Khớp `checkRestoreAppointment` (`packages/db/src/appointments.ts:293–301`: `TRANSITION_BEFORE_LATEST` khi chuyển nhóm mới nhất ở ngày sau, xét trước `STAGE_NOT_ON_DAY`) và `packages/db/src/trash.test.ts` "E7: blocks it like E6 once the customer, %s, reached that stage again after its day" (ca A / B của DR6-104: N2 là nhóm của ngày cuộc hẹn, vẫn chặn với ngày 07/10).
   - **"Mô hình dữ liệu của dọn sạch"** (review #833): `previewPurge` là kế hoạch của lệnh dọn (`purgeTrash` gọi nó trong transaction, `packages/db/src/purge.ts:162`). Hộp 11i đọc cùng kế hoạch từ các dòng `listTrash` (`purgePlan`, `apps/desktop/src/routes/trash-view.ts:560`; `SettingsTrash.tsx:328`), không đọc DB lần nữa. `previewPurge` là chuẩn so của test: "D1, D5: the dialog reads the plan of the purge from the rows of the list" và "opening the dialog and purging run keptRecords for the purge alone" (`trash-view.test.ts`). Câu "một hàm" của tập giữ lại nay ghi tên `keptRecords`.
   - **§4.3** (phần của review #547): "mỗi ảnh ≤ 150 KiB, tổng ≤ 4 MiB (1 KiB = 1 024 byte; `e2e/guide/check.guide.ts`)", khớp `MAX_IMAGE = 150 * 1024`, `MAX_TOTAL = 4 * 1024 * 1024`.
2. **Nghiệm thu (`docs/testing/nghiem-thu-v1.md`)**:
   - **NT-DB-23…25 mới** (review #764, #750), theo bảng exe của PR #764:
     - NT-DB-23, thư mục cấm tạo file lúc mở: trang lỗi như NT-DB-18 (`storage.accessDenied`); hash không đổi, `backups\` không thêm bản (`storage::open` kiểm `add_refused` trước khi trả bytes, app chỉ backup khi mở được); gỡ quyền cấm thì mở bình thường.
     - NT-DB-24, thư mục cấm tạo file giữa phiên: dải `storage.saveFolderReadOnly`, hộp đóng app `close.unsavedBodyFolderReadOnly`; Thử lại khi còn cấm → hộp hiện lại; gỡ quyền cấm rồi Thử lại → lưu rồi đóng.
     - NT-DB-25, file chỉ đọc giữa phiên (#750): dải `storage.saveReadOnly` (câu hiện có), hộp `close.unsavedBodyReadOnly`, bỏ chỉ đọc thì lưu được. Rust: `a_save_after_the_file_turned_read_only_is_reported_as_read_only`; lần đổi tên lỗi xóa `.tmp` (`write_atomic_with`, `a_save_that_fails_leaves_no_tmp_behind`).
     - Lệnh `icacls` để `'*S-1-1-0:(WD)'` trong dấu nháy. Đã thử bằng PowerShell 7 trên một thư mục tạm: thiếu nháy thì lỗi "The term 'WD' is not recognized…"; có nháy thì tạo file mới bị từ chối, file có sẵn vẫn ghi được, `icacls … /remove:d '*S-1-1-0'` gỡ sạch.
     - Bảng đối chiếu: 10d → DB-…, 17–25.
   - **"Lệch mockup đã biết"**, sáu dòng mới, mỗi dòng đã kiểm trên code là còn lệch:
     - Thẻ KH ở Kanban: badge `text-issued` "{count} HĐ" (`CustomersScreen.tsx:268–271`), đếm mọi HĐ đã nộp (`customers-view.ts:87–102`); mockup `customers.html:378` "1 HĐ nộp", `pol-submitted`.
     - Dòng thời gian: `kycTimeline` để chuyển nhóm là sự kiện riêng (`kind: 'stage'`); tiêu đề KYC luôn "Cập nhật KYC dd/mm/yyyy" (`packages/db/src/kyc.ts:597`, không có "KYC lần đầu"); chữ ghi chú hiện thẳng, không mã N-…; đầu mục là `flex flex-wrap` (`KycExtraction.tsx:105`) nên nút xuống dòng. Mockup `customer.html:328`, `:354`.
     - 8d: mỗi dòng "Ảnh hưởng chỉ số" là một `<span>` chữ thường (`PolicyDialogs.tsx:264–268`); mockup `policy-forms.html:168`, `:216–218` có `<b>`.
     - 10c: `ReloadDialog` có hai `<p>` chữ thường (`Settings.tsx:176–186`), câu `settings.demo.confirmBackup` không có tên file; mockup `settings-data.html:200–201`.
     - 10d / 11j: dải `role="alert"` nằm trên header (`AppShell.tsx:73`), câu theo bảng `SAVE_FAILED` (`SaveWarning.tsx`); "Đã lưu" khi chưa có `lastSave` (`Sidebar.tsx:98–100`); `trash.purge.failedUnsaved` có vế Thử lại. Mockup `settings-data.html:96–103` (toast), `:216`, `trash.html:436`.
   - Dòng "Ô Case size dự kiến": bỏ vế sai. `MetFields.tsx:136` truyền câu qua `help`, và `e2e/appointment-outcome.spec.ts:98` đòi mô tả "500.000 ₫ Dấu phẩy…".
3. **Hướng dẫn (`docs/user-guide/07-bao-cao.md`)** (review #554): "01–06/09 (T3–CN)", "14–20/09 (tới 15/09)", như `reports.mark.range` / `reports.mark.weekdays` = `'{from}–{to}'` (ghép ở `reports-view.ts:192–203`).

Chỉ sửa `docs/**`, không file nào thuộc `CODE_DOCS` → không chạy CI.

#### Test chấp nhận

- [x] Bốn chỗ của spec sửa như mục tiêu; mỗi câu khớp code hoặc test (dẫn ở mục 1).
- [x] Các ca NT-DB mới (23–25) theo bảng exe của PR #764; ca file chỉ đọc giữa phiên ghi đúng câu dải `storage.saveReadOnly` hiện có.
- [x] Mỗi dòng "Lệch mockup đã biết" mới đã kiểm trên code là còn lệch thật (mục 2); vế sai ở dòng "Ô Case size dự kiến" đã bỏ.
- [x] `07-bao-cao.md` dùng `–` (U+2013, đã kiểm byte) ở hai ví dụ. Bước kiểm hướng dẫn `pnpm exec playwright test -c playwright.guide.config.ts --project check --no-deps`: 2 passed.
- [x] PR chỉ đổi tài liệu: 3 file, đúng danh sách của Issue.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `a39148f`), 11 mục "Trùng file", đều [T-306]:

- L20 §4.3 "150 KiB" / "4 MiB": **đã sửa** (mục 1).
- L21 `07-bao-cao.md:51`, `:55` gạch nối: **đã sửa** (mục 3).
- L31 TR-3 dòng E7, lý do D10 của DR6-104: **đã sửa** (mục 1).
- L35 ca thư mục cấm tạo file và file chỉ đọc giữa phiên: **đã sửa**, NT-DB-23…25 (mục 2).
- L43 ba lệch của PR #817 (10d, 11j): **đã sửa**, dòng "Lưu lỗi và trạng thái lưu".
- L44 S2-6 và dòng test chấp nhận `flush()`: **đã sửa** (mục 1).
- L47 hai lệch của hộp 10c: **đã sửa**, dòng "Hộp 10c".
- L52 "Mô hình dữ liệu của dọn sạch": **đã sửa** (mục 1).
- L53 8d không in đậm: **đã sửa**, dòng "Hộp 8d".
- L56 ba lệch của dòng thời gian (PR #835): **đã sửa**, dòng "Hồ sơ KH, Dòng thời gian".
- L63 vế sai ở dòng "Ô Case size dự kiến": **đã sửa**.

Dòng "Khách hàng, thẻ KH ở Kanban" không có mục sổ: lệch mới của lần rà sổ 26/10, Issue ghi.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (không đổi dependency)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low` (chỉ docs; không chạm golden hay `CODE_DOCS`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-306 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #547, #554, #740, #764, #817, #825, #833, #835, #846 — T-306 (#850, PR #857, `REVIEW: PASS` @`c3b6be2`):
  - #547 (phần spec), `docs/design/phase-6-hoan-thien.md` §4.3: "mỗi ảnh ≤ 150 KiB, tổng ≤ 4 MiB (1 KiB = 1 024 byte; `e2e/guide/check.guide.ts`)", khớp `MAX_IMAGE` / `MAX_TOTAL`.
  - #554, `docs/user-guide/07-bao-cao.md:51`, `:55`: hai ví dụ mốc dùng gạch ngang `–` như `reports.mark.range` / `reports.mark.weekdays`: "01–06/09 (T3–CN)", "14–20/09 (tới 15/09)".
  - #740, `docs/design/phase-6-hoan-thien.md` §4.2 (TR-3, dòng E7): thêm lý do "hoặc chuyển nhóm của cuộc gặp phải ghi lùi trước một chuyển nhóm ngày sau (D10, DR6-104)", khớp `checkRestoreAppointment` (`packages/db/src/appointments.ts`) và ca DR6-104 của `packages/db/src/trash.test.ts`; luật không đổi.
  - #764, `docs/testing/nghiem-thu-v1.md` §13: NT-DB-23 (thư mục cấm tạo file, lúc mở), NT-DB-24 (thư mục cấm tạo file, giữa phiên), NT-DB-25 (file chỉ đọc giữa phiên, #750), theo bảng exe của PR #764; bảng đối chiếu 10d → DB-17–25. Lệnh `icacls` để `'*S-1-1-0:(WD)'` trong dấu nháy, vì thiếu nháy thì PowerShell đọc `(WD)` thành lệnh (review #857 đã chạy thử trên thư mục tạm).
  - #817 (lệch 10d / 11j), `docs/testing/nghiem-thu-v1.md` ("Lệch mockup đã biết"): dòng "Lưu lỗi và trạng thái lưu": dải ngang đầu cột, câu theo nguyên nhân, thay thông báo ở góc trên phải; "Đã lưu" không giờ khi chưa lưu gì trong phiên; câu D7 của 11j thêm vế "Bấm "Thử lại"…".
  - #817 (S2-6), `docs/design/phase-6-hoan-thien.md` §4.1: "File sau đó là dữ liệu mới đủ (lần thay bị từ chối hay lỗi: dữ liệu cũ đủ)"; dòng test chấp nhận `flush()` chờ lần thay và lần lưu dữ liệu mới, bytes lưu cuối cùng là DB mới ở mọi bước, như ca S2-6 của `apps/desktop/src/data/app-data.test.ts`.
  - #825, `docs/testing/nghiem-thu-v1.md` ("Lệch mockup đã biết"): dòng "Hộp 10c": ngày neo không in đậm; câu backup là đoạn chữ thường chỉ nêu thư mục backup, không phải khung "alert info" có tên file.
  - #833 (hộp 11i), `docs/design/phase-6-hoan-thien.md` §4.2 ("Mô hình dữ liệu của dọn sạch"): `previewPurge` là kế hoạch của lệnh dọn, tính trong transaction của lệnh, và là chuẩn so của test; hộp 11i đọc cùng kế hoạch từ các dòng `listTrash` (`purgePlan` của `apps/desktop/src/routes/trash-view.ts`); tập giữ lại tính ở một hàm, `keptRecords`.
  - #833 (8d), `docs/testing/nghiem-thu-v1.md` ("Lệch mockup đã biết"): dòng "Hộp 8d": không in đậm số tiền của dòng FYP và "−1" / "+1" của dòng số HĐ.
  - #835, `docs/testing/nghiem-thu-v1.md` ("Lệch mockup đã biết"): dòng "Hồ sơ KH, Dòng thời gian": mục v1 ghi "Cập nhật KYC dd/mm/yyyy" như mọi lần cập nhật, chuyển nhóm là mục riêng (mockup gộp: "KYC lần đầu · N4 → N3"); không có mã ghi chú; nút AI trích xuất đứng ngay sau tiêu đề mục, xuống dòng khi cột hẹp (mockup đặt bên phải).
  - #846, `docs/testing/nghiem-thu-v1.md` ("Lệch mockup đã biết", dòng "Ô Case size dự kiến"): bỏ vế "Câu không thuộc mô tả trợ năng của ô (`TextField` chưa có `help`)", vì `apps/desktop/src/routes/appointments/MetFields.tsx` truyền câu help qua `help`.

---

# Issue #851 — T-307: Số đo Phase 6 trước vòng review: bảng PR vượt ngưỡng, integrity_check theo MB, kết quả đợt sửa lượt 3

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Ghi phần số đo Phase 6 đã đủ dữ liệu, trước vòng review toàn bộ code.

1. **Mục "Kích thước PR vượt ngưỡng" của `phase-6.md`:**
   - Ghi luật đếm ở đầu bảng, rồi liệt kê đủ PR của milestone Phase 6 tới lúc viết.
   - **14 PR sổ đã nhắc:** #539, #543, #545, #566, #572, #710, #801, #805, #812, #817, #828, #833, #835, #845.
   - **3 PR sổ sót (rà 26/10):**
     - #526 (T-201): SP +260 / −361 khi tính cả dòng xóa; PR không nêu lý do.
     - #669 (T-250): ≈ 950 dòng tổng; PR đã nêu.
     - #709 (T-258 PR 1/2): ≈ 860 dòng tổng không tính snapshot và codemap; PR đã nêu.
   - **Bảng phụ "ở biên"** (vượt ≤ 6 %): #616 (T-232, SP ≈ 423), #568 (T-217, SP 406, code `tools/`).
   - **Đếm lại cả bảng theo cùng luật.** Sổ ghi #543 / #545 theo dòng thêm; GitHub cho 917 / 830 dòng tổng.
   - **Ghi "tới <ngày>":** PR sửa của vòng review toàn bộ code ghi thêm sau.
2. **NIT `integrity_check` (review #717):** ghi theo MB, ở `phase-6.md` mục "Số đo deep review lượt 3" và ở tổng hợp lượt 3 §7.4. Ví dụ: "366 / 453 / 546 ms ở 14,1 / 20,0 / 25,4 MB (×1 / ×2 / ×3 KH mỗi RE), chạm 600 ms ở ≈ 28–29 MB (≈ 2× cỡ file dữ liệu tải)". Nguồn: báo cáo gốc Claude B, K2.
3. **Mục "Review đóng phase":** thay "_Còn điền: kết quả đợt sửa lượt 3, kiểm lại trước G7._" bằng hai đợt:
   - đợt sửa lượt 3: 11 Issue #719–#729, cùng #735 và #752;
   - đợt sửa sổ OPEN trước v1.0: T-283…T-304, #771.

Luật đếm gợi ý (ghi ở đầu bảng):

- **Phân loại:** theo `tools/size-report-core.mjs` (spec Phase 6 §6.2). Test là `*.test.*`, `*.spec.*`, `e2e/**`, `test-support.ts`, `fixtures/**`, golden; với Rust, từ dòng `#[cfg(test)]` trở đi tính là test.
- **Không tính file sinh:** khối codemap, `migrations/meta/*`, SQL do drizzle-kit sinh, `src-tauri/icons/*`.
- **Tính là SP:** migration tự viết và `tools/*.mjs`, như #474 ở `phase-5.md`. SP tính cả dòng xóa, như sổ đã làm với #801 và #833.
- **Không xét:** PR chỉ tài liệu (báo cáo gốc, kết quả eval).

##### Bối cảnh

Rà sổ OPEN ngày 26/10 (Owner duyệt 27/10): mọi mục [G7] làm được trước vòng review toàn bộ code chia thành T-305 (code), T-306 (spec, nghiệm thu, hướng dẫn) và T-307 (số đo). Các mục khác của `phase-6.md` (Task, Chỉ số, Kiểm tra trên `main`, Điều hướng, Đánh giá cuối dự án, Việc hoãn sau v1.0, Ghi chú) chờ PR G7 cuối, sau vòng review và nghiệm thu.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-307]
- `docs/metrics/phase-6.md` (cả file); `docs/metrics/phase-5.md` mục "Kích thước PR vượt ngưỡng" (mẫu bảng); `docs/metrics/README.md`
- `tools/size-report-core.mjs` (phân loại file)
- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §7.4, §8.5; `docs/reviews/raw/2026-10-21/claude/B.md` (K2)
- Thân các PR trong bảng (lý do vượt), đếm qua `gh api repos/AlexH-AI/Project-2C/pulls/<n>/files --paginate`

##### File / thư mục được phép sửa

- `docs/metrics/phase-6.md`
- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` (§7.4, một câu)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` (sổ @ `de57d40`, nhãn theo PR sổ gắn lại nhãn ngày 27/10):

- **Gộp** mọi mục [T-307]: 14 nhắc "Ghi vào bảng Kích thước PR vượt ngưỡng" và NIT `integrity_check` của review #717.
- **Để lại:** không có.

##### Interface / hợp đồng

- Bảng theo mẫu `phase-5.md`: PR | Task | Code sản phẩm | Tổng diff | Lý do nêu trong PR.

##### Test chấp nhận

- [ ] Đầu bảng ghi luật đếm; số của mỗi dòng theo đúng luật đó (lệnh dùng để đếm ghi trong PR).
- [ ] Bảng có mọi PR của milestone Phase 6 vượt ngưỡng theo luật ở đầu bảng, tính tới lúc viết; PR ở biên nằm ở bảng phụ (lệnh rà ghi trong PR). Danh sách rà ngày 26/10 chỉ là điểm xuất phát: 17 PR ở bảng chính (14 PR của sổ, cùng #526, #669, #709) và 2 PR ở biên (#616, #568). Đếm lại theo luật có thể chuyển một PR từ bảng này sang bảng kia; PR ghi lý do.
- [ ] Câu `integrity_check` ghi theo MB ở cả hai file; không còn "1× / 2× / 3×" đứng một mình.
- [ ] Mục "Review đóng phase" không còn dòng "_Còn điền…_".
- [ ] PR chỉ đổi tài liệu (không chạy CI).

Ước lượng: ≈ 60 dòng tài liệu.

##### Định nghĩa hoàn thành

- [ ] Review phiên sạch: PASS (PR docs: không gọi `code-review`)
- [ ] PR sổ sau review chuyển các mục [T-307] sang RESOLVED

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #859 — docs: Phase 6 PR size table, integrity_check by MB, the two fix batches (T-307)

Trạng thái: MERGED · merge 2026-10-27T12:35:36Z · commit `9f9d90e507e19902c63e825a377046f9eb52b034` · nhánh `task/T-307-phase6-metrics` · nhãn: type:task, risk:low

Closes #851

#### Thay đổi

1. **`docs/metrics/phase-6.md`, mục "Kích thước PR vượt ngưỡng"**, tới 27/10 (241 PR merge sau PR đóng Phase 5 #514, từ #515 tới #858; 87 PR có code hoặc test):
   - Luật đếm ở đầu bảng:
     - nguồn: `gh api …/pulls/<n>/files`;
     - phân loại theo `classifyFile` của `tools/size-report-core.mjs`; phần từ `#[cfg(test)]` của file Rust là test; SP gồm `tools/*.mjs` và migration tự viết; SP và tổng cộng cả dòng xóa;
     - không tính: lockfile, SQL / snapshot / journal do drizzle-kit sinh, `seed-data.ts`, khối codemap, `src-tauri/icons/*`;
     - không xét PR không có dòng code hay test nào;
     - bảng phụ cho PR vượt ≤ 6 %.
   - Bảng chính 15 PR, bảng phụ "ở biên" 4 PR. Cột "Lý do nêu trong PR" lấy từ mục cỡ trong thân từng PR (#526, #616 không có mục này).
   - Hai dòng dưới bảng: vì sao số khác sổ; 19 / 87 PR có code vượt ngưỡng.
2. **NIT `integrity_check`** (review #717): ghi theo MB ở `phase-6.md` (mục "Số đo deep review lượt 3") và một câu ở tổng hợp lượt 3 §7.4. Số theo báo cáo gốc Claude B (K2 và bảng đo):
   - file 14,1 / 20,0 / 25,4 MB (×1 / ×2 / ×3 KH mỗi RE);
   - exe 366 / 453 / 546 ms;
   - ngoại suy ≈ 16 ms / MB → 600 ms ở ≈ 28–29 MB.
3. **Mục "Review đóng phase":** thay dòng "_Còn điền…_" bằng ba dòng:
   - đợt sửa lượt 3: #719–#729, cùng #735 và #752;
   - đợt sửa sổ OPEN trước v1.0: T-283…T-304, #771;
   - lượt 4 (T-309 #854) kiểm lại hai đợt này.
   Ngày đóng lấy từ `closedAt` của các Issue.
4. Câu đầu file nhắc thêm hai phần mới.

Chỉ sửa `docs/**`, không file nào thuộc `CODE_DOCS` → không chạy CI.

##### Đếm lại so với danh sách rà 26/10 của Issue

- **Vẫn 19 PR.** Không PR nào khác vượt ngưỡng, không PR nào của danh sách xuống dưới ngưỡng. Bốn PR chỉ tài liệu vượt 800 dòng (kết quả eval #518, báo cáo gốc #609, #651, #718) thuộc loại "không xét".
- **#566 và #817 chuyển sang bảng phụ:**
  - tổng 833 / 820, tức vượt ~800 không quá 6 % (+4,1 % / +2,5 %);
  - SP 287 / 298, dưới ~400;
  - sổ xếp hai PR này cùng các PR vượt ngưỡng; theo luật "ở biên" của Issue (vượt ≤ 6 %), chúng thuộc bảng phụ.
  Bảng chính còn 15 PR.
- **#526: SP 582 (+260 / −322), Issue ghi 621 (+260 / −361).**
  - 39 dòng xóa nằm ở `packages/db/src/seed-data.ts`, là "bảng dữ liệu tĩnh của seed" mà ADR-0001 phụ lục không tính. Đầu file: "Static lists and weights the simulated data picks from (spec §7). Data only, no logic."
  - Luật gợi ý của Issue không nhắc file này; em thêm vào mục "Không tính" để khớp ADR.
  - #526 vẫn ở bảng chính (SP vượt 45 %). Đây là PR duy nhất của phase đụng file này.
- **Số khác sổ / thân PR:**
  - SP cộng cả dòng xóa: #539 497 (sổ ≈ 434), #543 433 (≈ 430), #545 457 (≈ 444). Sổ ghi ba PR này theo dòng thêm.
  - Khối codemap bỏ theo từng dòng, nằm giữa `<!-- codemap:start -->` và `<!-- codemap:end -->` ở cả hai phía của diff. Dòng chữ viết tay của `CLAUDE.md` ngoài khối vẫn tính:
    - #828: 1 294, sổ ghi 1 292; 2 dòng là câu `PERSON_REFERENCES` ở dòng 17 của `packages/db/CLAUDE.md`;
    - #812: 900, sổ ghi ≈ 914; 14 dòng codemap;
    - #805: 930, sổ ghi 937; SP +282 / −136 theo `classifyFile`.

##### Lệnh đếm và rà

Chạy từ gốc repo, `main` @ `61ab39a`:

1. `gh pr list --state merged --search "merged:>=2026-10-09" --limit 1000 --json number,title,mergedAt,headRefOid,additions,deletions,changedFiles > prs.json`. Ranh giới: không PR số ≤ 514 nào merge sau #514 (11/10 08:01Z), không PR số > 514 nào merge trước nó.
2. `node fetch-files.mjs`: gọi `gh api repos/AlexH-AI/Project-2C/pulls/<n>/files --paginate --slurp` cho 241 PR.
3. `git fetch origin refs/pull/<n>/head` cho 43 PR có file Rust, `CLAUDE.md` của package hay migration SQL. Script đọc file ở head và ở `git merge-base origin/main <head>` để tách dòng theo `#[cfg(test)]` / khối codemap, và để biết migration có đầu `-- Custom SQL migration file` không.
4. `node count.mjs`: in bảng chính (vượt > 6 %), bảng phụ (≤ 6 %), PR chỉ tài liệu vượt ngưỡng, và PR có code gần ngưỡng (SP > 360 hoặc tổng > 720).

Kiểm số:
- Cộng `additions` / `deletions` theo file khớp số của PR ở 240 / 241 PR. Riêng #609 (báo cáo gốc, không xét), API cho 9 881 dòng thêm, PR ghi 13 902.
- Mỗi lần tách dòng (Rust, codemap) cộng lại đúng số của file; script ném lỗi nếu lệch.
- Đối chiếu bằng git một file: #750 `storage.rs` có `git diff --numstat` 226 / 12, khớp API; `#[cfg(test)]` ở dòng 599 (head), 552 (base).

<details><summary><code>fetch-files.mjs</code></summary>

```js
// Fetch `pulls/<n>/files` (all pages) for every merged PR after #514 in prs.json, cached as
// files/<n>.json.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const here = import.meta.dirname;
const dir = join(here, 'files');
mkdirSync(dir, { recursive: true });
const prs = JSON.parse(readFileSync(join(here, 'prs.json'), 'utf8'))
  .map((p) => p.number)
  .filter((n) => n > 514)
  .sort((a, b) => a - b);
for (const n of prs) {
  const out = join(dir, `${n}.json`);
  if (existsSync(out)) continue;
  const raw = execFileSync(
    'gh',
    ['api', `repos/AlexH-AI/Project-2C/pulls/${n}/files`, '--paginate', '--slurp'],
    { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  writeFileSync(out, JSON.stringify(JSON.parse(raw).flat()));
  process.stdout.write(`${n} `);
}
console.log(`\ndone: ${prs.length} PRs`);
```

</details>

<details><summary><code>count.mjs</code></summary>

```js
// Size of every merged Phase 6 PR (after #514), by the counting rule of T-307 (#851).
// Input: prs.json (`gh pr list --state merged --json number,title,headRefOid,…`) and
// files/<n>.json (`gh api repos/AlexH-AI/Project-2C/pulls/<n>/files --paginate --slurp`).
// Run from the repo root: the PR heads must be fetched (`git fetch origin refs/pull/<n>/head`).
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const here = import.meta.dirname;
const { classifyFile } = await import(
  pathToFileURL(join(process.cwd(), 'tools/size-report-core.mjs')).href
);

const prs = JSON.parse(readFileSync(join(here, 'prs.json'), 'utf8'))
  .filter((p) => p.number > 514)
  .sort((a, b) => a.number - b.number);

// Not counted at all (ADR-0001 appendix): lock files, drizzle-kit snapshots / journal, the static
// seed tables, icons; drizzle-kit SQL (a migration without the custom-migration header) is decided
// per file below, the codemap block of a package CLAUDE.md per line.
const GENERATED = [
  /(?:^|\/)(?:pnpm-lock\.yaml|Cargo\.lock)$/,
  /^packages\/db\/migrations\/meta\//,
  /^packages\/db\/src\/seed-data\.ts$/,
  /^apps\/desktop\/src-tauri\/icons\//,
];
const MIGRATION_SQL = /^packages\/db\/migrations\/[^/]+\.sql$/;
const CUSTOM_MIGRATION = '-- Custom SQL migration file';
const RUST_TESTS = /^[ \t]*#\[cfg\(test\)\]/;

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

const mergeBases = new Map();
function mergeBase(head) {
  if (!mergeBases.has(head)) {
    mergeBases.set(head, git(['merge-base', 'origin/main', head])?.trim() ?? null);
  }
  return mergeBases.get(head);
}

const show = (sha, path) => (sha ? git(['show', `${sha}:${path}`]) : null);

/** 1-based [from, to] of a file's region, or null: Rust tests to the end, codemap block. */
function region(text, kind) {
  if (text === null) return null;
  const lines = text.split('\n');
  if (kind === 'rust') {
    const at = lines.findIndex((l) => RUST_TESTS.test(l));
    return at < 0 ? null : [at + 1, Infinity];
  }
  const from = lines.findIndex((l) => l.includes('<!-- codemap:start -->'));
  const to = lines.findIndex((l) => l.includes('<!-- codemap:end -->'));
  return from < 0 || to < 0 ? null : [from + 1, to + 1];
}

/** Added / deleted lines of a patch, each with its line number on its side. */
function patchLines(patch) {
  const out = [];
  let oldNo = 0;
  let newNo = 0;
  for (const line of patch.split('\n')) {
    const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
    if (hunk) {
      oldNo = Number(hunk[1]);
      newNo = Number(hunk[2]);
    } else if (line.startsWith('+')) {
      out.push({ side: 'new', no: newNo++ });
    } else if (line.startsWith('-')) {
      out.push({ side: 'old', no: oldNo++ });
    } else if (!line.startsWith('\\')) {
      oldNo++;
      newNo++;
    }
  }
  return out;
}

const inside = (r, no) => r !== null && no >= r[0] && no <= r[1];

/** Split one file's lines: `{ in: {add, del}, out: {add, del} }` by a region of each side. */
function splitByRegion(pr, file, kind) {
  const base = mergeBase(pr.headRefOid);
  const oldR = region(show(base, file.previous_filename ?? file.filename), kind);
  const newR = region(show(pr.headRefOid, file.filename), kind);
  const res = { in: { add: 0, del: 0 }, out: { add: 0, del: 0 } };
  for (const l of patchLines(file.patch)) {
    const hit = l.side === 'new' ? inside(newR, l.no) : inside(oldR, l.no);
    res[hit ? 'in' : 'out'][l.side === 'new' ? 'add' : 'del'] += 1;
  }
  if (res.in.add + res.out.add !== file.additions || res.in.del + res.out.del !== file.deletions) {
    throw new Error(`#${pr.number} ${file.filename}: patch does not add up`);
  }
  return res;
}

const rows = [];
for (const pr of prs) {
  const files = JSON.parse(readFileSync(join(here, 'files', `${pr.number}.json`), 'utf8'));
  const sum = {
    product: { add: 0, del: 0 },
    test: { add: 0, del: 0 },
    other: { add: 0, del: 0 },
    generated: { add: 0, del: 0 },
  };
  const generatedFiles = [];
  const put = (kind, add, del) => {
    sum[kind].add += add;
    sum[kind].del += del;
  };
  for (const f of files) {
    const path = f.filename;
    if (f.additions + f.deletions === 0) continue;
    if (GENERATED.some((r) => r.test(path))) {
      put('generated', f.additions, f.deletions);
      generatedFiles.push(path);
      continue;
    }
    if (MIGRATION_SQL.test(path)) {
      const text = show(pr.headRefOid, path) ?? '';
      if (text.includes(CUSTOM_MIGRATION)) {
        put('product', f.additions, f.deletions);
      } else {
        put('generated', f.additions, f.deletions);
        generatedFiles.push(path);
      }
      continue;
    }
    if (/(?:^|\/)CLAUDE\.md$/.test(path) && path !== 'CLAUDE.md') {
      const s = splitByRegion(pr, f, 'codemap');
      put('generated', s.in.add, s.in.del);
      if (s.in.add + s.in.del) generatedFiles.push(`${path} (codemap)`);
      put('other', s.out.add, s.out.del);
      continue;
    }
    const kind = classifyFile(path);
    if (kind === null) {
      put('other', f.additions, f.deletions);
    } else if (kind.kind === 'product' && path.endsWith('.rs')) {
      const s = splitByRegion(pr, f, 'rust');
      put('test', s.in.add, s.in.del);
      put('product', s.out.add, s.out.del);
    } else if (kind.kind === 'generated') {
      throw new Error(`#${pr.number} ${path}: generated file without a rule`);
    } else {
      put(kind.kind, f.additions, f.deletions);
    }
  }
  const lines = (k) => sum[k].add + sum[k].del;
  const product = lines('product');
  const total = product + lines('test') + lines('other');
  rows.push({
    number: pr.number,
    title: pr.title,
    mergedAt: pr.mergedAt,
    product,
    test: lines('test'),
    other: lines('other'),
    total,
    sum,
    generatedFiles,
    docsOnly: product + lines('test') === 0,
  });
}

writeFileSync(join(here, 'counts.json'), JSON.stringify(rows, null, 1));
const over = (r) => r.product > 400 || r.total > 800;
const far = (r) => r.product > 424 || r.total > 848;
const fmt = (r) =>
  `#${r.number} SP ${r.product} (+${r.sum.product.add}/-${r.sum.product.del}) test ${r.test} (+${r.sum.test.add}/-${r.sum.test.del}) other ${r.other} (+${r.sum.other.add}/-${r.sum.other.del}) TOTAL ${r.total} gen ${r.sum.generated.add + r.sum.generated.del}${r.generatedFiles.length ? ` [${r.generatedFiles.join(', ')}]` : ''} | ${r.title.slice(0, 70)}`;
console.log('== main (over by > 6 %)');
for (const r of rows.filter((r) => !r.docsOnly && far(r))) console.log(fmt(r));
console.log('== edge (over by <= 6 %)');
for (const r of rows.filter((r) => !r.docsOnly && over(r) && !far(r))) console.log(fmt(r));
console.log('== docs-only over');
for (const r of rows.filter((r) => r.docsOnly && over(r))) console.log(fmt(r));
console.log('== near (code, SP > 360 or total > 720, not over)');
for (const r of rows.filter((r) => !r.docsOnly && !over(r) && (r.product > 360 || r.total > 720)))
  console.log(fmt(r));
```

</details>

<details><summary>Output của <code>count.mjs</code> (bỏ tên PR)</summary>

```
== main (over by > 6 %)
#526 SP 582 (+260/-322) test 172 (+163/-9) other 8 (+4/-4) TOTAL 762 gen 51 [packages/ai/CLAUDE.md (codemap), packages/db/CLAUDE.md (codemap), packages/db/src/seed-data.ts, packages/domain/CLAUDE.md (codemap)]
#539 SP 497 (+442/-55) test 461 (+458/-3) other 0 (+0/-0) TOTAL 958 gen 11 [packages/db/CLAUDE.md (codemap)]
#543 SP 433 (+427/-6) test 482 (+482/-0) other 0 (+0/-0) TOTAL 915 gen 2 [apps/desktop/CLAUDE.md (codemap)]
#545 SP 457 (+443/-14) test 371 (+367/-4) other 0 (+0/-0) TOTAL 828 gen 2 [apps/desktop/CLAUDE.md (codemap)]
#572 SP 9 (+8/-1) test 829 (+829/-0) other 87 (+86/-1) TOTAL 925 gen 0
#669 SP 298 (+178/-120) test 641 (+543/-98) other 7 (+2/-5) TOTAL 946 gen 2 [packages/db/CLAUDE.md (codemap)]
#709 SP 287 (+281/-6) test 573 (+573/-0) other 0 (+0/-0) TOTAL 860 gen 1279 [packages/db/CLAUDE.md (codemap), packages/db/migrations/meta/0011_snapshot.json, packages/db/migrations/meta/_journal.json]
#710 SP 477 (+405/-72) test 533 (+500/-33) other 71 (+54/-17) TOTAL 1081 gen 0
#801 SP 432 (+205/-227) test 353 (+182/-171) other 0 (+0/-0) TOTAL 785 gen 18 [packages/db/CLAUDE.md (codemap), packages/domain/CLAUDE.md (codemap)]
#805 SP 418 (+282/-136) test 510 (+401/-109) other 2 (+1/-1) TOTAL 930 gen 1297 [packages/db/CLAUDE.md (codemap), packages/db/migrations/0012_trash_lookups.sql, packages/db/migrations/meta/0012_snapshot.json, packages/db/migrations/meta/_journal.json]
#812 SP 666 (+376/-290) test 220 (+164/-56) other 14 (+7/-7) TOTAL 900 gen 14 [packages/ai/CLAUDE.md (codemap), packages/db/CLAUDE.md (codemap)]
#828 SP 549 (+405/-144) test 733 (+711/-22) other 12 (+7/-5) TOTAL 1294 gen 8 [packages/db/CLAUDE.md (codemap), packages/domain/CLAUDE.md (codemap)]
#833 SP 527 (+337/-190) test 342 (+295/-47) other 9 (+5/-4) TOTAL 878 gen 2 [apps/desktop/CLAUDE.md (codemap)]
#835 SP 753 (+567/-186) test 796 (+728/-68) other 29 (+14/-15) TOTAL 1578 gen 2 [packages/db/CLAUDE.md (codemap)]
#845 SP 791 (+385/-406) test 312 (+220/-92) other 0 (+0/-0) TOTAL 1103 gen 6 [apps/desktop/CLAUDE.md (codemap), packages/ui/CLAUDE.md (codemap)]
== edge (over by <= 6 %)
#566 SP 287 (+272/-15) test 546 (+404/-142) other 0 (+0/-0) TOTAL 833 gen 2 [packages/db/CLAUDE.md (codemap)]
#568 SP 406 (+406/-0) test 299 (+299/-0) other 0 (+0/-0) TOTAL 705 gen 0
#616 SP 423 (+364/-59) test 323 (+303/-20) other 22 (+11/-11) TOTAL 768 gen 2 [packages/db/CLAUDE.md (codemap)]
#817 SP 298 (+210/-88) test 473 (+429/-44) other 49 (+32/-17) TOTAL 820 gen 2 [packages/domain/CLAUDE.md (codemap)]
== docs-only over
#518 SP 0 (+0/-0) test 0 (+0/-0) other 4410 (+4399/-11) TOTAL 4410 gen 0
#609 SP 0 (+0/-0) test 0 (+0/-0) other 9881 (+9881/-0) TOTAL 9881 gen 0
#651 SP 0 (+0/-0) test 0 (+0/-0) other 8727 (+8727/-0) TOTAL 8727 gen 0
#718 SP 0 (+0/-0) test 0 (+0/-0) other 7531 (+7531/-0) TOTAL 7531 gen 0
== near (code, SP > 360 or total > 720, not over)
#516 SP 214 (+138/-76) test 249 (+205/-44) other 282 (+236/-46) TOTAL 745 gen 2 [packages/ai/CLAUDE.md (codemap)]
#517 SP 271 (+202/-69) test 474 (+426/-48) other 2 (+2/-0) TOTAL 747 gen 0
#521 SP 319 (+260/-59) test 423 (+411/-12) other 19 (+13/-6) TOTAL 761 gen 7 [packages/ai/CLAUDE.md (codemap)]
#678 SP 357 (+357/-0) test 360 (+360/-0) other 33 (+26/-7) TOTAL 750 gen 0
#693 SP 380 (+244/-136) test 285 (+261/-24) other 0 (+0/-0) TOTAL 665 gen 3 [packages/ui/CLAUDE.md (codemap)]
#698 SP 177 (+119/-58) test 360 (+315/-45) other 219 (+199/-20) TOTAL 756 gen 0
#846 SP 379 (+217/-162) test 286 (+234/-52) other 4 (+2/-2) TOTAL 669 gen 2 [apps/desktop/CLAUDE.md (codemap)]
```

</details>

#### Test chấp nhận

- [x] Đầu bảng ghi luật đếm; số của mỗi dòng theo đúng luật đó (lệnh ở mục "Lệnh đếm và rà").
- [x] Bảng có mọi PR vượt ngưỡng tới #858 (27/10); PR ở biên ở bảng phụ (lệnh rà: cùng `count.mjs`, khối "edge"). #566, #817 chuyển sang bảng phụ, lý do ở trên.
- [x] Câu `integrity_check` ghi theo MB ở cả hai file; `grep "1× / 2× / 3×"` trên hai file không còn kết quả.
- [x] Mục "Review đóng phase" không còn dòng "_Còn điền…_".
- [x] PR chỉ đổi tài liệu: 2 file, đúng danh sách của Issue (§7.4 của tổng hợp: một câu).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `61ab39a`), 15 mục "Trùng file", đều [T-307]:

- L13 #539: **đã sửa**, bảng chính (SP 497, tổng 958).
- L15 #543: **đã sửa**, bảng chính (SP 433, tổng 915).
- L17 #545: **đã sửa**, bảng chính (SP 457, tổng 828).
- L19 #566: **đã sửa**, bảng phụ (SP 287, tổng 833): chỉ vượt tổng, ≤ 6 %.
- L21 #572: **đã sửa**, bảng chính (SP 9, tổng 925).
- L23 #710: **đã sửa**, bảng chính (SP 477, tổng 1 081).
- L25 NIT `integrity_check` theo MB: **đã sửa** ở `phase-6.md` và tổng hợp lượt 3 §7.4.
- L29 #801: **đã sửa**, bảng chính (SP 432, tổng 785).
- L31 #805: **đã sửa**, bảng chính (SP 418, tổng 930).
- L33 #812: **đã sửa**, bảng chính (SP 666, tổng 900).
- L35 #817: **đã sửa**, bảng phụ (SP 298, tổng 820): chỉ vượt tổng, ≤ 6 %.
- L39 #828: **đã sửa**, bảng chính (SP 549, tổng 1 294).
- L41 #833: **đã sửa**, bảng chính (SP 527, tổng 878).
- L43 #835: **đã sửa**, bảng chính (SP 753, tổng 1 578).
- L47 #845: **đã sửa**, bảng chính (SP 791, tổng 1 103).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (không đổi dependency)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low` (chỉ docs; không chạm golden hay `CODE_DOCS`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-307 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #539, #543, #545, #566, #572, #710, #717, #801, #805, #812, #817, #828, #833, #835, #845 — T-307 (#851, PR #859, `REVIEW: PASS` @`130f6fd`):
  - #539, `docs/metrics/phase-6.md` ("Kích thước PR vượt ngưỡng", bảng chính): SP 497 (+442 / −55), tổng 958. Mọi dòng của bảng đếm theo luật ghi ở đầu bảng (SP và tổng cộng cả dòng xóa; không tính lockfile, file drizzle-kit sinh, `seed-data.ts`, khối codemap), thay số của sổ.
  - #543, bảng chính: SP 433 (+427 / −6), tổng 915.
  - #545, bảng chính: SP 457 (+443 / −14), tổng 828.
  - #566, bảng phụ "ở biên": SP 287, tổng 833; chỉ vượt ~800 tổng, không quá 6 %.
  - #572, bảng chính: SP 9 (+8 / −1), tổng 925.
  - #710, bảng chính: SP 477 (+405 / −72), tổng 1 081.
  - #717 NIT, `docs/metrics/phase-6.md` ("Số đo deep review lượt 3", dòng `integrity_check`) và `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §7.4: ghi theo MB, "366 / 453 / 546 ms ở file 14,1 / 20,0 / 25,4 MB (×1 / ×2 / ×3 KH mỗi RE), chạm 600 ms ở ≈ 28–29 MB (≈ 2× cỡ file dữ liệu tải)"; `phase-6.md` ghi thêm ≈ 7,5 ms / MB là số đo trong Node, ngoại suy trên exe ≈ 16 ms / MB.
  - #801, bảng chính: SP 432 (+205 / −227), tổng 785.
  - #805, bảng chính: SP 418 (+282 / −136), tổng 930.
  - #812, bảng chính: SP 666 (+376 / −290), tổng 900.
  - #817, bảng phụ "ở biên": SP 298, tổng 820; chỉ vượt ~800 tổng, không quá 6 %.
  - #828, bảng chính: SP 549 (+405 / −144), tổng 1 294 (2 dòng chữ viết tay ngoài khối codemap của `packages/db/CLAUDE.md` vẫn tính).
  - #833, bảng chính: SP 527 (+337 / −190), tổng 878.
  - #835, bảng chính: SP 753 (+567 / −186), tổng 1 578.
  - #845, bảng chính: SP 791 (+385 / −406), tổng 1 103.

---

# Issue #852 — T-308: Tên và nhận diện Heritas L-CRM: logo gốc trên nền tối viền champagne, icon, slogan

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

App mang tên **Heritas L-CRM**, slogan "Where legacy meets trust", dùng logo của Owner thay chữ "Project-2C" và ô "2C".

1. **Góc trên sidebar** (thay ô "2C" + "Project-2C"): khối logo dọc, căn giữa, giữ màu gốc trên nền tối.
   - **Cây và vòng cung** (cắt từ ảnh gốc), rộng ≈ 88 px.
   - **Chữ "Heritas"** (cắt từ ảnh gốc, giữ chiếc lá thay dấu chấm chữ "i"), rộng ≈ 150 px.
   - **"— L-CRM —"** (cắt từ ảnh gốc, màu vàng), cùng tỉ lệ với "Heritas".
   - **Slogan:** chữ thật, Playfair Display nghiêng 400, 13 px, màu champagne nhạt, không viền. Viền trên chữ nghiêng 13 px sẽ nhòe.
   - **Viền:** cây và "Heritas" có viền rất mỏng màu champagne nhạt, đủ để lá và chữ màu navy nổi trên nền tối mà không cần ô trắng. "L-CRM" đã là màu vàng nên không cần viền.
2. **Tên app:**
   - tiêu đề cửa sổ "<Màn> · Heritas L-CRM" (`app.title`);
   - `productName` và `title` cửa sổ của exe; `<title>` của bản web;
   - `description` của `Cargo.toml`.
3. **Icon exe / taskbar / tab:** cây trên ô trắng bo góc.
   - `src-tauri/icons/*` sinh lại bằng `tauri icon` từ một nguồn vuông, giữ đúng 5 file đã khai, như T-017 (#128).
   - Favicon của bản web lấy từ cùng nguồn.
4. **Font:** đóng gói cục bộ Playfair Display nghiêng 400, bộ chữ Latin (`@fontsource/playfair-display`, OFL), như cách làm với Be Vietnam Pro; thêm token `--font-brand`.

##### Bối cảnh

- **Owner 26/10, phạm vi đổi tên v1.0:** chỉ phần nhìn thấy, gồm logo, icon và tên ở góc. Giữ nguyên:
  - repo, gh, tên mã "Project-2C", `@p2c/*`;
  - file `project2c.exe`, thư mục `Project2C-data\`, `project2c.db`, tên và đuôi backup;
  - các câu báo lỗi, kể cả bốn câu có chữ "Project-2C";
  - `KEY_SERVICE` (key OpenCode), `BACKUP_FORMAT`, `identifier`.
- **Owner 27/10:**
  - tên v1 là "Heritas L-CRM", slogan "Where legacy meets trust" (in nghiêng, thanh lịch); logo và phong cách theo ảnh Owner gửi;
  - sau bản thử chạy trên app, Owner chọn cách (c): logo gốc trên nền tối, viền champagne mỏng. Đây là duyệt **G3**;
  - duyệt font Playfair Display (**G4**).
- **Bản thử 27/10** (worktree tạm, đã xóa) đã kiểm:
  - vừa cửa sổ nhỏ nhất 1100 × 700: thấy đủ menu và dòng trạng thái lưu;
  - viền ở mật độ 1× là một nét 1 px.

##### Tài liệu cần đọc

- Thân Issue này (thông số đã duyệt, mục "Interface / hợp đồng")
- Nhánh `task/T-308-heritas-brand`, commit WIP 27/10:
  - `apps/desktop/brand/heritas-logo.webp`: ảnh gốc Owner gửi, 1254 × 1254, nền trắng;
  - `apps/desktop/brand/heritas-logo-transparent.png`: bản tách nền trắng dùng cho bản thử (chỉ vùng sát nền được pha, phần trong giữ đục).
- `apps/desktop/src/shell/Sidebar.tsx`; `apps/desktop/src/shell/AppShell.tsx` (tiêu đề cửa sổ); `apps/desktop/src/i18n/vi.ts` (`app.title`)
- `apps/desktop/index.html`, `apps/desktop/app-icon.svg`, `apps/desktop/src-tauri/tauri.conf.json`, `apps/desktop/src-tauri/Cargo.toml`; thân PR #128 (T-017: cách sinh icon)
- `packages/ui/src/fonts.css`, `packages/ui/src/tokens.css`, `packages/ui/src/theme.css`, `packages/ui/src/token-guard.ts` (`pnpm lint:tokens`: không `style` inline, không màu thô ngoài token)
- `e2e/theme.spec.ts` (ca "the tab shows the icon of the app, built from its one source"), `e2e/navigation.spec.ts` (tiêu đề)
- ADR-0013 (hướng UI, font); `.claude/rules/i18n-ui.md`; `.claude/rules/mockups.md`; `docs/design/mockups/mockups.css` (`.brand`, `.brand-mark`)
- `docs/user-guide/README.md`, `docs/user-guide/01-bat-dau.md`

##### File / thư mục được phép sửa

- **Giao diện:**
  - `apps/desktop/src/shell/Sidebar.tsx`, `apps/desktop/src/shell/Brand.tsx` (mới) + test nếu có logic
  - `apps/desktop/src/i18n/vi.ts` (`app.title`, `app.slogan`)
  - `apps/desktop/index.html`, `apps/desktop/app-icon.*`, `apps/desktop/brand/**`, `apps/desktop/public/**` hoặc `apps/desktop/src/assets/**` (ảnh logo đã cắt)
- **Build exe:** `apps/desktop/src-tauri/icons/**`, `apps/desktop/src-tauri/tauri.conf.json` (`productName`, `title`), `apps/desktop/src-tauri/Cargo.toml` (`description`)
- **Font và token:** `packages/ui/src/fonts/**`, `packages/ui/src/fonts.css`, `packages/ui/src/tokens.css`, `packages/ui/src/theme.css`
- **Test:** `e2e/theme.spec.ts`, `e2e/navigation.spec.ts`, `e2e/**` (ca mới cho khối logo)
- **Mockup:** `docs/design/mockups/*.html` (khối `.brand`), `docs/design/mockups/mockups.css`, `docs/design/mockups/**` (ảnh logo cho mockup), `docs/design/mockups/README.md`
- **Tài liệu:**
  - `docs/user-guide/README.md`, `docs/user-guide/01-bat-dau.md`
  - `docs/testing/nghiem-thu-v1.md` (dòng kiểm logo, icon, tiêu đề)
  - `docs/decisions/0013-huong-ui-dark-mode.md` (phụ lục: font thương hiệu, logo dạng ảnh)
  - `docs/PROJECT-STATE.md` (quyết định Owner 26–27/10)
- **Codemap:** `apps/desktop/CLAUDE.md`, `packages/ui/CLAUDE.md` (khối codemap)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` (sổ @ `de57d40`):

- **Để lại:**
  - các mục trùng `docs/testing/nghiem-thu-v1.md` thuộc T-306;
  - mục `WEB_MODE.tone` (nêu `Sidebar.tsx:90`) thuộc T-305.
- Làm T-308 sau T-306 thì rebase file nghiệm thu.

##### Interface / hợp đồng

- **Thông số khối logo** (G3 duyệt 27/10):
  - Vùng cắt trong ảnh gốc 1254 px:
    - cây `{ x: 296, y: 112, w: 674, h: 630 }`;
    - "Heritas" `{ x: 185, y: 740, w: 885, h: 218 }`;
    - "L-CRM" kèm hai vạch `{ x: 238, y: 975, w: 777, h: 75 }`.
  - Bố cục dọc, căn giữa:
    - cây rộng 88 px, cách "Heritas" 6 px;
    - "Heritas" rộng 150 px; "L-CRM" cùng tỉ lệ (≈ 132 px), cách "Heritas" 4 px;
    - slogan cách "L-CRM" 7 px.
  - Viền của cây và "Heritas": `drop-shadow(0.5px 0 0 C) drop-shadow(-0.5px 0 0 C) drop-shadow(0 0.5px 0 C) drop-shadow(0 -0.5px 0 C)`, với `C = rgba(232, 211, 162, 0.95)`.
  - Slogan: Playfair Display italic 400, 13 px / 1.3, `#e8d3a2`, `letter-spacing: .01em`.
  - Màu và font là token (`packages/ui/src/tokens.css`). Viền là class CSS, không dùng `style` inline (`pnpm lint:tokens`).
- **Ảnh trong app:**
  - Ba mảnh cắt sẵn (PNG nền trong suốt, ≈ 3× cỡ hiện, tổng ≲ 150 KB), hiện bằng `<img>`. Không đưa ảnh 1254 px vào app.
  - Nếu Owner gửi bản nền trong suốt xuất từ công cụ tạo ảnh (≥ 1024 px), dùng bản đó thay bản tách nền của bản thử.
- **Trình đọc màn hình:** khối logo có tên "Heritas L-CRM" (`app.title`); các mảnh ảnh `alt=""`.
- **Icon:**
  - Nguồn vuông 1024 px: ô trắng bo góc chứa cây, phóng ≤ 1,3× từ ảnh gốc.
  - `tauri icon` sinh `src-tauri/icons/*`; favicon PNG lấy từ cùng nguồn.
  - `e2e/theme.spec.ts` vẫn kiểm tab dùng icon từ đúng một nguồn.
- **Tên app** chỉ đổi phần chữ hiển thị: `app.title`, `productName`, `title` cửa sổ, `<title>`, `description`. Câu báo lỗi và tên file giữ "Project-2C" / "project2c" (Owner 26/10).

##### Test chấp nhận

- [ ] Sidebar: khối logo có tên "Heritas L-CRM" và hiện slogan "Where legacy meets trust"; không còn ô "2C" (e2e).
- [ ] Tiêu đề cửa sổ / trang là "<Màn> · Heritas L-CRM" (e2e `navigation.spec.ts`).
- [ ] Tab dùng icon từ một nguồn (e2e `theme.spec.ts`, theo nguồn mới).
- [ ] Ở cửa sổ 1100 × 700, dòng trạng thái lưu và mục menu cuối vẫn thấy mà không cuộn (e2e).
- [ ] Font Playfair Display nạp cục bộ, không gọi mạng; CSP của exe giữ nguyên.
- [ ] `pnpm lint:tokens` xanh: không màu thô, không `style` inline.
- [ ] Exe build từ PR (nhãn `build-exe`): icon exe / taskbar là cây trên ô trắng, tiêu đề cửa sổ đúng. Ảnh chụp đặt trong thân PR để Owner xem.
- [ ] Khối `.brand` của 6 mockup (`appointments`, `customer`, `customers`, `settings-data`, `team`, `trash`) theo logo mới.
- [ ] Hướng dẫn: tên sản phẩm ở `README.md`, `01-bat-dau.md` là "Heritas L-CRM"; câu báo trích nguyên văn giữ nguyên.
- [ ] `pnpm verify` + e2e xanh.

Ước lượng: ≈ 120 dòng SP + ≈ 60 dòng test. Ảnh, icon và font là tài sản / file sinh, không tính vào dòng.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh, kể cả build exe (nhãn `build-exe`)
- [ ] Review phiên sạch: PASS
- [ ] Ảnh hướng dẫn chụp lại ở G7, sau vòng review toàn bộ code (không thuộc Issue này)

##### Rủi ro

risk:med (đổi file build exe; Owner merge)

##### Bị chặn bởi

Không

## PR #861 — feat: show the app as Heritas L-CRM: logo, slogan font, icons and titles (T-308)

Trạng thái: MERGED · merge 2026-10-27T15:25:59Z · commit `c4eec8b65725f59c7534f6ef2c9292041ee41e96` · nhánh `task/T-308-heritas-brand` · nhãn: type:task, risk:med, build-exe

Closes #852

#### Thay đổi

1. **Khối logo ở góc sidebar** (`apps/desktop/src/shell/Brand.tsx` mới, `Sidebar.tsx`) theo thông số G3 27/10 của Issue:
   - Ba mảnh cắt từ bản tách nền 1254 px của nhánh WIP, đúng vùng cắt của Issue: cây và vòng cung `heritas-tree.png` 264 × 247, "Heritas" `heritas-wordmark.png` 450 × 111, "— L-CRM —" `heritas-lcrm.png` 395 × 38. Các mảnh ở 3× cỡ hiện, tổng 149 KB, nằm ở `apps/desktop/src/assets/brand/`.
   - Hiện bằng `<img alt="">`, rộng 88 / 150 / 132 px (`w-22`, `w-37.5`, `w-33`). Cây cách "Heritas" 6 px, "Heritas" cách "L-CRM" 4 px, slogan cách "L-CRM" 7 px. `width` / `height` của ảnh giữ chỗ, nên sidebar không nhảy khi ảnh nạp.
   - Khung ba ảnh là `role="img"` tên "Heritas L-CRM" (`app.title`). Slogan là chữ thật `app.slogan`, nằm ngoài khung: trình đọc màn hình đọc "Heritas L-CRM", rồi slogan.
   - **Viền:** class `brand-outline` (`@utility` trong `packages/ui/src/theme.css`) chỉ ở cây và "Heritas". Gồm bốn `drop-shadow` 0,5 px màu `--brand-outline` = `rgba(232, 211, 162, 0.95)`.
   - **Slogan:** class `brand-slogan` (`@utility`): `--font-brand` (Playfair Display) nghiêng 400, 13 px / 1.3, `letter-spacing: .01em`. Màu `--brand-slogan` #E8D3A2, 12:1 trên `--bg-1`.
   - Màu và font là token mới ở `packages/ui/src/tokens.css`. Hai utility đọc thẳng token; `--font-brand` không vào `@theme`, nên không có biến Tailwind tự tham chiếu. Không `style` inline, không giá trị tùy ý (`pnpm lint:tokens` xanh).
2. **Font** (`packages/ui/src/fonts.css`):
   - Một file `playfair-display-latin-400-italic.woff2` (21,9 KB), chép từ tarball npm `@fontsource/playfair-display` 5.3.0, `unicode-range` Latin của gói.
   - License riêng `fonts/OFL-playfair-display.txt`; `OFL.txt` giữ bản của Be Vietnam Pro.
   - Không thêm dependency. CSP của exe không đổi (`font-src 'self' data:`).
3. **Tên app:**
   - `app.title` = "Heritas L-CRM": tiêu đề "<Màn> · Heritas L-CRM" và tên khối logo.
   - `productName`, `title` cửa sổ (`tauri.conf.json`); `<title>` (`index.html`); `description` (`Cargo.toml`).
   - `app.title` chỉ dùng ở `AppShell.tsx` và `Sidebar.tsx` (đã grep). Câu báo lỗi, tên file backup… không đổi: bốn câu báo vẫn có "Project-2C", như Owner chốt.
4. **Icon:**
   - Nguồn mới `apps/desktop/app-icon.png` 1024 px, thay `app-icon.svg` (đã xóa): ô trắng bo góc (bán kính 224 px) chứa cây cắt từ ảnh gốc `.webp`, phóng 1,3×. Màu ô là #FEFEFE, trùng nền ảnh gốc (254), nên mép vùng cắt không lộ.
   - `src-tauri/icons/*` sinh lại bằng `pnpm --filter @p2c/desktop tauri icon app-icon.png`. Chỉ giữ 5 file đã khai, như #128. CLI sinh thêm Android / iOS / Store / `icon.icns` / `64x64.png`: đã bỏ.
   - Favicon bản web: `index.html` trỏ `./src-tauri/icons/32x32.png`, là icon 32 px `tauri icon` sinh từ cùng nguồn. Ảnh nguồn 747 KB không vào bản build. e2e so từng byte với file đó.
   - Tên exe vẫn `project2c.exe`: Tauri lấy tên binary từ cargo (`name = "project2c"`), `productName` không đổi tên file, đường dẫn upload của CI giữ nguyên. Exe build local: Properties → Details ghi Product name / File description "Heritas L-CRM".
5. **Mockup:**
   - Khối `.brand` của 6 mockup (`appointments`, `customer`, `customers`, `settings-data`, `team`, `trash`) theo logo mới; ba mảnh ảnh ở `docs/design/mockups/img/`.
   - `mockups.css` thêm token và lớp như app, bỏ `.brand-mark`. Playfair Display nạp từ Google Fonts, như Be Vietnam Pro của mockup.
   - `README.md` của mockup ghi khối này.
6. **Tài liệu:**
   - Hướng dẫn (`README.md`, `01-bat-dau.md`): đổi tên sản phẩm, thêm câu "tên mã Project-2C còn ở tên file và câu báo". Câu báo trích nguyên văn giữ nguyên.
   - Nghiệm thu: NT-CH-09 (logo, tiêu đề, cửa sổ nhỏ nhất), NT-EX-13 (icon, tên file, Details).
   - ADR-0013 phụ lục 27/10; `PROJECT-STATE.md`: quyết định Owner 26–27/10.

7. **`e2e/save-state.spec.ts`:** helper `saveState` lấy đoạn văn cuối của sidebar. Slogan là đoạn văn thứ hai của sidebar, nên `getByRole('paragraph')` không còn là duy nhất (5 ca đỏ ở lượt e2e đầu).

Lịch sử nhánh: nhánh rebase lên `main` (`38850da`) trước khi làm. Head cũ `61848a5` (commit WIP, cùng 2 ảnh gốc) được merge lại ở `97e9420` để push là fast-forward, không ghi đè nhánh remote; cây không đổi, diff với `main` không đổi.

Cỡ: SP ≈ 89 dòng, test ≈ 124, tài liệu / mockup ≈ 180. Ảnh, icon, font, license là tài sản / file sinh. Rust: chỉ `description` của `Cargo.toml`, không sửa code Rust; `verify:rust` chạy trong job build exe của CI.

#### Ảnh exe

Chụp từ exe build local (`pnpm build:exe`) chạy trong thư mục tạm. Cây build trùng `3d821ec` ở mọi file vào exe; các commit sau chỉ sửa test và ảnh của thân PR. Artifact CI của head để anh kiểm lại.

Ảnh nằm ở commit `78ac9ee` của nhánh (thư mục `.pr-assets/T-308/`) và bị xóa ở commit sau, nên không có trong diff. Lý do: `gh` không tải ảnh lên thân PR được. Ảnh cửa sổ đã cắt bỏ phần taskbar của máy, chỉ giữ nút của app.

Cửa sổ exe: logo, tiêu đề "Cài đặt · Heritas L-CRM" (app mở lại màn dùng lần trước), icon ở góc thanh tiêu đề:

![Cửa sổ exe](https://raw.githubusercontent.com/AlexH-AI/Project-2C/78ac9ee3124aacba9d470c02627aa843c3a88d00/.pr-assets/T-308/exe-window.png)

Thanh tiêu đề, nút taskbar "Heritas L-CRM - 1 running window" (×4), icon của file exe (×4, Explorer):

![Thanh tiêu đề](https://raw.githubusercontent.com/AlexH-AI/Project-2C/78ac9ee3124aacba9d470c02627aa843c3a88d00/.pr-assets/T-308/exe-titlebar.png)

![Taskbar](https://raw.githubusercontent.com/AlexH-AI/Project-2C/78ac9ee3124aacba9d470c02627aa843c3a88d00/.pr-assets/T-308/exe-taskbar-x4.png) ![Icon exe](https://raw.githubusercontent.com/AlexH-AI/Project-2C/78ac9ee3124aacba9d470c02627aa843c3a88d00/.pr-assets/T-308/exe-icon-x4.png)

Bản web: khối logo ở 2×, và cửa sổ nhỏ nhất 1 100 × 700:

![Logo 2x](https://raw.githubusercontent.com/AlexH-AI/Project-2C/78ac9ee3124aacba9d470c02627aa843c3a88d00/.pr-assets/T-308/web-brand-2x.png)

![1100 x 700](https://raw.githubusercontent.com/AlexH-AI/Project-2C/78ac9ee3124aacba9d470c02627aa843c3a88d00/.pr-assets/T-308/web-1100x700.png)

#### Test chấp nhận

- [x] Sidebar: khối logo tên "Heritas L-CRM", hiện slogan "Where legacy meets trust", không còn "2C" (`e2e/smoke.spec.ts`). Ba ảnh nạp được, `alt=""`, rộng 88 / 150 / 132 px; viền ở cây và "Heritas", không ở "L-CRM" (`e2e/theme.spec.ts`).
- [x] Tiêu đề "<Màn> · Heritas L-CRM" (`e2e/navigation.spec.ts`), cả trang lẫn thanh tiêu đề exe giả.
- [x] Tab dùng icon từ một nguồn (`e2e/theme.spec.ts`): `/assets/32x32-<hash>.png` trùng từng byte `src-tauri/icons/32x32.png`; `dist/` không có `favicon.*`.
- [x] Cửa sổ 1 100 × 700 (`e2e/navigation.spec.ts`): logo, mục "Cài đặt" và dòng trạng thái lưu thấy trọn, `scrollY` = 0, dòng trạng thái không che mục cuối.
- [x] Playfair Display nạp cục bộ (`e2e/theme.spec.ts`): `/assets/playfair-display-latin-400-italic-<hash>.woff2` từ localhost, đúng một face nghiêng 400. Slogan dùng font đó, 13 px, màu #E8D3A2. Ca "no requests to hosts other than localhost" vẫn xanh; CSP không đổi.
- [x] `pnpm lint:tokens` xanh (trong `pnpm verify`).
- [x] Exe: icon exe / taskbar / thanh tiêu đề là cây trên ô trắng, tiêu đề đúng (ảnh trên, exe build local cùng mã).
- [x] Khối `.brand` của 6 mockup theo logo mới: đã chụp từng mockup, ảnh 88 / 150 / 132 px, slogan Playfair.
- [x] Hướng dẫn: tên sản phẩm ở `README.md`, `01-bat-dau.md` là "Heritas L-CRM"; câu báo trích nguyên văn giữ "Project-2C".
- [x] `pnpm verify` + `pnpm e2e` xanh ở local.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `29bed5c`): không có ghi chú OPEN nào nêu các file của PR.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005: font chép file như Be Vietnam Pro, Owner duyệt G4 27/10
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` (đổi file build exe; Owner merge). Nhãn `build-exe`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-308 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #865 — T-310: Mục sổ phần code trước lượt 4: HEADING còn sót, stageBadge, lang của slogan, tên app một nguồn, ảnh logo, PACKAGES

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sửa các mục sổ OPEN thuộc về code trước lượt 4 deep review (B2: lượt 4 chỉ chạy khi sổ OPEN rỗng). App không đổi hành vi, chữ hay giao diện.

1. **`HEADING` còn viết thẳng (review #855):** bốn tiêu đề (Lịch hẹn ×2, Cài đặt, Hợp đồng của hồ sơ KH) còn viết chuỗi của `HEADING` với một class khoảng cách chen giữa, nên lệnh `rg` của T-305 không bắt. Đổi thành `HEADING` cộng class khoảng cách, như Team (`${HEADING} mb-2`). Ba tiêu đề phụ dùng `mt-*` (khung AI của Lịch hẹn, `SUBHEADING` của KYC Intelligence, lịch sử AI) không phải `HEADING`: giữ nguyên.
2. **Doc comment của `stage-badge.tsx` (review #855, NIT):** ô "Bản ghi" của Thùng rác vẽ `StageBadge` tay với nhãn của `recordBadge`, nên câu "the one helper of every screen" không còn đúng. Chọn trong task: thêm `label?` cho `stageBadge` để ô gọi, hoặc doc comment ghi ngoại lệ Thùng rác. PR ghi lý do.
3. **`lang="en"` cho slogan (review #861):** slogan tiếng Anh nằm trong trang `lang="vi"`, nên trình đọc màn hình đọc theo âm tiếng Việt (WCAG 3.1.2). Thêm `lang="en"` cho slogan của khối logo app, và cho `<p class="brand-slogan">` của sáu mockup có sidebar. Đây là mã ngôn ngữ, không phải chuỗi UI.
4. **Bảng "Tokens màu" của mockup G3 (review #861, NIT):** thêm `--brand-slogan` (#E8D3A2) và `--brand-outline`, hai token đã duyệt ở phụ lục 27/10 của ADR-0013.
5. **Dòng `scrollY` = 0 luôn đúng (review #861):** mở app không cuộn trang, nên phép kiểm ngay sau `goto` không canh gì. Bỏ dòng đó; ca vẫn dựa vào ba `toBeInViewport` và phép so hộp.
6. **Tên "Heritas L-CRM" ở năm chỗ (review #861, có thể là *Shotgun Surgery*):** e2e chỉ kiểm tiêu đề do app đặt, nên đổi tên mà sót `productName` hay `title` thì CI vẫn xanh. Thêm một ca unit buộc `productName`, `title` cửa sổ và `<title>` của trang khớp `app.title`; `description` của `Cargo.toml` thì tùy task.
7. **Ảnh logo trùng byte giữa mockup và app (review #861, có thể là *Duplicated Code*):** chọn trong task:
   - mockup trỏ thẳng ảnh của app, bỏ ba bản sao; hoặc
   - giữ bản sao (mockup G3 không đổi theo app), PR ghi lý do để PR sổ chuyển mục sang ACCEPTED.
8. **`PACKAGES` của `size-report-core` (review #863):** năm file mới ở `routes/` chưa vào gói nào, nên `size-report` xếp vào "Chưa xếp gói". Xếp như §L4.3 của kế hoạch lượt 4: `classes.ts`, `stage-badge.tsx`, `money-view.ts` và test vào D; `ConfirmWordDialog.tsx` vào E.

##### Bối cảnh

- Kế hoạch lượt 4 (T-309 #854, PR #863; Owner duyệt G1 28/10), §L4.2 "Đợt sửa mục OPEN trước lượt 4" và §L4.11 mục 8: T-310 code, T-311 tài liệu, T-312 chụp lại ảnh hướng dẫn (làm sau T-310). Việc ghi quyết định DeepSeek qua DSH ngày 28/10 là Issue riêng, T-313 (Owner 28/10).
- Các mục trên là mục [T-310] của sổ (PR sổ gắn lại nhãn ngày 28/10). Ghi chú không chặn mới của review PR này cũng sửa trước khi ghim SHA lượt 4 (B2).
- Mockup: chỉ thêm thuộc tính `lang`, hai dòng token đã duyệt, và đường dẫn ảnh nếu chọn bỏ bản sao. Không đổi nội dung hay bố cục nên không qua G3 (luật mockup). PR ghi rõ; review thấy khác thì Owner duyệt G3 trên PR.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-310]
- `docs/process/deep-review-phase-1-6.md` §L4.2 (bảng "Đợt sửa mục OPEN trước lượt 4"), §L4.3 (xếp tay năm file)
- `apps/desktop/src/routes/classes.ts` (`HEADING`); `apps/desktop/src/routes/team/TeamScreen.tsx` (mẫu `${HEADING} mb-2`); bốn tiêu đề ở `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx`, `apps/desktop/src/routes/Settings.tsx`, `apps/desktop/src/routes/customers/CustomerPolicies.tsx`
- `apps/desktop/src/routes/stage-badge.tsx`; `apps/desktop/src/routes/SettingsTrash.tsx` (`RecordCell`); `apps/desktop/src/routes/trash-view.ts` (`recordBadge`)
- `apps/desktop/src/shell/Brand.tsx`; `e2e/theme.spec.ts` (ca slogan); `docs/decisions/0013-huong-ui-dark-mode.md` phụ lục 27/10
- `.claude/rules/mockups.md`; `docs/design/mockups/README.md` (khối `.brand`); `docs/design/mockups/index.html` (bảng "Tokens màu"); khối `.brand` của sáu mockup có sidebar
- `e2e/navigation.spec.ts` (ca đầu); `apps/desktop/src/shell/AppShell.tsx` (cuộn khi đổi màn)
- `apps/desktop/src/data/tauri-contract.test.ts`; `apps/desktop/src/i18n/vi.ts` (`app.title`); `apps/desktop/index.html`; `apps/desktop/src-tauri/tauri.conf.json`; `apps/desktop/src-tauri/Cargo.toml`
- `apps/desktop/src/assets/brand/` và `docs/design/mockups/img/` (ba ảnh logo)
- `tools/size-report-core.mjs` (`PACKAGES`); `tools/size-report-core.test.mjs`

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx`, `apps/desktop/src/routes/Settings.tsx`, `apps/desktop/src/routes/customers/CustomerPolicies.tsx`
- `apps/desktop/src/routes/stage-badge.tsx`, `apps/desktop/src/routes/SettingsTrash.tsx`
- `apps/desktop/src/shell/Brand.tsx`, `e2e/theme.spec.ts`
- `docs/design/mockups/appointments.html`, `docs/design/mockups/customer.html`, `docs/design/mockups/customers.html`, `docs/design/mockups/settings-data.html`, `docs/design/mockups/team.html`, `docs/design/mockups/trash.html`, `docs/design/mockups/index.html`
- Chỉ khi chọn bỏ bản sao ảnh logo: `docs/design/mockups/img/heritas-tree.png`, `docs/design/mockups/img/heritas-wordmark.png`, `docs/design/mockups/img/heritas-lcrm.png` (xóa), `docs/design/mockups/README.md`
- `e2e/navigation.spec.ts`
- `apps/desktop/src/data/tauri-contract.test.ts`
- `tools/size-report-core.mjs`, `tools/size-report-core.test.mjs`
- `apps/desktop/CLAUDE.md` (khối codemap, nếu lệch)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `e593f69`, nhãn theo PR sổ gắn lại nhãn ngày 28/10):

- **Gộp** mọi mục [T-310] (8 mục):
  - review #855: `HEADING` còn sót, doc comment `stage-badge.tsx`;
  - review #861: `lang="en"` của slogan, bảng token, dòng `scrollY`, tên app ở năm chỗ, ảnh logo trùng byte;
  - review #863: `PACKAGES`.
- **Để lại**, thuộc T-311 (khớp chỉ vì chữ ghi chú nêu file của Issue này):
  - NIT danh sách "Test" của luật đếm: nêu `size-report-core.mjs` làm nguồn, việc ở `phase-6.md`;
  - bảng "Đối chiếu mockup → mã dòng": nêu README mockup, việc ở `nghiem-thu-v1.md`.

##### Interface / hợp đồng

- App không đổi hành vi, chữ, nhãn hay giao diện. `lang="en"` là mã ngôn ngữ, không qua i18n.
- Nếu thêm `label?` cho `stageBadge`: không truyền thì nhãn vẫn là `t('stage.*')` như hiện có.
- Ca tên app đọc file như các ca có sẵn của `tauri-contract.test.ts`.
- `PACKAGES`: năm file vào D / E như §L4.3; gói của file khác không đổi.

##### Test chấp nhận

- [ ] Bốn tiêu đề của review #855 dùng `HEADING`. `rg 'm-0 [^"]*text-sm font-medium text-heading' apps/desktop/src` chỉ còn khớp `classes.ts` (kết quả lệnh ghi trong PR).
- [ ] Ô "Bản ghi" của Thùng rác gọi `stageBadge` (có `label`), hoặc doc comment của `stage-badge.tsx` ghi ngoại lệ Thùng rác; chữ trên màn không đổi.
- [ ] Ca slogan của `e2e/theme.spec.ts` kiểm `lang="en"`; slogan của sáu mockup có `lang="en"`.
- [ ] Bảng "Tokens màu" có `--brand-slogan`, `--brand-outline`, giá trị như phụ lục 27/10 của ADR-0013.
- [ ] `e2e/navigation.spec.ts` không còn phép kiểm `scrollY` ngay sau `goto`; ca vẫn xanh.
- [ ] Ca unit tên app đỏ khi một trong `productName`, `title` cửa sổ, `<title>` lệch `app.title` (đột biến ghi trong PR).
- [ ] Ảnh logo: mockup trỏ ảnh của app và ba bản sao đã xóa (mở sáu mockup thấy logo như cũ), hoặc giữ bản sao và PR ghi lý do.
- [ ] `node tools/size-report.mjs` không còn dòng "Chưa xếp gói"; `size-report-core.test.mjs` có ca cho năm file.
- [ ] `pnpm verify` + e2e xanh.

Ước lượng: ≈ 30 dòng SP, ≈ 15 dòng mockup, ≈ 40 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-310] sang RESOLVED (mục ảnh logo sang ACCEPTED nếu giữ bản sao)

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #871 — fix: clear the code review notes before deep review round 4 (T-310)

Trạng thái: MERGED · merge 2026-10-28T01:34:52Z · commit `a9fd5e642600c1a6207eadac7fc497ef71a60c98` · nhánh `task/T-310-code-notes-before-r4` · nhãn: type:task, risk:low

Closes #865

#### Thay đổi

Tám mục [T-310] của sổ, trước lượt 4 deep review (B2). App không đổi hành vi, chữ hay giao diện.

1. **`HEADING` còn sót (review #855):** bốn tiêu đề nay là `HEADING` cộng class khoảng cách, như Team (`${HEADING} mb-2`):
   - Lịch hẹn ×2 (`appointments-list`, `appointments-day`): `${HEADING} mb-2`;
   - Cài đặt, mục dữ liệu giả lập (`demo-data-title`): `${HEADING} mb-1`;
   - Hợp đồng của hồ sơ KH (`customer-policies`): `${HEADING} shrink-0`.

   `Settings.tsx`, `CustomerPolicies.tsx` thêm `HEADING` vào import `classes`. Mỗi tiêu đề giữ đúng tập class cũ, chỉ đổi thứ tự trong chuỗi; thứ tự này không ảnh hưởng CSS, nên màn không đổi. Ba tiêu đề phụ dùng `mt-*` (khung AI của Lịch hẹn, `SUBHEADING` của KYC Intelligence, lịch sử AI) giữ nguyên, như Issue.
2. **`stageBadge` (review #855, NIT):** chọn thêm `label?`, không ghi ngoại lệ vào doc comment.
   - `stageBadge(stage, label = t(\`stage.${stage}\`))`: không truyền `label` thì nhãn vẫn là `t('stage.*')`, nên các chỗ gọi cũ không đổi.
   - Ô "Bản ghi" của Thùng rác (`RecordCell`) gọi `stageBadge(badge.stage, badge.text)` thay cho `<StageBadge … />` dựng tay; `SettingsTrash.tsx` bỏ import `StageBadge`. Trong app, chỉ còn `stage-badge.tsx` vẽ `StageBadge` (đã grep), nên câu "the one helper of every screen" lại đúng.
   - Lý do chọn `label?`: vẫn giữ hợp đồng của #849 / review #846, tức ô vẽ đúng chữ của `recordBadge`, chữ mà `restoreLabel` đọc cho tên nút. Gọi `stageBadge(badge.stage)` không truyền chữ thì màn hôm nay vẫn y hệt, nhưng một lần đổi chữ ở `recordBadge` sẽ làm ô và tên nút lệch nhau.
   - Chữ trên màn không đổi: `StageBadge` nhận đúng hai prop `stage`, `label` như trước, và `badge.text` là `t('stage.*')` (`trash-view.ts`).
3. **`lang="en"` cho slogan (review #861, WCAG 3.1.2):**
   - App: `<p lang="en">` của `Brand.tsx`. Doc comment ghi thêm việc trình đọc màn hình đọc slogan bằng tiếng Anh.
   - Ca slogan của `e2e/theme.spec.ts` kiểm `lang="en"`: đỏ trước khi sửa (`unexpected value "null"`), xanh sau khi sửa.
   - Sáu mockup có sidebar: `<p class="brand-slogan" lang="en">`.
   - `lang` là mã ngôn ngữ, không phải chuỗi UI, nên không qua i18n.
4. **Bảng "Tokens màu" của `docs/design/mockups/index.html` (review #861, NIT):** thêm hai dòng sau `--accent`, theo thứ tự của `packages/ui/src/tokens.css`:
   - `--brand-slogan` #E8D3A2: 12,12 trên bg-1, 9,60 trên bg-3.
   - `--brand-outline` `rgba(232, 211, 162, 0.95)`: 11,04 trên bg-1, 8,84 trên bg-3. Phụ lục 27/10 của ADR-0013 không ghi giá trị cho token này, nên giá trị lấy theo `tokens.css` / `mockups.css`. Tỉ lệ tính với màu đã phủ 0,95 lên nền, như trình duyệt vẽ.
   - Cùng cách tính của bảng: chạy lại script cho `--border-control` ra 3,97 / 3,15, cho `--accent` ra 8,94 / 7,08, khớp bảng.
5. **`e2e/navigation.spec.ts` (review #861):** bỏ dòng `scrollY` = 0 ngay sau `goto`. Ca vẫn dựa vào ba `toBeInViewport` và phép so hộp.
6. **Tên app một nguồn (review #861):** thêm ca unit ở `apps/desktop/src/data/tauri-contract.test.ts` ("names the app as the sidebar does…"). Ca so với `t('app.title')`:
   - `productName` và `title` cửa sổ (`tauri.conf.json`);
   - `<title>` (`index.html`);
   - `description` của `Cargo.toml` (phải chứa tên; phần "tùy task" của Issue: lấy luôn, vì ghi chú nêu đủ năm chỗ).

   Ca đọc file như các ca có sẵn (`desktop()`, `tauriConf()` thêm kiểu `productName`, `app.windows`). Import `t` từ `../i18n`, không import `vi` từ `vi.ts`, vì `vi` của vitest đã có trong file.
7. **Ảnh logo: giữ ba bản sao ở `docs/design/mockups/img/`** (để PR sổ chuyển mục sang ACCEPTED). Lý do:
   - Mockup đã duyệt G3 là hợp đồng giao diện (`.claude/rules/mockups.md`). Nếu mockup trỏ ảnh của app, một lần đổi logo phía app sẽ đổi luôn mockup đã duyệt mà không qua G3. Review app ↔ mockup cũng mất mốc độc lập để so.
   - Thư mục mockup tự chứa. Không mockup nào trỏ ra ngoài `docs/design/mockups/` (đã grep `../`); font mockup nạp từ Google Fonts; token có bản riêng ở `mockups.css`, không đọc `packages/ui/src/tokens.css`.
   - Cấu hình xem mockup `mockups` của `.claude/launch.json` chạy vite với gốc là `docs/design/mockups`. Đã thử trên server đó: `fetch('/../../../apps/desktop/src/assets/brand/heritas-tree.png')` nhận `index.html` (`text/html`), không phải ảnh. Vậy nếu mockup trỏ ảnh của app thì xem theo cách này logo vỡ. Bản sao `img/heritas-tree.png` trả `image/png`.
   - Hai nơi cùng blob (`git ls-files -s`: `08da0a1`, `b52af42`, `d1e5147`), nên repo chỉ lưu mỗi ảnh một lần.
   - Đổi logo vốn phải qua G3; PR đó sửa cả hai nơi. Dòng 27 của README mockup đã ghi ảnh "cùng bản với app".
8. **`PACKAGES` của `tools/size-report-core.mjs` (review #863):**
   - Xếp năm file theo §L4.3 của kế hoạch lượt 4: `classes.ts`, `stage-badge.tsx`, `money-view.ts`, `money-view.test.ts` vào D; `ConfirmWordDialog.tsx` vào E.
   - Doc comment của `PACKAGES` ghi lý do xếp; gói của file khác không đổi.
   - **Thêm ngoài dòng `PACKAGES`:** bảng Markdown luôn in dòng "Chưa xếp gói", kể cả khi dòng đó là 0 / 0 / 0 / 0. Vậy riêng việc xếp năm file thì test chấp nhận "không còn dòng 'Chưa xếp gói'" không đạt theo chữ.
   - Vì thế `lineSection` nay bỏ dòng đó khi nó không có file, ở lần chạy này và ở lần so (`--compare`). Lần so còn file thì dòng vẫn hiện, với Δ cho thấy các file đã đi. JSON giữ nguyên mọi dòng.
   - Đo trên mã của `main` (trước các sửa ở `routes/` của PR này), chỉ đổi `PACKAGES`:
     - D: 7 994 SP (+54), 2 820 test (+18), 87 file (+4);
     - E: 8 160 SP (+67), 52 file (+1);
     - khớp số xếp tay của §L4.3.

     Bước chuẩn bị lượt 4 bỏ dòng "Chưa xếp gói" và phần xếp tay, như §L4.3 đã ghi.

**Mockup không qua G3:** PR chỉ thêm thuộc tính `lang` (không đổi hình) và hai dòng token đã duyệt ở phụ lục 27/10 của ADR-0013 (T-308, G3 27/10). Không đổi nội dung hay bố cục. Review thấy khác thì Owner duyệt G3 trên PR này.

Không đụng file nào cần nhãn `build-exe`: không có `src-tauri/**`, Cargo, `package.json`, lockfile, `vite.config.*`, `tauri.conf.json`. Ca mục 6 chỉ đọc các file đó.

Cỡ (`git show --numstat`): SP +33 / −22 (`apps/desktop/src`, `tools/size-report-core.mjs`), test +39 / −2, mockup +8 / −6; 18 file.

Đã mở sáu mockup (cấu hình `mockups`): slogan có `lang="en"`, ba mảnh logo nạp từ `img/` (rộng 88 / 150 / 132 px). Bảng token hiện hai dòng mới với ô màu `rgb(232, 211, 162)` và `rgba(232, 211, 162, 0.95)`.

#### Ngoài phạm vi: một ca e2e chập chờn có sẵn

Lần chạy đủ bộ e2e đầu tiên ở local có 1 ca đỏ, 307 ca xanh. Ca đỏ: `e2e/customer-ai.spec.ts:274`, "a run that fails while the profile is left says its error once shown again (T-297)", đỏ ở `:313` (alert còn 1). PR này không đụng file đó hay panel AI.

- **Tái hiện:** `pnpm exec playwright test e2e/customer-ai.spec.ts -g "fails while the profile is left" --repeat-each=8`. Nhánh này đỏ 2/8; `origin/main` `8330d8c` (worktree tạm, đã xóa) cũng đỏ 2/8. CI gần đây không có cảnh báo "E2E flaky".
- **Nguyên nhân:** `:310–311` bấm "Cài đặt" rồi `goBack()` ngay, không chờ màn Cài đặt hiện. Khi hai lần đổi hash rơi vào cùng một lượt render, hồ sơ không bị gỡ ra, nên lỗi không được đánh dấu "đã nói". Ảnh chụp lúc đỏ khớp với điều này: focus còn ở link "Cài đặt", h1 vẫn là "Hồ sơ khách hàng".
- **Sửa thử** (chỉ trong worktree tạm): thêm `await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cài đặt');` sau `:310` → 16/16 xanh.
- File không thuộc danh sách được sửa của #865, nên PR này không sửa. Đề xuất PR sổ ghi một mục OPEN mới để sửa trước khi ghim SHA lượt 4 (B2).

#### Test chấp nhận

- [x] Bốn tiêu đề của review #855 dùng `HEADING`. `rg 'm-0 [^"]*text-sm font-medium text-heading' apps/desktop/src` chỉ còn khớp `classes.ts`:
  ```
  apps/desktop/src\routes\classes.ts:export const HEADING = 'm-0 text-sm font-medium text-heading';
  ```
- [x] Ô "Bản ghi" của Thùng rác gọi `stageBadge(badge.stage, badge.text)` (có `label`). Chữ trên màn không đổi:
  - `StageBadge` nhận đúng hai prop như trước;
  - đã xem trên bản web (dev server): xóa KH "Lê Đức Phúc" (N4), ô hiện tên kèm huy hiệu N4, nút tên "Khôi phục KH Lê Đức Phúc · N4".

  `e2e/trash.spec.ts` chỉ kiểm tên nút (`restoreLabel`), không kiểm huy hiệu trong ô.
- [x] Ca slogan của `e2e/theme.spec.ts` kiểm `lang="en"` (đỏ → xanh như mục 3). Slogan của sáu mockup có `lang="en"`.
- [x] Bảng "Tokens màu" có `--brand-slogan` #E8D3A2 và `--brand-outline`, giá trị như phụ lục 27/10 của ADR-0013 và `tokens.css`.
- [x] `e2e/navigation.spec.ts` không còn phép kiểm `scrollY` ngay sau `goto`; ca vẫn xanh.
- [x] Ca unit tên app đỏ khi một chỗ lệch `app.title`. Đột biến: mỗi lần đổi riêng một chỗ "Heritas L-CRM" → "Heritas X-CRM", chạy `pnpm vitest run apps/desktop/src/data/tauri-contract.test.ts -t "names the app"`, rồi trả file về từng byte.

  | Chỗ đổi | Kết quả |
  |---|---|
  | `productName` (`tauri.conf.json`) | đỏ |
  | `title` cửa sổ (`tauri.conf.json`) | đỏ |
  | `<title>` (`index.html`) | đỏ |
  | `description` (`Cargo.toml`) | đỏ |
  | `app.title` (`vi.ts`) | đỏ |

  Không đổi gì: 1 passed, exit 0. `git status` sau đột biến chỉ còn file của PR.
- [x] Ảnh logo: giữ bản sao, lý do ở mục 7.
- [x] `node tools/size-report.mjs` không còn dòng "Chưa xếp gói" (cả dòng bảng lẫn dòng liệt kê file). `size-report-core.test.mjs`:
  - năm ca `classifyFile` cho năm file (đỏ trước khi sửa);
  - ca "leaves out the unassigned row…": không in dòng khi rỗng; vẫn in khi lần so còn file (đỏ trước khi sửa).
- [x] `pnpm verify` + `pnpm e2e` xanh ở local (mục Kiểm tra).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `8330d8c`), 8 mục "Trùng file":

- L19 (`HEADING` còn sót, [T-310]): đã sửa, mục 1.
- L20 (doc comment `stage-badge.tsx`, [T-310]): đã sửa, mục 2.
- L22 (NIT danh sách "Test" của luật đếm ở `docs/metrics/phase-6.md`, [T-311 #866]): để lại. Mục thuộc T-311 #866; việc ở `phase-6.md`. Lệnh khớp chỉ vì chữ ghi chú nêu `size-report-core.mjs` làm nguồn, và PR này không đổi mảng `TEST`.
- L26 (`lang="en"` cho slogan, [T-310]): đã sửa, mục 3.
- L28 (bảng "Tokens màu", [T-310]): đã sửa, mục 4.
- L29 (dòng `scrollY`, [T-310]): đã sửa, mục 5.
- L30 (tên app ở năm chỗ, [T-310]): đã sửa, mục 6.
- L39 (`PACKAGES`, [T-310]): đã sửa, mục 8.

Mục [T-310] còn lại, không có trong "Trùng file" vì PR không đụng ảnh: L31 (ảnh logo trùng byte). Giữ bản sao, lý do ở mục 7; PR sổ chuyển mục sang ACCEPTED.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (125 file test, 3 975 ca)
- [x] `pnpm e2e` xanh ở local ở head `92c88ac`: 308 / 308. Lần chạy trước đó, cùng mã app: 307 xanh, 1 đỏ là ca chập chờn có sẵn ở mục "Ngoài phạm vi".
- [x] Bản web (dev server):
  - `appointments-list`, `appointments-day`: margin-bottom 8 px; `demo-data-title`: 4 px; `customer-policies`: `flex-shrink: 0`;
  - màu và cỡ chữ của bốn tiêu đề như `HEADING`;
  - slogan có `lang="en"`.
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-310 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #855, #861, #863 — T-310 (#865, PR #871, `REVIEW: PASS` @`92c88ac`):
  - #855 *Duplicated Code*, `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx`, `apps/desktop/src/routes/Settings.tsx`, `apps/desktop/src/routes/customers/CustomerPolicies.tsx`: bốn tiêu đề là `HEADING` cộng class khoảng cách (`${HEADING} mb-2` ×2, `${HEADING} mb-1`, `${HEADING} shrink-0`), như `apps/desktop/src/routes/team/TeamScreen.tsx`. `rg 'm-0 [^"]*text-sm font-medium text-heading' apps/desktop/src` chỉ còn khớp `classes.ts`.
  - #855 NIT, `apps/desktop/src/routes/stage-badge.tsx`: `stageBadge(stage, label?)`, không truyền `label` thì nhãn vẫn là `t('stage.*')`. `RecordCell` (`apps/desktop/src/routes/SettingsTrash.tsx`) gọi `stageBadge(badge.stage, badge.text)`, nên ô vẫn vẽ đúng chữ của `recordBadge` mà tên nút khôi phục đọc. Trong app chỉ còn `stage-badge.tsx` vẽ `StageBadge`, nên doc comment "the one helper of every screen" đúng lại.
  - #861, `apps/desktop/src/shell/Brand.tsx`: slogan là `<p lang="en">` (WCAG 3.1.2); ca slogan của `e2e/theme.spec.ts` kiểm `lang="en"`. Sáu mockup có sidebar (`docs/design/mockups/appointments.html`, `customer.html`, `customers.html`, `settings-data.html`, `team.html`, `trash.html`) có `<p class="brand-slogan" lang="en">`.
  - #861 NIT, `docs/design/mockups/index.html` (bảng "Tokens màu"): hai dòng sau `--accent`, `--brand-slogan` #E8D3A2 (12,12 trên bg-1, 9,60 trên bg-3) và `--brand-outline` `rgba(232, 211, 162, 0.95)` (11,04 / 8,84, tính với màu đã phủ lên nền); giá trị theo `packages/ui/src/tokens.css`.
  - #861, `e2e/navigation.spec.ts`: bỏ dòng `scrollY` = 0 ngay sau `goto`; ca dựa vào ba `toBeInViewport` và phép so hộp.
  - #861 *Shotgun Surgery*, `apps/desktop/src/data/tauri-contract.test.ts`: ca "names the app as the sidebar does…" buộc `productName`, `title` cửa sổ (`apps/desktop/src-tauri/tauri.conf.json`) và `<title>` (`apps/desktop/index.html`) bằng `t('app.title')`, `description` của `apps/desktop/src-tauri/Cargo.toml` chứa tên. Thân PR #871: đổi riêng từng chỗ trong năm chỗ thì ca đỏ.
  - #863, `tools/size-report-core.mjs` (`PACKAGES`): `classes.ts`, `stage-badge.tsx`, `money-view.ts` và test vào D, `ConfirmWordDialog.tsx` vào E (§L4.3). Bảng bỏ dòng "Chưa xếp gói" khi dòng đó không có file, ở lần chạy này lẫn lần so (`--compare`); `node tools/size-report.mjs` ở head không còn dòng đó. Ca ở `tools/size-report-core.test.mjs`.

---

# Issue #866 — T-311: Mục sổ phần tài liệu trước lượt 4: luật đếm phase-6.md, đối chiếu .brand, K21 / K31, dòng R1 CL3-A29, chữ 3 lượt

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sửa các mục sổ OPEN thuộc về tài liệu trước lượt 4 deep review (B2). Chỉ đổi chữ, không đổi luật, số hay quyết định.

1. **Luật đếm của `phase-6.md` (review #859):**
   - NIT: danh sách "Test" của dòng "Phân loại" thiếu `playwright*.config.ts` và `vitest.config.ts` ở gốc repo, mà `size-report-core` tính là test. Thêm hai tên này; số của bảng không đổi (dòng #572 dựa vào đó).
   - Lệnh đếm trỏ về thân PR #859 đọc phía cũ ở `git merge-base origin/main <head>`. Với PR xếp chồng merge bằng `--merge` (#709, #845), lệnh đó trả chính head. Ghi: khi ghi thêm PR của vòng review toàn bộ code, phía cũ lấy theo `base.sha` của PR.
2. **Bảng "Đối chiếu mockup → mã dòng" của `nghiem-thu-v1.md` (review #861):** khối `.brand`, mà #861 thêm vào README mockup, chưa có dòng. Thêm NT-CH-09 vào sáu dòng mockup có sidebar.
3. **Chữ KNOWN lượt 4 ở §L4.5 phần 2 (review #863, NIT):**
   - K21: vế "đợt G5 lượt 3: K31" nằm trong ngoặc: "(Q6 lượt 1; đợt G5 lượt 2: K28; đợt G5 lượt 3: K31)".
   - K31: sau "tách dòng ở CR, LF, U+0085, U+2028, U+2029" thêm "(VT, FF từ §13.4, K33)".
4. **Bảng R1 ở §L4.5 phần 4, dòng CL3-A29 (review #863):** cột "Issue → PR" thêm phần đã sửa trước: "#722 → #742 (một phần: bỏ CTE khi không có lịch đã xóa), #776 → #805 (chỉ mục `0012`)", theo cách ghi của dòng DR6-37 / DR6-66. Bước "gỡ tạm phần sửa" của R1 nhờ đó gỡ đủ hai phần.
5. **Chữ "3 lượt" ở `PROJECT-PLAN.md` và README của `docs/` (review #863, bốn chỗ):** thêm lượt 4 (ADR-0001 M10, T-309).
   - **Luật chữ:** ghi ở mức bên review, đúng dù T-313 merge trước hay sau. Ví dụ: "4 lượt (lượt 1 ba agent; lượt 2 và 3 Claude + Codex; lượt 4 Claude + Codex + DeepSeek — ADR-0001 M7, M9, M10)", "cấu hình chặn của DeepSeek". Không ghi OpenCode hay DSH: cách chạy DeepSeek là việc của T-313.
   - Dòng kế hoạch ở README của `docs/` thêm T-309 vào danh sách task.

##### Bối cảnh

- Kế hoạch lượt 4 §L4.2 và §L4.11 mục 8 (T-309 #854, PR #863; Owner duyệt G1 28/10): T-310 code, T-311 tài liệu, T-312 ảnh hướng dẫn. Các mục trên là mục [T-311] của sổ (PR sổ gắn lại nhãn ngày 28/10).
- T-313 (Issue riêng, Owner 28/10) ghi quyết định DeepSeek qua DSH và cũng sửa file kế hoạch, nhưng ở §L4.1, §L4.2, §L4.7–§L4.11, Phụ lục O, P. Issue này chỉ sửa §L4.5, nên hai Issue không chặn nhau.
  - Chỉ chỗ sửa theo mục, không theo số dòng: T-313 merge trước thì số dòng của §L4.5 dịch.
  - PR merge sau chạy `node tools/merge-pr.mjs <N> --dry-run` trước. Có xung đột thì `gh pr update-branch`; head đổi sau PASS thì review lại.
- Lượt 3 sửa chữ "3 lượt" ở PR tổng hợp #717; lượt 4 sửa trước khi ghim SHA (B2).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-311]
- `docs/metrics/phase-6.md` mục "Kích thước PR vượt ngưỡng" (luật đếm, dòng #572); `tools/size-report-core.mjs` (mảng `TEST`); thân PR #859 (`count.mjs`)
- `docs/testing/nghiem-thu-v1.md`: bảng "Đối chiếu mockup → mã dòng", NT-CH-09, NT-EX-13; `docs/design/mockups/README.md` (khối `.brand`)
- `docs/process/deep-review-phase-1-6.md` §L4.5 phần 2 (K21, K31, K33) và phần 4 (bảng R1); `docs/reviews/raw/2026-10-21/common-known.md` (chữ K21 lượt 3); `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §8.4; `docs/design/phase-5-prompts.md` §12.3, §13.4
- `docs/PROJECT-PLAN.md` (bảng phase, dòng Phase 6; mục thứ tự việc, dòng Phase 6); `docs/README.md` (dòng spec Phase 6, dòng kế hoạch deep review); `docs/decisions/0001-mo-hinh-thuc-hien-chi-claude-code.md` phụ lục M10

##### File / thư mục được phép sửa

- `docs/metrics/phase-6.md`
- `docs/testing/nghiem-thu-v1.md`
- `docs/process/deep-review-phase-1-6.md` (chỉ §L4.5 phần 2 và phần 4)
- `docs/PROJECT-PLAN.md`
- `docs/README.md`

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `e593f69`, nhãn theo PR sổ gắn lại nhãn ngày 28/10):

- **Gộp** mọi mục [T-311] (6 mục):
  - review #859: hai mục `phase-6.md`;
  - review #861: bảng đối chiếu `.brand`;
  - review #863: NIT K21 / K31, dòng R1 CL3-A29, chữ "3 lượt".
- **Để lại**, thuộc T-313: log phiên Claude / Codex ở đợt 2 và phiên thử (cùng file kế hoạch, §L4.9, §L4.10, Phụ lục P).

##### Interface / hợp đồng

Không đổi luật, số hay quyết định; chỉ chữ.

##### Test chấp nhận

- [ ] Dòng "Phân loại" của luật đếm có `playwright*.config.ts` và `vitest.config.ts`, khớp mảng `TEST`; số của bảng không đổi.
- [ ] `phase-6.md` ghi: khi ghi thêm PR, phía cũ lấy theo `base.sha` của PR (`gh api repos/AlexH-AI/Project-2C/pulls/<n> --jq .base.sha`), đúng cả với PR xếp chồng merge bằng `--merge`.
- [ ] Sáu dòng mockup có sidebar của bảng đối chiếu có NT-CH-09 (khối `.brand`).
- [ ] K21 và K31 ở §L4.5 phần 2 ghi như mục 3.
- [ ] Dòng CL3-A29 của bảng R1 có "#722 → #742 (một phần…)" trước "#776 → #805".
- [ ] Bốn chỗ "3 lượt" nay có lượt 4 (M10) theo luật chữ ở mục 5; `rg "3 lượt|ba lượt" docs/PROJECT-PLAN.md docs/README.md` không còn khớp.
- [ ] PR chỉ đổi tài liệu (không chạy CI).

Ước lượng: ≈ 25 dòng tài liệu.

##### Định nghĩa hoàn thành

- [ ] Review phiên sạch: PASS (PR docs: không gọi `code-review`)
- [ ] PR sổ sau review chuyển các mục [T-311] sang RESOLVED

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #870 — docs: fix the doc notes before deep review round 4 (T-311)

Trạng thái: MERGED · merge 2026-10-28T01:42:24Z · commit `7e720aa89c1830e0259e820f3becb8916ee179d1` · nhánh `task/T-311-doc-notes-before-r4` · nhãn: risk:low

Closes #866

#### Thay đổi

Đợt sửa mục OPEN trước lượt 4 (B2, kế hoạch §L4.2), phần tài liệu: sáu mục [T-311] của sổ. Chỉ đổi chữ, không đổi luật, số hay quyết định.

1. **`docs/metrics/phase-6.md`, luật đếm (review #859):**
   - Dòng "Phân loại": danh sách "Test" thêm `playwright*.config.ts` và `vitest.config.ts` ở gốc repo, khớp mảng `TEST` của `tools/size-report-core.mjs`. Regex neo ở gốc, nên `vitest.config.ts` của package vẫn là SP. Số của bảng không đổi.
   - Đoạn đầu mục: khi ghi thêm PR, phía cũ lấy theo `base.sha` của PR (`gh api repos/AlexH-AI/Project-2C/pulls/<n> --jq .base.sha`) và đọc ở `git merge-base <base.sha> <head>`. `count.mjs` của #859 đọc ở `git merge-base origin/main <head>`; với PR xếp chồng merge bằng `--merge` (#709, #845), lệnh đó trả về chính head.
   - Đã đếm lại #709, #845 với cùng cách tách vùng của `count.mjs`, phía cũ đọc theo cả hai cách: kết quả như nhau. Hai PR không có file Rust, và mọi dòng đổi của `CLAUDE.md` đều nằm trong khối codemap. Tài liệu chỉ ghi "ra cùng số ở bảng", không ghi số dòng.
2. **`docs/testing/nghiem-thu-v1.md`, bảng "Đối chiếu mockup → mã dòng" (review #861):** sáu dòng mockup có sidebar thêm "`.brand` → CH-09": `appointments`, `customers`, `customer`, `team`, `settings-data`, `trash`, theo `docs/design/mockups/README.md:27`. NT-EX-13 (icon exe) không có khối mockup nên không vào bảng.
3. **`docs/process/deep-review-phase-1-6.md` §L4.5 phần 2 (review #863, NIT):**
   - K21: ghi đủ ngoặc sau vế "V1 / `LAW_NAME` sửa đúng chữ G5, không G5 mới": "(Q6 lượt 1; đợt G5 lượt 2: K28; đợt G5 lượt 3: K31)".
   - K31: sau "tách dòng ở CR, LF, U+0085, U+2028, U+2029" thêm "(VT, FF từ §13.4, K33)".
4. **§L4.5 phần 4, bảng R1, dòng CL3-A29 (review #863):** cột "Issue → PR" nay là "#722 → #742 (một phần: bỏ CTE khi không có lịch đã xóa), #776 → #805 (chỉ mục `0012`)". Commit `213a13e` của #742 cho `keptRecords` trả ngay khi không có lịch hẹn nào đã xóa.
5. **"3 lượt" ở `docs/PROJECT-PLAN.md` (`:299`, `:384`) và `docs/README.md` (`:21`, `:32`) (review #863):**
   - Nay là 4 lượt: lượt 4 Claude + Codex + DeepSeek (ADR-0001 M7, M9, M10).
   - Dòng kế hoạch của README thêm "cấu hình chặn của DeepSeek" và T-309. "Cấu hình Muse" giữ lại vì §7 vẫn còn.
   - Theo luật chữ của mục 5, không ghi OpenCode hay DSH, nên chữ đúng dù T-313 merge trước hay sau.

Ở file kế hoạch, PR chỉ sửa ba dòng trong §L4.5 (K21, K31, CL3-A29). Vùng của T-313 không chạm: §L4.1, §L4.2, §L4.7–§L4.11, Phụ lục O, P.

Chỗ không sửa vì ngoài phạm vi file của Issue: §L4.4 phần 1 (`:1753`) vẫn ghi "CL3-A29 (#805)", trong câu tóm tắt hai mục KNOWN có Issue sửa. Chỗ ghi đủ hai phần là cột "Issue → PR" của bảng R1.

#### Test chấp nhận

- [x] Dòng "Phân loại" của luật đếm có `playwright*.config.ts` và `vitest.config.ts`, khớp mảng `TEST`; số của bảng không đổi.
- [x] `phase-6.md` ghi: khi ghi thêm PR, phía cũ lấy theo `base.sha` của PR (`gh api repos/AlexH-AI/Project-2C/pulls/<n> --jq .base.sha`), đúng cả với PR xếp chồng merge bằng `--merge`.
- [x] Sáu dòng mockup có sidebar của bảng đối chiếu có NT-CH-09 (khối `.brand`).
- [x] K21 và K31 ở §L4.5 phần 2 ghi như mục 3.
- [x] Dòng CL3-A29 của bảng R1 có "#722 → #742 (một phần…)" trước "#776 → #805".
- [x] Bốn chỗ "3 lượt" nay có lượt 4 (M10) theo luật chữ ở mục 5; `rg "3 lượt|ba lượt" docs/PROJECT-PLAN.md docs/README.md` không còn khớp.
- [x] PR chỉ đổi tài liệu (không chạy CI): 5 file trong `docs/`, không file nào trong `CODE_DOCS`.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `d7d2ef6`) có 8 mục "Trùng file":

- L22 `phase-6.md:239`, danh sách "Test" thiếu `playwright*.config.ts` và `vitest.config.ts`: **đã sửa** (mục 1).
- L23 `phase-6.md:234`, lệnh đếm đọc phía cũ ở `merge-base origin/main`: **đã sửa** (mục 1).
- L27 bảng đối chiếu chưa có `.brand`: **đã sửa** (mục 2).
- L33 [T-313 #868] chữ báo cáo đợt 1 trong log phiên Claude / Codex mà ACL đợt 2 không chặn (§L4.9 đợt 2 bước 1, §L4.10, Phụ lục P): **để lại**, thuộc T-313. Mục nằm ngoài §L4.5, mà Issue chỉ cho sửa §L4.5 phần 2 và 4.
- L34 [T-313 #868] phiên thử không thử luật mà chỉ cấu hình chặn của DeepSeek giữ (§L4.9 đợt 2 bước 3): **để lại**, thuộc T-313 (cùng lý do với L33).
- L36 dòng R1 CL3-A29: **đã sửa** (mục 4).
- L37 K21 / K31: **đã sửa** (mục 3).
- L38 chữ "3 lượt" ở bốn chỗ: **đã sửa** (mục 5).

#### Kiểm tra

- [ ] `pnpm verify` xanh ở local: **không chạy**. PR chỉ đổi `docs/`: `.prettierignore` bỏ `docs/`, và không test nào đọc năm file này. Worktree của task không `pnpm install`, và CI không chạy cho PR docs.
- [x] Không thêm dependency ngoài ADR-0005 (không đổi dependency)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

T-313 (#868) cũng sửa `docs/process/deep-review-phase-1-6.md` (ngoài §L4.5). PR nào merge sau thì chạy `node tools/merge-pr.mjs <N> --dry-run` trước.

Rủi ro: `risk:low` (chỉ docs; không chạm golden hay `CODE_DOCS`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-311 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #859, #861, #863 — T-311 (#866, PR #870, `REVIEW: PASS` @`d7d2ef6`):
  - #859 NIT, `docs/metrics/phase-6.md` (luật đếm, dòng "Phân loại"): danh sách "Test" có `playwright*.config.ts` và `vitest.config.ts` ở gốc repo, khớp mảng `TEST` của `tools/size-report-core.mjs`; số của bảng không đổi.
  - #859, `docs/metrics/phase-6.md` (đầu mục "Kích thước PR vượt ngưỡng"): khi ghi thêm PR, phía cũ lấy theo `base.sha` của PR (`gh api repos/AlexH-AI/Project-2C/pulls/<n> --jq .base.sha`) và đọc ở `git merge-base <base.sha> <head>`, đúng cả với PR xếp chồng merge bằng `--merge`. Review #870 đếm lại #709, #845 theo hai cách (`merge-base origin/main` ra chính head, `merge-base <base.sha>` ra `1b88abd`, `0052470`): cùng số, khớp bảng.
  - #861, `docs/testing/nghiem-thu-v1.md` (bảng "Đối chiếu mockup → mã dòng"): sáu dòng mockup có sidebar (`appointments`, `customers`, `customer`, `team`, `settings-data`, `trash`) có "`.brand` → CH-09", theo `docs/design/mockups/README.md:27`.
  - #863, `docs/process/deep-review-phase-1-6.md` (§L4.5 phần 4, bảng R1): cột "Issue → PR" của dòng CL3-A29 là "#722 → #742 (một phần: bỏ CTE khi không có lịch đã xóa), #776 → #805 (chỉ mục `0012`)". Câu tóm tắt ở §L4.4 phần 1 còn ghi "(#805)": ghi chú mới của review #870, PR #872 sửa (nhóm T-313 ở trên).
  - #863 NIT, `docs/process/deep-review-phase-1-6.md` (§L4.5 phần 2): ngoặc của K21 sau vế "V1 / `LAW_NAME` sửa đúng chữ G5, không G5 mới" là "(Q6 lượt 1; đợt G5 lượt 2: K28; đợt G5 lượt 3: K31)"; K31 thêm "(VT, FF từ §13.4, K33)" sau "tách dòng ở CR, LF, U+0085, U+2028, U+2029".
  - #863, `docs/PROJECT-PLAN.md`, `docs/README.md`: bốn chỗ "3 lượt" nay là 4 lượt (lượt 4 Claude + Codex + DeepSeek; ADR-0001 M7, M9, M10), không ghi OpenCode hay DSH. Dòng kế hoạch của `docs/README.md` thêm "cấu hình chặn của DeepSeek" và T-309. `rg "3 lượt|ba lượt" docs/PROJECT-PLAN.md docs/README.md` không còn khớp.

---

# Issue #867 — T-312: Chụp lại toàn bộ ảnh hướng dẫn với logo mới, trước lượt 4

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Ảnh hướng dẫn sử dụng khớp app hiện tại trước lượt 4: logo Heritas L-CRM ở góc sidebar, câu chữ mới của các hộp. Chụp lại toàn bộ ảnh bằng bộ chụp, gộp bốn mục ảnh của sổ:

1. **Dòng đầu ảnh khi Playwright phải cuộn (review #760):** test chấp nhận 6 của #735 chỉ đạt theo chữ. Bỏ `style` của `shot` thì ảnh vẫn trùng byte, nên không gì canh việc header che dòng đầu ảnh. Khi chụp lại, xem dòng đầu các ảnh mà Playwright phải cuộn tới.
2. **`09-nap-lai.png` (review #825):** chưa có câu số liệu mới của hộp 10c.
3. **`03-ket-qua.png` (review #838):** chưa có câu help dưới ô Case size (hộp 6c), trong khi trang Lịch hẹn của hướng dẫn nói câu đó nằm dưới ô.
4. **Ảnh nặng thêm do logo (review #861):** logo nhiều chuyển màu làm mỗi ảnh có sidebar nặng thêm ≈ 26 KB. `05-ho-so-kh.png` nhiều khả năng vượt 150 KiB khi chụp lại → cắt từ `main.x` như ảnh 04-khach-hang, hoặc giảm chiều cao.

##### Bối cảnh

- Kế hoạch lượt 4 §L4.2 (T-309 #854, PR #863; Owner duyệt G1 28/10): T-312 làm sau T-310. Ảnh chụp ở đây là ảnh trước lượt 4. Đợt sửa lượt 4 đổi màn nào thì G7 chụp lại ảnh đó (NT-HD-01 so hướng dẫn với exe phát hành).
- Các mục trên là mục [T-312] của sổ (PR sổ gắn lại nhãn ngày 28/10).
- Bộ chụp chạy tay, không chạy trong CI.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục OPEN gắn [T-312]
- `e2e/guide/shots.guide.ts` (hàm `shot` và `style`; ảnh 03, 04, 05, 09); `e2e/guide/check.guide.ts` (giới hạn cỡ); `playwright.guide.config.ts` (viewport, lệnh chạy)
- `docs/design/phase-6-hoan-thien.md` §4.3 (mục lục hướng dẫn, giới hạn ảnh)
- `docs/user-guide/*.md`: đoạn gắn với ảnh đổi, nhất là `docs/user-guide/03-lich-hen.md` (câu help Case size) và `docs/user-guide/09-cai-dat.md` (hộp 10c)
- `docs/process/deep-review-phase-1-6.md` §L4.2 (bảng "Đợt sửa mục OPEN trước lượt 4")

##### File / thư mục được phép sửa

- `docs/user-guide/img/**`
- `e2e/guide/shots.guide.ts`
- `docs/user-guide/*.md` (chỉ khi câu chữ lệch ảnh)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `e593f69`, nhãn theo PR sổ gắn lại nhãn ngày 28/10):

- **Gộp** mọi mục [T-312] (4 mục): `style` của `shot` (review #760), `09-nap-lai.png` (review #825), `03-ket-qua.png` (review #838), ảnh nặng thêm do logo (review #861).
- **Để lại:** không có.

##### Interface / hợp đồng

Không đổi code sản phẩm; chỉ script chụp ảnh và ảnh.

##### Test chấp nhận

- [ ] `pnpm exec playwright test -c playwright.guide.config.ts` xanh; mỗi ảnh ≤ 150 KiB, tổng ≤ 4 MiB (`check.guide.ts`).
- [ ] Mọi ảnh có sidebar có logo Heritas L-CRM.
- [ ] PR liệt kê các ảnh mà Playwright phải cuộn tới; dòng đầu các ảnh đó không bị header che.
- [ ] `09-nap-lai.png` có câu số liệu mới của hộp 10c; `03-ket-qua.png` có câu help dưới ô Case size.
- [ ] Câu chữ các trang hướng dẫn khớp ảnh mới. PR ghi ảnh nào chỉ khác logo.
- [ ] `pnpm verify` + e2e xanh.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục [T-312] sang RESOLVED

##### Rủi ro

risk:low

##### Bị chặn bởi

#865 (T-310)

## PR #882 — fix: reshoot the user guide with the new logo, keep the foot of tall guide shots (T-312)

Trạng thái: MERGED · merge 2026-10-28T13:29:59Z · commit `8e22542561b7e4b18ca38b2003875bb9f43d67f9` · nhánh `task/T-312-guide-reshoot` · nhãn: risk:low

Closes #867

#### Thay đổi

Chụp lại toàn bộ ảnh hướng dẫn trên `main` `76601fd` (sau T-310), gộp bốn mục [T-312] của sổ. App không đổi. Chụp trên Home PC (`DESKTOP-KDURKJP`) bằng `playwright.guide.config.ts`.

1. **Ảnh Playwright phải cuộn tới (review #760).** Một đoạn đo tạm trong `shot` (không commit) ghi vị trí phần cần chụp sau `scrollTo(0, 0)` và `scrollTop` sau khi chụp. Ba phần nằm ngoài khung 1 440 × 900:

   | Ảnh | Đỉnh / cao của phần (px) | Playwright cuộn (px) |
   |---|---|---|
   | `02-tong-quan-so-sanh-team` | 772,5 / 229 | 102 |
   | `05-du-kien-kyc` | 189 / 827 | 117 (trước khi sửa: 109) |
   | `06-ai-phan-tich` | 189 / 1 001 | 189 (trước khi sửa: 109) |

   Mọi phần khác (hộp thoại, lịch tháng / năm, Chi tiết lịch hẹn, Theo mốc) nằm trọn trong khung, Playwright không cuộn. Khung AI nay cao 1 001 px, hơn cửa sổ, nên Playwright phải cuộn tới; theo ghi chú review #760, lúc đó Playwright không cuộn tới khung này.

   - **Đột biến với `style` cũ:** bỏ hẳn `style` thì cả 28 ảnh vẫn trùng từng byte. Lý do: `scroll-margin-top` 80 px của `apps/desktop/src/index.css` (T-280) làm phần dừng ở 80 px, dưới header (59 / 64 px).
   - **Nhưng chính lề đó làm hỏng chân ảnh `05-du-kien-kyc`:**
     - thẻ cao 827 px dừng ở 80 px, nên chân thẻ ra ngoài cửa sổ 7 px;
     - thẻ không cao hơn cửa sổ, nên Playwright chỉ chụp trong cửa sổ (`captureBeyondViewport: !fitsViewport`, playwright-core 1.63.0);
     - 8 dòng cuối của ảnh vì thế là nền trang, thay cho viền và góc bo dưới của thẻ.
   - **Sửa:** `style` thêm `main * { scroll-margin-top: 0 !important; }`.
     - Playwright gắn `style` trước khi cuộn (`_preparePageForScreenshot` chạy trước `_waitAndScrollIntoViewIfNeeded`), nên phần lại dừng sát mép cửa sổ như trước T-280.
     - Lúc chụp, header đã là `static`, nên lề không còn việc gì để làm.
     - `05-du-kien-kyc.png` nay trùng byte với ảnh trên `main` (chụp ở #626, trước T-280), nên không có trong diff.
   - **Đột biến sau khi sửa:**
     - bỏ phần `header` → 59 dòng đầu của `06-ai-phan-tich` đổi: header che dòng "KYC Intelligence · CURRENT · Mock";
     - bỏ phần `scroll-margin-top` → `05-du-kien-kyc` mất viền chân (8 dòng).

     Vậy nay mỗi nửa của `style` có một ảnh canh: chụp lại mà thiếu nửa nào thì diff ảnh lộ ra. Không thêm test canh riêng, vì Issue chỉ yêu cầu liệt kê và xem các ảnh này.
   - **Dòng đầu ba ảnh:** đã xem, đủ cả: "So sánh team 01/09 - 15/09/2026 (MTD)", "Dữ kiện KYC 8/8 hạng mục · v15", "KYC Intelligence CURRENT Mock".
2. **`09-nap-lai.png` (review #825):** có câu số liệu của hộp 10c: "Toàn bộ dữ liệu hiện tại (1.200 KH, 6.229 lịch hẹn, 988 HĐ) được thay bằng dữ liệu giả lập mới, neo ở ngày 15/09/2026." Khớp `09-cai-dat.md:68`.
3. **`03-ket-qua.png` (review #838):** có câu help dưới ô Case size. Hộp cao 768 px (ảnh cũ 714 px), vừa cửa sổ; trong hộp không phần tử nào có thanh cuộn, nên ảnh có đủ câu.
   - Câu help còn một ngoại lệ mà `03-lich-hen.md:78` chưa nêu: số đứng trước là 0 thì dấu là dấu thập phân ("0,500 tr" = 500.000 ₫). Hướng dẫn lại nói câu đó "cũng ở dưới ô", và theo luật hướng dẫn ghi thì `0,500 tr` thành 500.000.000 ₫.
   - Sửa: thêm ngoại lệ vào hướng dẫn, chữ theo `vi.ts`. Mockup `appointment-forms.html` và nghiệm thu NT-LH-25 cũng có ngoại lệ này.
4. **Cỡ ảnh (review #861):** chụp như cũ (1 440 × 600 từ góc trái, có logo) thì `05-ho-so-kh.png` nặng 166 200 B, vượt 153 600 B.
   - Nay cắt từ `main.x` như ảnh 04-khach-hang: 1 208 × 600, 127 730 B. Hàm `rightOfSidebar` dùng chung cho 04 và 05; comment về cỡ ảnh ghi lại cho đúng.
   - Năm ảnh lớn nhất: `04-khach-hang` 141 536 B, `02-tong-quan` 141 333 B, `07-bao-cao` 135 139 B, `05-ho-so-kh` 127 730 B, `04-khach-hang-bang` 124 930 B (1 440 × 600, có sidebar). Tổng 28 ảnh: 1 942 246 B.
   - Chạy lệnh chụp chuẩn hai lần liền (mỗi lần tự build, không `PW_REUSE`): 28 ảnh trùng từng byte giữa hai lần.

##### Ảnh: đổi gì so với `main`

So từng điểm ảnh bằng Edge + canvas (script tạm, ngoài repo). Ảnh trên `main` chụp ở #626 (15/10), trước đợt sửa T-283…T-310.

| Nhóm | Ảnh | Đổi gì |
|---|---|---|
| Không đổi (trùng byte) | `02-tong-quan-so-sanh-team`, `03-chi-tiet-lich-hen`, `03-lich-hen-nam`, `05-du-kien-kyc`, `07-bao-cao-theo-moc`, `09-xoa-lich-hen` | — |
| **Chỉ khác logo** | `07-bao-cao` | Cột sidebar: logo + slogan, các link dịch xuống theo. Phần bên phải sidebar trùng từng điểm |
| Logo + đổi hình nhỏ, chữ không đổi | `02-tong-quan` | màu nhãn trục ngày và vạch ngày chưa tới của chart |
| | `03-lich-hen` | ô lịch tháng (màu số ngày, ô ngoài tháng), viền ô chọn và khung "Chọn một lịch hẹn…" |
| | `04-khach-hang-bang` | ảnh trên `main` còn 1 440 × 900; khung 600 px của script có từ #855 |
| | `08-team` | mũi tên sắp xếp ở tiêu đề bảng |
| | `09-cai-dat-ai` | viền hai ô chọn; nhãn "Phân tích bằng ChatGPT web" in đậm như hai nhãn trên; khung focus mờ quanh tiêu đề "Cài đặt" (app đưa focus về tiêu đề khi đổi màn, `AppShell.tsx:46`) |
| | `09-cai-dat-du-lieu` | phiên bản schema v9 → v13 |
| Đổi chữ / nội dung | `01-bat-dau-sidebar` | logo + slogan; cao 344 → 480 px |
| | `03-ket-qua` | câu help dưới ô Case size (mục 3) |
| | `09-nap-lai` | câu số liệu 10c (mục 2) |
| | `09-cai-dat-thung-rac` | nút **Dọn sạch Thùng rác…** và câu giới thiệu mới; logo |
| | `05-ho-so-kh` | nút lọc Tất cả / KYC / Lịch hẹn của Dòng thời gian; khung từ `main.x` (mục 4) |
| | `06-ai-phan-tich` | `discovery@2` → `discovery@4`; cao 985 → 1 001 px |
| | `04-khach-hang` | khung từ `main.x` tới chân Kanban (script đổi ở #855); thẻ có nhãn "n HĐ" cao hơn thẻ khác |
| Không có sidebar, chỉ đổi màu viền ô nhập / chip / ô lịch | `03-dat-lich`, `03-doi-lich`, `03-lich-hen-thang`, `04-chuyen-nhom`, `04-khach-hang-moi`, `05-ghi-chu-kyc`, `05-hop-dong-moi`, `08-nhan-su-moi` | chữ không đổi |

Câu chữ hướng dẫn đã đối chiếu với các ảnh đổi chữ, và đều khớp: `01-bat-dau.md:83` (logo, slogan), `05-ho-so-kh.md:73` (Tất cả / KYC / Lịch hẹn), `06-ai.md:49` (`discovery@4`), `09-cai-dat.md:68` (10c), `09-cai-dat.md:115` và `:175` (Dọn sạch). Chỉ `03-lich-hen.md:78` phải sửa (mục 3).

Không đụng file cần nhãn `build-exe`. Cỡ (`git diff --numstat`): `e2e/guide/shots.guide.ts` +18 / −15, `docs/user-guide/03-lich-hen.md` +1 / −1, 22 ảnh PNG.

#### Test chấp nhận

- [x] `pnpm exec playwright test -c playwright.guide.config.ts` xanh (13 passed); mỗi ảnh ≤ 150 KiB, tổng ≤ 4 MiB (`check.guide.ts`).
- [x] Mọi ảnh có sidebar có logo Heritas L-CRM: `01-bat-dau-sidebar`, `02-tong-quan`, `03-lich-hen`, `04-khach-hang-bang`, `07-bao-cao`, `08-team`, `09-cai-dat-du-lieu`, `09-cai-dat-ai`, `09-cai-dat-thung-rac`. `04-khach-hang` và `05-ho-so-kh` cắt từ `main.x`, không có sidebar.
- [x] Ảnh Playwright phải cuộn tới: `02-tong-quan-so-sanh-team`, `05-du-kien-kyc`, `06-ai-phan-tich`; dòng đầu không bị header che (mục 1).
- [x] `09-nap-lai.png` có câu số liệu mới của hộp 10c; `03-ket-qua.png` có câu help dưới ô Case size.
- [x] Câu chữ các trang hướng dẫn khớp ảnh mới. Ảnh chỉ khác logo: `07-bao-cao` (bảng trên).
- [x] `pnpm verify` + e2e xanh ở local.

#### Ghi chú OPEN liên quan

- L13 `e2e/guide/shots.guide.ts:30` (`style` của `shot`, review #760): đã sửa (mục 1).
- L15 `docs/user-guide/img/09-nap-lai.png` (câu số liệu 10c, review #825): đã sửa (mục 2).
- L17 `docs/user-guide/img/03-ket-qua.png` (câu help dưới ô Case size, review #838): đã sửa (mục 3).
- L19 ảnh hướng dẫn nặng thêm do logo, `05-ho-so-kh.png` (review #861): đã sửa (mục 4).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-312 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #760, #825, #838, #861 — T-312 (#867, PR #882, `REVIEW: PASS` @`70bd402`):
  - #760, `e2e/guide/shots.guide.ts` (`style` của `shot`): `style` thêm `main * { scroll-margin-top: 0 !important; }`. Playwright gắn `style` trước khi cuộn tới phần cần chụp, nên phần dừng sát mép cửa sổ. Thân PR #882 liệt kê ba ảnh Playwright phải cuộn tới (`02-tong-quan-so-sanh-team`, `05-du-kien-kyc`, `06-ai-phan-tich`); review #882 xem dòng đầu cả ba, không bị header che. Theo đột biến thân PR ghi, mỗi nửa của `style` nay có một ảnh canh: bỏ phần `header` thì 59 dòng đầu của `06-ai-phan-tich` đổi, bỏ phần `scroll-margin-top` thì `05-du-kien-kyc` mất viền chân.
  - #825, `docs/user-guide/img/09-nap-lai.png`: có câu số liệu của hộp 10c ("Toàn bộ dữ liệu hiện tại (1.200 KH, 6.229 lịch hẹn, 988 HĐ) …").
  - #838, `docs/user-guide/img/03-ket-qua.png`: có câu help dưới ô Case size. `docs/user-guide/03-lich-hen.md:78` thêm ngoại lệ của câu đó (số đứng trước là 0 thì là dấu thập phân: `0,500 tr` là 500.000 ₫), chữ theo `outcome.caseSizeHelp` của `apps/desktop/src/i18n/vi.ts`.
  - #861, `docs/user-guide/img/05-ho-so-kh.png`: cắt từ `main.x` như ảnh 04-khach-hang (hàm `rightOfSidebar` của `e2e/guide/shots.guide.ts` dùng chung), 1 208 × 600, 127 730 B. Ảnh lớn nhất nay 141 536 B (`04-khach-hang.png`), tổng 28 ảnh 1 942 246 B. Review #882 chạy lại bộ chụp trên cùng máy: 13 test xanh, 28 ảnh trùng từng byte.

---

# Issue #868 — T-313: Lượt 4: DeepSeek chạy qua DeepSeek Harness (DSH), DeepSeek API trả PAYG, thay OpenCode

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, gate, ready-for-agent

##### Mục tiêu

Kế hoạch lượt 4 và các tài liệu quyết định ghi đúng quyết định Owner ngày 28/10: **DeepSeek v4.1 Flash chạy bằng DeepSeek API trực tiếp với DeepSeek Harness (DSH), trả theo mức dùng (PAYG), không qua OpenCode.**

Owner, 28/10 (comment duyệt G1 trên #863): "anh duyệt G1, nhưng lần review lượt 4 này với Deepseek sẽ không dùng opencode, mà dùng trực tiếp Deepseek API với deepseek harness". Lý do, Owner nói cùng ngày: "Deepseek Harness (DSH) là công cụ chính thức từ Deepseek, gọi API trực tiếp từ Deepseek trả phí dạng PAYG, không qua 1 bên khác như Opencode, chất lượng model cao hơn khá nhiều".

1. **Owner chốt trước khi viết (G4, G6),** theo đề xuất ở comment của Issue này:
   - bản DSH và cách cài trên Home PC;
   - key DeepSeek API: chỗ để, sao cho DSH và model không đọc ra được; thu hồi sau lượt 4;
   - ngân sách PAYG cho 6 gói (G4), theo giá API;
   - DSH chặn đọc / ghi / shell theo đường dẫn tới đâu;
   - log phiên DSH nằm ở đâu, để kiểm độc lập.
2. **Ghi quyết định:**
   - dòng 28/10 ở `PROJECT-STATE.md`;
   - ADR-0001 phụ lục M10: DeepSeek qua DSH, ngày duyệt G1 28/10;
   - dòng ADR-0001 ở README của `docs/decisions/`;
   - dòng lượt 4 ở `CLAUDE.md`: bỏ ngoại lệ OpenCode, ghi DSH;
   - bảng bên review ở spec Phase 6 §6.
3. **Kế hoạch lượt 4, phần đang viết cho OpenCode:**
   - §L4.1;
   - §L4.2 (bảng chỗ làm, máy);
   - §L4.7;
   - §L4.8 (dòng đầu báo cáo của DeepSeek);
   - §L4.9 (bước chuẩn bị, đợt 2);
   - §L4.10 (log DeepSeek, danh sách quét, Owner can thiệp);
   - §L4.11 (B1, đề xuất 9: ghi đổi 28/10);
   - Phụ lục O (prompt DeepSeek);
   - Phụ lục P (cấu hình chặn của DSH thay `opencode.json`).
4. **Ba mục sổ của review #863:**
   - log phiên của Claude và Codex lượt 4 còn ở chỗ ACL đợt 2 không chặn. Cần: ACL hai thư mục log, mẫu chặn trong cấu hình chặn (nếu DSH có), thêm vào danh sách quét §L4.10, bước dọn thư mục bị ignore trước đợt 2;
   - phiên thử không thử luật nào mà chỉ cấu hình chặn giữ;
   - ngày duyệt G1 của M10: đang ghi 27/10, đúng là 28/10.

##### Bối cảnh

- Comment duyệt G1 trên #863 liệt kê phần phải sửa, và giao làm ở PR docs trước khi chạy lượt 4 (B2). Đây cũng là cách đã làm khi Owner đổi cách chạy phần Claude của lượt 3 ngày 20/10. Owner 28/10: làm Issue riêng, không gộp vào T-311.
- Bản duyệt ngày 27/10 (B1, đề xuất 9) chạy DeepSeek trên gói OpenCode Go, tốn hạn mức (G4). DSH gọi DeepSeek API trả PAYG, nên có một dịch vụ trả tiền mới (G4) và một key API mới trên Home PC (G6).
- Review Phase 5 chạy DeepSeek qua OpenCode: ≈ 0,96 USD cho 6 gói, 95 phút.
- T-311 cũng sửa file kế hoạch, nhưng chỉ §L4.5, nên hai Issue không chặn nhau. Chỉ chỗ sửa theo mục, không theo số dòng. PR merge sau chạy `node tools/merge-pr.mjs <N> --dry-run` trước.

##### Tài liệu cần đọc

- Comment duyệt G1 trên #863; comment đề xuất G4 / G6 của Issue này
- `docs/process/deep-review-phase-1-6.md` §L4.1, §L4.2, §L4.7–§L4.11, Phụ lục O, P
- `docs/decisions/0001-mo-hinh-thuc-hien-chi-claude-code.md` phụ lục M2, M10
- `docs/PROJECT-STATE.md` (dòng 26–27/10); `CLAUDE.md` mục "Mô hình thực hiện" (dòng lượt 4); `docs/design/phase-6-hoan-thien.md` §6; `docs/decisions/README.md` (dòng ADR-0001)
- `docs/reviews/raw/2026-10-10/common-opencode-config.md`, `docs/reviews/raw/2026-10-10/common-plan-opencode.md` (cấu hình chặn và phiên thử của review Phase 5); `docs/reviews/2026-10-10-danh-gia-deepseek-muse.md` (chi phí, hành vi của DeepSeek)
- `docs/state/review-notes.md`: mục OPEN gắn [T-313]
- Tài liệu chính thức của DSH và bảng giá DeepSeek API (link ở comment đề xuất)

##### File / thư mục được phép sửa

- `docs/process/deep-review-phase-1-6.md` (§L4.1, §L4.2, §L4.7–§L4.11, Phụ lục O, P)
- `docs/decisions/0001-mo-hinh-thuc-hien-chi-claude-code.md` (phụ lục M10)
- `docs/decisions/README.md` (dòng ADR-0001)
- `docs/design/phase-6-hoan-thien.md` (§6)
- `docs/PROJECT-STATE.md`
- `CLAUDE.md` (dòng lượt 4 ở mục "Mô hình thực hiện")

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `e593f69`, nhãn theo PR sổ gắn lại nhãn ngày 28/10):

- **Gộp** mọi mục [T-313] (3 mục, review #863): log phiên Claude / Codex ở đợt 2; phiên thử; ngày duyệt G1 của M10.
- **Để lại**, thuộc T-311:
  - NIT K21 / K31 và dòng R1 CL3-A29 (§L4.5 của cùng file);
  - mục lệnh đếm của `phase-6.md`: khớp chỉ vì chữ ghi chú nhắc `CLAUDE.md`.

##### Interface / hợp đồng

- **Bên DeepSeek:** model DeepSeek v4.1 Flash (tên model theo DeepSeek API), chạy bằng DSH, chỉ đọc, không viết code; báo cáo là dữ liệu tham khảo (M2, M10). Giữ nguyên: ID `DSR4-<gói><số>`, thư mục `deep-review-1-6-r4\deepseek\`, đợt 2 chạy một mình sau 12 báo cáo đợt 1.
- **Key DeepSeek API (G6):** Owner tự nhập key vào DSH. Không phiên Claude nào đọc, đặt, in hay lưu key. Key không vào repo, không vào thư mục bằng chứng, không vào log chép vào repo.
- **Lớp chặn:** ACL của đợt 2 là lớp chính. Cấu hình chặn của DSH (nếu có) chỉ thêm, và kế hoạch ghi rõ phần model vẫn lách được.

##### Test chấp nhận

- [ ] Owner chốt năm điểm ở mục 1 (ghi ngày, G4 / G6) trước khi merge.
- [ ] Phần lượt 4 không còn nói DeepSeek chạy qua OpenCode, gói Go hay `opencode.json` (lệnh `rg` ghi trong PR). Chỗ nhắc OpenCode Go là runtime AI của sản phẩm giữ nguyên.
- [ ] Phụ lục P là cấu hình chặn của DSH theo tài liệu của bản Owner chốt, mỗi luật dẫn mục tài liệu. Nếu DSH không có luật theo đường dẫn: Phụ lục P ghi vậy, và ACL chặn mọi thư mục DeepSeek không được đọc.
- [ ] Phiên thử của đợt 2:
  - nếu DSH có luật theo đường dẫn, có ít nhất một việc thử luật mà chỉ cấu hình giữ (thư mục không có ACL);
  - nếu không có, phiên thử kiểm ACL ở từng thư mục bị chặn.
- [ ] Thư mục log phiên của Claude và Codex lượt 4 bị chặn ở đợt 2 (ACL, cùng cấu hình chặn nếu DSH có) và gỡ ở bước cuối, hoặc kế hoạch ghi lý do Owner chọn khác.
- [ ] Danh sách quét §L4.10 có hai thư mục đó, và kế hoạch có bước dọn thư mục bị ignore của worktree review trước đợt 2.
- [ ] §L4.10 ghi chỗ lấy log phiên DSH cho từng gói và cách chép vào `deepseek\<gói>\`.
- [ ] ADR-0001 M10 và README của `docs/decisions/` ghi ngày duyệt G1 28/10 và DeepSeek qua DSH; `PROJECT-STATE.md` có dòng 28/10; `CLAUDE.md` và spec Phase 6 §6 khớp.
- [ ] PR chỉ đổi tài liệu (không chạy CI).

Ước lượng: PR docs, ≈ 150–250 dòng.

##### Định nghĩa hoàn thành

- [ ] Review phiên sạch: PASS (PR docs: không gọi `code-review`)
- [ ] Owner chốt G4 / G6 (ghi ngày), merge
- [ ] PR sổ sau review chuyển các mục [T-313] sang RESOLVED

##### Rủi ro

risk:low

##### Bị chặn bởi

Không. Chờ Owner chốt G4 / G6 (nhãn `gate`).

## PR #872 — docs: run DeepSeek of round 4 through the DeepSeek Harness (T-313)

Trạng thái: MERGED · merge 2026-10-28T05:19:02Z · commit `98a48e708faaed31e07be97495a6d67ddb6ddc70` · nhánh `task/T-313-deepseek-dsh` · nhãn: type:task, risk:low

Closes #868

#### Thay đổi

PR này ghi quyết định Owner ngày 28/10: DeepSeek v4.1 Flash của lượt 4 chạy qua **DeepSeek Harness (DSH)**, gọi DeepSeek API trực tiếp, trả theo mức dùng, thay cho OpenCode. G4 / G6 Owner duyệt cùng ngày trên #868 ([đề xuất](https://github.com/AlexH-AI/Project-2C/issues/868#issuecomment-6451719507), [duyệt](https://github.com/AlexH-AI/Project-2C/issues/868#issuecomment-6452211119)): DSH `0.2.1-rc.2`, phương án (b) cùng user, key riêng nạp 10 USD, trần 15 USD, thu hồi key ngay sau gói F, log phiên và phiên thử như đề xuất.

**Kế hoạch lượt 4** (`docs/process/deep-review-phase-1-6.md`):
- §L4.1, §L4.2: bên DeepSeek chạy qua DSH. Đoạn "vì sao hai đợt" nay ghi ACL là lớp chặn đọc duy nhất, cả cho bản sao và thư mục lượt 1–3. Máy: DSH do Owner cài.
- §L4.7: cách chạy; chi phí (G4: nạp 10 USD, trần 15 USD; ước 3–5 USD giờ thấp điểm; giờ cao điểm tính theo giờ Việt Nam); chặn; log. Sửa dòng bài học "gói E liệt kê thư mục".
- §L4.8: dòng đầu báo cáo của DeepSeek ghi bản DSH, model, Effort.
- §L4.9:
  - bước chuẩn bị: kiểm `dsh --version`; dựng patch khi máy chưa có key; chép script đợt 2 và ghi mốc của hai worktree (`dot2.mjs baseline`);
  - đợt 2, viết lại:
    - dọn hai worktree theo mốc và cache tạm (`dot2.mjs clean`);
    - `gh auth logout`, kiểm biến môi trường;
    - chặn ACL rồi quét bản sao (`deny`, `scan`);
    - mở DSH và ghim workspace;
    - phiên thử: mục nào làm dừng, mục nào chỉ ghi lại, kể cả chạy thử exe có cổng debug và một probe Playwright trong sandbox;
    - ghi thư mục phiên DSH của từng gói;
    - thu hồi key trước khi chép log, rồi gỡ ACL (`remove`).
- §L4.10: log DSH (Owner chép ra sau khi thu hồi key; nhận gói theo bảng đánh dấu; giải nén zstd bằng Node, dừng khi thiếu file); log thô không vào repo; thêm mục vào danh sách quét; đổi tên file thành `common-dsh-deepseek.md`; ghi chi phí thay cho hạn mức gói Go; việc của Owner.
- §L4.11: ghi thay đổi ngày 28/10 (lời Owner, lời duyệt G4 / G6) và phần đổi sau review #872 (Owner xác nhận G6 cùng ngày); B1 và đề xuất 9 trỏ sang đó; ngày duyệt G1 là 28/10.
- Phụ lục O (prompt DeepSeek):
  - cấm `dsh`, `/permission`, `127.0.0.1:3080`, `~/.dsh`, đổi quyền file, `common\dot2.mjs`, file đăng nhập và dữ liệu của Claude / Codex;
  - cấm cả `deep-review-1-6\` và worktree của Codex;
  - `git status` cuối phiên như đầu phiên;
  - mục 1 của báo cáo ghi bản DSH.
- Phụ lục P viết lại thành cấu hình DSH, gồm:
  - tài liệu chính thức nói gì;
  - ranh giới key theo thứ tự;
  - bảng giá trị phải có, kèm nguồn;
  - mẫu patch;
  - các bước dựng và kiểm;
  - bảng đối chiếu từng luật của `opencode.json` cũ sang lớp chặn mới;
  - **script đợt 2** `common\dot2.mjs` (`baseline` / `clean` / `deny` / `scan` / `remove`), nguyên văn;
  - rủi ro còn lại.

**Ghi quyết định:**
- ADR-0001 phụ lục M10: DeepSeek qua DSH, G4 / G6 ngày 28/10. Tiêu đề thành "Owner quyết 26–28/10/2026 · Issue #854, #868"; thêm câu "Owner duyệt G1 ngày 28/10/2026".
- `docs/decisions/README.md`, dòng ADR-0001: DeepSeek qua DSH; "M10 Accepted (G1, 2026-10-28)".
- `docs/PROJECT-STATE.md`: thêm dòng 2026-10-28, gồm "log thô không vào repo" và xác nhận G6 sau review #872.
- `CLAUDE.md`, dòng lượt 4: DeepSeek qua DSH; bỏ ngoại lệ "không dùng OpenCode… để review"; key do Owner nhập.
- Spec Phase 6 (`docs/design/phase-6-hoan-thien.md`): hàng DeepSeek của bảng §6.1, đoạn lượt 4 ở §6.3, câu M10 ở §6.5.

#### Sửa sau review

Review @`4979b23` (`REVIEW: CHANGES`, 5 mục chặn). Sửa ở `c8f0b0d`, `0866804`, `1d38bdd`; `903bfe4` ghi xác nhận G6 của Owner.

**Gửi phiên review:** khối `js` ở Phụ lục P (mục "Script đợt 2", 273 dòng) là code chạy thật: Owner chạy nó ở đợt 2, và nó đổi ACL trong hồ sơ user của Owner. PR chỉ đổi file `.md` nên `review-pr` không gọi `code-review`; xin đọc khối này như code.

| Mục review | Sửa |
|---|---|
| [chặn] `file-history` ngoài ACL đợt 2 | Đúng, kiểm lại trên Home PC: 15 phiên của worktree review có `file-history`, trong đó có bản `{GÓI}.md`. Kiểm thêm thấy hai chỗ nữa: scratchpad `%TEMP%\claude\C--workspace-Project-2C-review` của các phiên Claude, và cache tạm `%TEMP%\playwright-transform-cache`, `%TEMP%\…\ssr` giữ code probe có mã `CX3-…`. Đợt 2 chặn `file-history\<id>` theo id phiên (lấy trước khi chặn `projects\…`) và scratchpad; bước 1 xóa cache tạm; `scan` tìm bản sao còn đọc được. Phiên thử, danh sách quét và bước 7 có các mục này |
| [chặn] phiên thử thiếu `…-r4\claude` | Phiên thử đọc `dot2-acl.json`, rồi thử liệt kê / đọc từng loại mục bị chặn, bằng shell và bằng công cụ đọc file của DSH: `…-r4\claude`, `…-r4\codex`, `A.md` của hai bên, thư mục lượt 1–3, `projects`, `file-history`, scratchpad, mục của `.codex` và `Project-2C-review-2` |
| [chặn] lượt 1–3 và `Project-2C-review-2` không có ACL | Chặn cả ba thư mục lượt 1–3: không có hard link ra ngoài, và ACL không đi theo junction bên trong (kiểm 28/10). `Project-2C-review-2` chặn theo từng mục con, để ngỏ `node_modules` và `.git`, vì chặn cả worktree sẽ lan sang `node_modules` của worktree review và checkout chính qua hard link. Dọn chạy trước khi chặn. Phụ lục O quy tắc riêng 2 cấm cả `deep-review-1-6\`. Phụ lục P bỏ câu "hậu quả nhỏ" |
| [chặn] log DSH ở nhóm "chỉ ghi lại" | Về lại nhóm làm dừng, như đề xuất Owner duyệt: Owner giải nén log của phiên thử trong bộ nhớ và in tên trường của dòng JSON đầu, không chép log ra |
| [chặn] "Log thô không vào repo" thiếu | Thêm ở §L4.10 và dòng 28/10 của `PROJECT-STATE.md` |
| [không chặn] nhận phiên DSH theo gói | Bảng đánh dấu thêm dòng thư mục phiên DSH; Owner ghi khi mở gói; §L4.10 đối chiếu bằng tin nhắn "Gói X." trong log |
| [NIT] đề xuất 9 trỏ Phụ lục P mới | "(Phụ lục P bản 27/10, PR #863)" |
| [NIT] bảng yêu cầu đầu "# Lượt 4" | Thêm dòng "Owner 28/10: DeepSeek qua DSH (T-313 #868)" (ngoài mục Issue cho sửa; xem "Lệch so với Issue") |
| [không chặn, Standards] bước dọn nuốt lỗi | `dot2.mjs clean` so hai worktree với mốc ghi ở bước chuẩn bị, xóa phần thừa, rồi kiểm lại; lệch thì `STOP` |

**Thêm, tự thấy khi sửa:** bản `4979b23` chặn `%USERPROFILE%\.codex` bằng `(OI)(CI)` trên cả thư mục. Trên Home PC, 44 file trong `.codex\.chatgpt-projects\…\node_modules` là hard link với `node_modules` của `Project-2C-review` (35 file), checkout chính (35) và `Project-2C-review-2` (44). ACL ghi vào chính file, nên chặn mọi đường dẫn của file đó. Như vậy đợt 2 sẽ làm hỏng `node_modules` của worktree mà DeepSeek chạy. Nay `.codex` chặn theo từng mục con như `Project-2C-review-2`, và `deny` dừng, không chặn gì, khi một thư mục phải chặn cả có hard link ra ngoài.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --pr 872` (sổ @ `1f10699`, sau T-310 / T-311), có 4 mục "Trùng file":

- **L21** `docs/process/deep-review-phase-1-6.md` [T-313] (log phiên Claude / Codex không bị chặn ở đợt 2): **đã sửa**.
  - Đợt 2 bước 3 chặn `%USERPROFILE%\.codex` (theo từng mục con), transcript Claude của worktree review, cùng `file-history` và scratchpad của các phiên đó; bước 7 gỡ.
  - Bước 1 dọn hai worktree theo mốc và cache tạm.
  - §L4.10 quét thêm `.codex`, `.claude*\projects`, `.claude*\file-history`, `%TEMP%\claude`, `%APPDATA%\Claude`, `%LOCALAPPDATA%\OpenAI`.
  - Mẫu chặn trong cấu hình: không đặt được, vì DSH không có luật đọc theo đường dẫn. Phụ lục P ghi ACL là lớp chặn đọc duy nhất.
- **L22** `docs/process/deep-review-phase-1-6.md` [T-313] (phiên thử không thử luật nào mà chỉ cấu hình giữ): **đã sửa** theo test chấp nhận của #868.
  - DSH không có luật đọc theo đường dẫn, nên phiên thử kiểm ACL ở từng loại mục bị chặn, gồm `…-r4\claude` (sửa sau review).
  - Thêm các việc kiểm: ghi bằng shell và bằng công cụ ghi file của DSH, công cụ web, `gh`, thư mục làm việc (cwd) của phiên, `node_modules` của worktree review, log DSH.
- **L23** `docs/decisions/README.md`, ADR-0001 [T-313] (ngày duyệt G1 của M10): **đã sửa**.
  - README: "M10 Accepted (G1, 2026-10-28)".
  - Tiêu đề M10: "Owner quyết 26–28/10/2026".
  - Thêm câu "Owner duyệt G1 ngày 28/10/2026 (comment trên PR #863)".
- **L27** `docs/process/deep-review-phase-1-6.md` [G7] (NIT §L4.4 phần 1: câu tóm tắt R1 ghi "CL3-A29 (#805)"): **đã sửa** thành "CL3-A29 (#742 một phần, #805)", khớp dòng CL3-A29 của bảng R1. Mục này ngoài các mục Issue cho sửa (xem "Lệch so với Issue"). Mục [G7] còn lại của review #871 (`e2e/customer-ai.spec.ts`) là code, không thuộc PR docs này.

#### Lệch so với Issue

- **Owner xác nhận G6 ngày 28/10** ([comment trên #868](https://github.com/AlexH-AI/Project-2C/issues/868#issuecomment-6460751240)): "Anh xác nhận G6 cho bộ ACL mới của đợt 2 và việc chạy script dot2.mjs, phương án (a) cho danh sách phiên của app desktop." Bộ ACL đợt 2 khác bộ bốn thư mục Owner duyệt lần đầu cùng ngày:
  - thêm `file-history\<id>` và scratchpad `%TEMP%\claude\C--workspace-Project-2C-review` của các phiên Claude ở worktree review;
  - thêm thư mục lượt 1–3 (`deep-review-1-6`, `-r2`, `-r3`) và worktree `Project-2C-review-2`;
  - đổi cách chặn: `.codex` và `Project-2C-review-2` chặn theo từng mục con, để ngỏ `node_modules` và `.git` (hard link với ba checkout);
  - dọn, chặn, quét bản sao và gỡ bằng script `common\dot2.mjs` (Phụ lục P), thay lệnh `icacls` gõ tay; dọn thêm cache tạm trong `%TEMP%`. Owner chạy script này trên hồ sơ user của mình, nên phần xác nhận G6 gồm cả việc chạy script;
  - phần còn hở ghi ở Phụ lục P: metadata phiên của app desktop Claude, dữ liệu nén, và model gỡ được ACL vì cùng user.
    - Với metadata phiên của app desktop, Owner chọn (a): `scan` chỉ in ra chỗ thấy trong `%APPDATA%\Claude\claude-code-sessions`, Owner ghi vào `baseline.md`, đợt 2 chạy tiếp.
    - Không chọn (b): đóng app desktop Claude suốt đợt 2 và chặn cả các file đó.
- Phụ lục O và §L4.9 thêm `Project-2C-review-2` (worktree của Codex): cấm trong prompt, dọn, chặn theo từng mục con, thêm vào danh sách quét. Lý do: DeepSeek biết đường dẫn này từ `plan.md`, mà bản DSH không có luật nào che. Việc này vẫn trong phạm vi chặn của Issue.
- Patch DSH không đụng hàng `llm-deepseek`. Model và Effort chọn ở bộ chọn của giao diện, vì patch thay cả `config` của hàng và có thể làm mất tham chiếu key.
- Hai chỗ một dòng ngoài các mục Issue cho sửa của file kế hoạch: dòng "Owner 28/10" trong bảng yêu cầu ở đầu "# Lượt 4" (review #872 gợi ý), và câu tóm tắt R1 ở §L4.4 phần 1 (mục sổ L27).

#### Kiểm tra

- `rg -i "OpenCode|opencode|gói Go"` trên phần lượt 4 (từ `# Lượt 4`) còn 16 dòng, như trước khi sửa sau review. Mỗi dòng thuộc một trong ba loại:
  - lịch sử quyết định: bản 27/10, B1, đề xuất 9, lời Owner, bảng đối chiếu luật cũ trong Phụ lục P;
  - tên file của Phase 5: `common-plan-opencode.md`;
  - runtime AI của sản phẩm: K32, Phụ lục N, `OPENCODE_GO_KEY`.
- Script `dot2.mjs` (Node v24.20.0, Home PC):
  - Test đầu-cuối trên cây giả trong thư mục tạm, gồm repo git có hai worktree, file `node_modules` hard link vào ba checkout và `.codex`, junction kiểu pnpm, transcript / `file-history` / scratchpad giả. Kết quả 79 kiểm, đều đạt, ở cả đường dẫn thường lẫn đường dẫn có dấu cách (như `C:\Users\<user>`); `icacls` chạy với tên user thật, có dấu cách. Trong đó:
    - `deny` dừng khi có hard link ra ngoài;
    - file hard link vẫn đọc được sau khi chặn;
    - `git worktree list` không coi `Project-2C-review-2` là hỏng;
    - `scan` thấy bản sao UTF-8 / UTF-16LE, bỏ file cũ hơn mốc, và chỉ in ra (không `STOP`) chỗ thấy trong danh sách phiên của app desktop;
    - `remove` trả lại hết.
  - Trên thư mục thật, chỉ đọc. `deny --dry-run` ra 62 mục thư mục và 58 mục file, để ngỏ 4 mục, chạy 1 giây. `scan` với mốc lùi về 20/10 đọc 69 308 file trong 76 giây, 0 chỗ khớp.
  - Khối code trong kế hoạch trùng từng byte với bản đã test.
  - Node 24.20 crash (heap corruption) khi `toString('utf16le')` một view có độ dài lẻ ở offset lẻ. Script cắt view đó về độ dài chẵn.
- ACL thử trên thư mục tạm: deny `(OI)(CI)(R)` không đi theo junction, nhưng chặn cả đường dẫn bên ngoài của file hard link; `/remove:d` trả lại cả hai. `fsutil hardlink list` cho thấy `node_modules` của ba checkout dùng chung file.
- Quét mã lượt 3 (`CL3-…`, `CX3-…`, dòng đầu báo cáo) trên Home PC:
  - thấy ở `.claude\file-history`, `%TEMP%\claude\…`, `%TEMP%\playwright-transform-cache`, `%TEMP%\…\ssr`;
  - không thấy ở `%APPDATA%\Claude`, `%LOCALAPPDATA%\Claude`, `%LOCALAPPDATA%\OpenAI`, `%LOCALAPPDATA%\Packages\Claude_…`, `…\OpenAI.Codex_…`;
  - cách quét chỉ thấy chữ không nén (UTF-8 / UTF-16LE).
- Lệnh đọc log DSH của phiên thử và lệnh giải nén ở §L4.10 lấy nguyên văn từ kế hoạch, chạy trên log zstd mẫu: ra tên trường của dòng JSON đầu; báo lỗi khi không có file `.zstd`, khi file hỏng, khi thiếu log của một gói.
- Lệnh `node node_modules/vitest/vitest.mjs run packages/domain` của phiên thử, chạy ở checkout chính: 21 file, 804 test, xanh.
- Rào khối code của kế hoạch cân. Không CR, không ký tự ẩn, `git diff --check` sạch. Kế hoạch không có chuỗi nào khớp mẫu của `scan`.
- `git merge-tree` với `main` hiện tại (`1f10699`): không xung đột.
- Không test nào đọc nội dung các file đã sửa (`rg` trên `*.{mjs,ts,tsx,js,json,yml}`). `CLAUDE.md` gốc không thuộc `CODE_DOCS`, nên PR chỉ đổi tài liệu và CI không chạy.
- Làm trong worktree `C:\workspace\Project-2C-t313` (lúc bắt đầu, checkout chính đang được dùng cho T-310).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-313 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #863, #870 — T-313 (#868, PR #872, `REVIEW: PASS` @`903bfe4`):
  - #863, `docs/process/deep-review-phase-1-6.md` (§L4.9 đợt 2, §L4.10, Phụ lục P): đợt 2 chạy script `common\dot2.mjs`. Bước 1 dọn hai worktree theo mốc ghi ở bước chuẩn bị, cùng cache Vite / Vitest và cache tạm có code probe. Bước 3 chặn đọc bằng ACL: transcript Claude của worktree review, `file-history\<id>` và scratchpad của các phiên đó, `%USERPROFILE%\.codex` (theo từng mục con), thư mục lượt 1–3, `Project-2C-review-2`; rồi `scan` tìm bản sao việc lượt 4 còn đọc được. Bước 7 gỡ ACL. Danh sách quét §L4.10 có `.codex`, `.claude*\projects`, `.claude*\file-history`, `%TEMP%\claude`, `%APPDATA%\Claude`, `%LOCALAPPDATA%\OpenAI`. DSH không có luật đọc theo đường dẫn nên cấu hình không có mẫu chặn; Phụ lục P ghi ACL là lớp chặn đọc duy nhất. Bước dọn còn hở khi thư mục bị ignore có sẵn lúc ghi mốc: ghi chú mới của review #872, PR #878 sửa (nhóm T-314 ở trên).
  - #863, `docs/process/deep-review-phase-1-6.md` (§L4.9 đợt 2 bước 5, phiên thử): DSH không có luật theo đường dẫn, nên phiên thử kiểm ACL ở từng loại mục bị chặn (`…-r4\claude`, `…-r4\codex`, thư mục lượt 1–3, transcript, `file-history`, scratchpad, mục của `.codex`, `Project-2C-review-2`), một lần bằng shell, một lần bằng công cụ đọc file của DSH. Phiên thử kiểm thêm `node_modules` của worktree review, việc ghi bằng shell và bằng công cụ ghi file, công cụ web, `gh` và log DSH.
  - #863, `docs/decisions/README.md`, `docs/decisions/0001-mo-hinh-thuc-hien-chi-claude-code.md`: dòng ADR-0001 của README ghi "M10 Accepted (G1, 2026-10-28)"; tiêu đề M10 là "Owner quyết 26–28/10/2026 · Issue #854, #868", thêm câu "Owner duyệt G1 ngày 28/10/2026 (comment trên PR #863)". Cùng PR, M10 và README ghi DeepSeek qua DSH.
  - #870 NIT, `docs/process/deep-review-phase-1-6.md` (§L4.4 phần 1): câu tóm tắt ghi "CL3-A29 (#742 một phần, #805)", khớp dòng CL3-A29 của bảng R1 (§L4.5 phần 4).

---

# Issue #876 — T-314: Mục sổ [G7] trước lượt 4: dot2.mjs clean / remove, phiên thử, bảng yêu cầu, số dư DeepSeek, ca e2e Cài đặt

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sổ ghi chú review không còn mục [G7] nào, để lượt 4 deep review ghim được SHA. Theo B2, lượt 4 chỉ chạy khi mục OPEN của sổ rỗng. Bốn mục [T-312 #867] còn lại thuộc Issue riêng.

Sáu mục [G7] sửa trong một PR nhỏ, như Owner đã định cho ghi chú của review #870 / #871 ("ở PR nhỏ trước lượt 4"):

1. **Ca e2e chập chờn có sẵn** (review #871): ca "a run that fails while the profile is left says its error once shown again (T-297)".
   - Ca bấm link "Cài đặt" rồi `goBack()` ngay, không chờ màn Cài đặt hiện.
   - Khi hai lần đổi hash rơi vào cùng một lượt render, hồ sơ không bị gỡ nên lỗi không được đánh dấu "đã nói", và ca đỏ. Thân PR #871: `--repeat-each=8` đỏ 2/8.
2. **Kế hoạch lượt 4, năm ghi chú của review #872:**
   - `clean` của script `dot2.mjs` liệt kê mục bị ignore theo cả thư mục. Vì vậy file mới nằm trong một thư mục bị ignore đã có lúc ghi mốc thì không bị xóa, mà lệnh vẫn in `OK`. Review đã tái hiện trên cây giả.
   - Phiên thử (đợt 2 bước 5) để model tự chọn "hai mục `file` của `.codex`", nên model có thể chọn `auth.json`.
   - Nhánh dự phòng của `remove` (khi không có `dot2-acl.json`) không gỡ mục tách ở tầng sâu, mà vẫn in `OK`.
   - Dòng "Owner 28/10: DeepSeek qua DSH" của bảng yêu cầu đầu "# Lượt 4" thiếu §L4.2, §L4.8.
   - Không bước nào ghi số dư DeepSeek lúc bắt đầu: chỉ bước 7.1 nói "số dư trước / sau".

##### Bối cảnh

- Kế hoạch lượt 4: T-309 (#854), Owner duyệt G1 ngày 28/10 trên #863. Phần DeepSeek qua DSH: T-313 (#868, PR #872). B2 (§L4.11 mục 8): lượt 4 chỉ chạy khi sổ OPEN rỗng.
- Ghi chú của review #871 (T-310) và #870 (T-311) gắn [G7], "sửa ở PR nhỏ trước lượt 4"; mục của #870 đã sửa trong PR #872. Năm ghi chú của review #872 vào sổ qua PR sổ #875 (28/10).
- Script `dot2.mjs` (Phụ lục P) là code chạy thật:
  - bước chuẩn bị chép nguyên văn khối `js` của kế hoạch;
  - Owner chạy script ở đợt 2, và script đổi ACL trong hồ sơ user của Owner;
  - Owner xác nhận G6 ngày 28/10 trên #868 cho bộ ACL mới, cho việc chạy script và cho phương án (a) với danh sách phiên của app desktop.
- T-312 (#867, chụp lại ảnh hướng dẫn) là Issue riêng: không chặn Issue này, cũng không bị Issue này chặn.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`, mục OPEN: mục của nhóm review #871 và nhóm review #872 (`node tools/notes-for.mjs <issue>`).
- Comment review PR #872 (`REVIEW: PASS` @`903bfe4`), mục Correctness: cách tái hiện `clean` trên cây giả. https://github.com/AlexH-AI/Project-2C/pull/872#issuecomment-6461310622
- Thân PR #872, mục "Kiểm tra": cách đã thử script (cây giả, `deny --dry-run`, ACL trên thư mục tạm).
- `docs/process/deep-review-phase-1-6.md`:
  - bảng yêu cầu đầu "# Lượt 4";
  - §L4.9: bước chuẩn bị 3–4; đợt 2 bước 1, 3, 4, 5, 7; bảng đánh dấu;
  - Phụ lục P: mục "Script đợt 2" và khối `js`, "Còn hở sau review #872".
- `e2e/customer-ai.spec.ts`: ca T-297 nêu trên (`:310–313` ở `main` `60c46f0`).
- Thân PR #871, phần ca e2e chập chờn: tái hiện và cách sửa.
- Comment Owner xác nhận G6 ngày 28/10 trên #868: phạm vi ACL và phạm vi dọn đã duyệt.

##### File / thư mục được phép sửa

- `docs/process/deep-review-phase-1-6.md` (bảng yêu cầu đầu "# Lượt 4"; §L4.9; Phụ lục P)
- `e2e/customer-ai.spec.ts` (chỉ ca T-297 nêu trên)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` với hai đường dẫn trên (sổ @ `60c46f0`) ra 6 mục "Trùng file". **Gộp cả 6**, vì đây chính là việc của Issue:

- L21 [G7], review #871: ca e2e chờ màn Cài đặt.
- L23 [G7], review #872: `clean` và thư mục bị ignore có sẵn lúc ghi mốc.
- L24 [G7], review #872: phiên thử và `auth.json`.
- L25 [G7] NIT, review #872: nhánh dự phòng của `remove`.
- L26 [G7] NIT, review #872: bảng yêu cầu thiếu §L4.2, §L4.8.
- L27 [G7] NIT, review #872: ghi số dư DeepSeek lúc bắt đầu.

Không để lại mục nào.

##### Interface / hợp đồng

- Khối `js` của Phụ lục P vẫn đúng là file Owner sẽ chạy. Giữ nguyên năm lệnh `baseline` / `clean` / `deny [--dry-run]` / `scan` / `remove`, dòng `OK` / `STOP` và mã thoát.
- Không bao giờ xóa hay chặn `node_modules`. File Codex tự sinh ở worktree Codex, đã có trong mốc, giữ nguyên.
- G6: bộ ACL đợt 2 và phạm vi dọn Owner đã xác nhận ngày 28/10. Phạm vi dọn đó gồm: mục chưa theo dõi / bị ignore không có trong mốc, cache Vite / Vitest, cache tạm có code probe.
  - Cách sửa nào làm đổi bộ ACL, hay xóa thêm thứ ngoài phạm vi đó, thì hỏi Owner trước và ghi ngày.
  - Ví dụ cần hỏi: xóa file quyền cục bộ của Claude, hay thư mục build Rust của worktree review.
- Chạy thử script chỉ trên cây giả trong thư mục tạm, với `TEMP` / `USERPROFILE` giả.
  - Không chạy `icacls` trên thư mục thật.
  - Không tạo thư mục bằng chứng lượt 4: bước chuẩn bị dừng khi thấy thư mục đó đã có.
- Ca e2e: chỉ thêm bước chờ, không đổi code app.

##### Test chấp nhận

- [ ] Ca e2e T-297 chờ màn Cài đặt hiện (vd. tiêu đề cấp 1 là "Cài đặt") rồi mới `goBack()`. Chạy riêng ca đó với `--repeat-each=16`: xanh 16/16. Thân PR ghi lệnh và kết quả.
- [ ] Không còn đường nào để file mà đợt 1 ghi vào thư mục bị ignore của worktree review sống qua bước dọn.
  - Cách kiểm: dựng kịch bản của review #872 trên cây giả, theo đúng các bước của kế hoạch (bước chuẩn bị 3–4 rồi đợt 2 bước 1). Lúc ghi mốc đã có sẵn thư mục bị ignore; sau mốc thêm file vào đó, thêm một thư mục bị ignore mới và một file chưa theo dõi.
  - Kết quả phải có: sau bước dọn, mọi file thêm sau mốc đều bị xóa; `node_modules` và các mục đã có ở mốc còn nguyên; lệnh in `OK`.
- [ ] `remove` khi không có `dot2-acl.json`, kiểm trên cây giả trong thư mục tạm: chạy `deny`, xóa `dot2-acl.json`, rồi chạy `remove`. Kết quả phải là một trong hai:
  - mọi mục `deny` đã chặn đọc lại được, kể cả mục tách ở tầng sâu (vd. file trong một thư mục con của `.codex` giả mà thư mục đó có hard link ra ngoài);
  - hoặc dòng `OK` của nhánh dự phòng nói rõ chỉ gỡ mục chuẩn, và kế hoạch ghi cách gỡ phần còn lại.
- [ ] Ở phiên thử, việc đọc mục `file` của `.codex` không đọc `auth.json`: kế hoạch nêu tên file cụ thể không chứa thông tin đăng nhập, hoặc chỉ mở file mà không in nội dung.
- [ ] Dòng "Owner 28/10: DeepSeek qua DSH (T-313 #868)" của bảng yêu cầu có §L4.2 và §L4.8.
- [ ] Đợt 2 có bước ghi số dư DeepSeek lúc bắt đầu vào bảng đánh dấu, sau khi nạp và trước phiên thử. Bước 7.1 và câu đầu bảng đánh dấu khớp với bước đó.
- [ ] Khối `js` trích từ kế hoạch qua được `node --check`. Thân PR ghi mọi lần chạy thử script: lệnh, cây giả, kết quả.

Ước lượng: ≈ 40–100 dòng (một dòng e2e, phần script và chữ của kế hoạch).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (PR chạm e2e nên chạy Verify + e2e)
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển 6 mục sang RESOLVED; mục OPEN của sổ chỉ còn các mục [T-312 #867]

##### Rủi ro

risk:low

##### Bị chặn bởi

Không.

## PR #878 — fix: the review notes of round 4 before pinning its SHA (T-314)

Trạng thái: MERGED · merge 2026-10-28T07:27:07Z · commit `63ee94f973c8d1efffed2183afe993c9504e258f` · nhánh `task/T-314-notes-before-r4` · nhãn: risk:low

Closes #876

#### Thay đổi

Sáu mục [T-314] của sổ (review #871, #872). Sửa xong thì lượt 4 ghim được SHA (B2). App không đổi.

1. **Ca e2e T-297 chập chờn** (`e2e/customer-ai.spec.ts`, review #871): bấm "Cài đặt" xong, ca chờ tiêu đề cấp 1 là "Cài đặt" rồi mới `goBack()`.
2. **`dot2.mjs` `baseline` / `clean` so từng file** (Phụ lục P, review #872):
   - `leftovers` liệt kê từng file và thư mục mà git không theo dõi, cả chưa theo dõi lẫn bị ignore, kể cả bên trong thư mục bị ignore (thư mục có `/` cuối). Vì vậy file thêm sau mốc vào `test-results\` hay `coverage\` có sẵn lúc ghi mốc nay bị xóa.
   - Không liệt kê: `node_modules`, thư mục chứa `node_modules`, chỗ link trỏ tới.
   - `clean` xóa tầng sâu trước, và chỉ xóa thư mục khi đã rỗng. Mỗi thư mục mới in một dòng `deleted`. Phần so dùng `Set`, vì mốc nay có cả file bên trong thư mục bị ignore.
   - Review gợi ý ba cách; PR chọn cách so từng file, vì đây là cách duy nhất đạt test chấp nhận mà không xóa gì ngoài phạm vi dọn G6 ngày 28/10:
     - "bước chuẩn bị 3 xóa mọi mục bị ignore" sẽ xóa cả `.claude/settings.local.json` và `target\` có sẵn, mà Issue ghi hai thứ này là phải hỏi Owner;
     - "ghi vào Còn hở" thì không đạt test chấp nhận.
3. **Thêm, tự thấy khi thử: `clean` cũ đi theo junction.** `git ls-files --others` (Git for Windows) đi xuyên junction ngoài `node_modules`. Trên cây giả, `clean` cũ:
   - qua junction `probe-link` → `apps`: xóa `apps/desktop/src/main.ts` (file được theo dõi) và `apps/desktop/src-tauri/gen/schemas/acl.json` (mục của mốc);
   - qua junction `probe-out` trỏ ra ngoài worktree: xóa `outside\plain.txt` và `outside\dist\`.

   Nay đường dẫn nào git liệt kê qua một link thì script ghi chính link đó, và `clean` chỉ xóa link (`fs.rmSync` không đệ quy). Chỗ link trỏ tới còn nguyên. Junction trong thư mục bị ignore hay thư mục mới cũng chỉ là một mục (`Dirent` của junction không phải thư mục).
4. **`remove` ở mọi tầng** (review #872, NIT):
   - Vòng cấp 1 của nhánh dự phòng đổi thành `undoSplit`: đi khắp `.codex` và `Project-2C-review-2` (bỏ `node_modules`, `.git`, link), mục nào còn không đọc được thì gỡ, ở mọi tầng; thư mục đọc được thì đi tiếp.
   - `undoSplit` chạy cả khi có `dot2-acl.json`, nên dòng `OK … all readable again` đúng ở mọi tầng.
   - Lệnh chỉ gọi `icacls` trên mục không đọc được. Thư mục tách và file hard link không bị đụng.
   - Khi thiếu file trạng thái, dòng báo nêu tên hai thư mục đó.
5. **Phiên thử** (§L4.9 đợt 2 bước 5, review #872):
   - Với `.codex`, phiên thử chỉ đọc `version.json` (khóa `latest_version`, `last_checked_at`, `dismissed_version`) và liệt kê `sessions`.
   - Kế hoạch ghi rõ không chọn `auth.json`, `config.toml` hay `models_cache.json`; file sau cùng có trường `identity` (xem tên khóa trên Office Laptop, không xem giá trị).
   - Bằng shell, "đọc" file là chỉ mở, không in nội dung (`node -e "…openSync…" <đường dẫn>`), áp cho mọi mục của phiên thử.
6. **Bảng yêu cầu đầu "# Lượt 4"** (review #872, NIT): dòng "Owner 28/10: DeepSeek qua DSH (T-313 #868)" thêm §L4.2, §L4.8.
7. **Số dư DeepSeek** (review #872, NIT):
   - đợt 2 bước 4 ghi **số dư trước** vào bảng đánh dấu, sau khi nạp và trước phiên thử;
   - bước 7.1 ghi **số dư sau**;
   - câu đầu bảng đánh dấu ghi "trước (đợt 2 bước 4) / sau (bước 7.1)".

Chữ của §L4.9 (bước chuẩn bị 4, đợt 2 bước 1, 7.4) và các dòng mô tả lệnh của Phụ lục P viết lại theo script mới. Phụ lục P thêm đoạn "Sửa sau review #872 (T-314 #876)" ghi lần thử. Khối `js` nay 319 dòng (trước 273).

**Phạm vi G6 không đổi:**
- `deny`, tức bộ ACL, không đổi. `remove` chỉ gỡ chặn.
- `clean` vẫn xóa đúng các loại đã duyệt: mục chưa theo dõi / bị ignore không có trong mốc, cache Vite / Vitest, cache tạm. Chỉ đổi từ so theo thư mục sang so từng file.
- `clean` xóa ít hơn ở hai chỗ: thư mục chứa `node_modules`, và chỗ link trỏ tới.
- Hệ quả cần biết: nếu `apps\desktop\src-tauri\target\` có sẵn lúc ghi mốc, file build sinh sau mốc trong đó (bước 6, đợt 1) bị xóa, file cũ giữ. Bản cũ giữ cả thư mục đó.
  - Worktree review không có `target\` ở Home PC lúc review #872 và ở Office Laptop hôm nay.
  - Vậy `target\` sẽ sinh ở bước 6, sau mốc, và bị xóa cả, như bản cũ.
- File đã có ở mốc mà đợt 1 ghi đè (vd. `.claude/settings.local.json`) vẫn giữ như trước; §L4.9 đợt 2 bước 1 nay ghi rõ điều này, và `scan` đọc các file đó.

#### Test chấp nhận

- [x] Ca e2e T-297 chờ tiêu đề cấp 1 "Cài đặt" rồi mới `goBack()`. `pnpm exec playwright test e2e/customer-ai.spec.ts -g "fails while the profile is left" --repeat-each=16`: **16/16 xanh** (17 passed, tính cả `seed-timing`).
  - Trước khi sửa: `--repeat-each=16` xanh 16/16 trên máy này, `--repeat-each=48 --workers=8` **đỏ 2/48** ở `:313` (`toHaveCount`), đúng như thân PR #871.
  - Sau khi sửa: `--repeat-each=48 --workers=8` **xanh 48/48**.
- [x] File đợt 1 ghi vào thư mục bị ignore không sống qua bước dọn. Kịch bản của review #872 dựng theo đúng các bước của kế hoạch (bước chuẩn bị 3–4 rồi đợt 2 bước 1), chi tiết ở mục Kiểm tra:
  - lúc ghi mốc đã có `test-results\`, `packages\domain\coverage\` bị ignore;
  - sau mốc thêm file vào hai thư mục đó, thêm thư mục bị ignore mới (`playwright-report\`, `apps\desktop\dist\`) và file chưa theo dõi (`foo.txt`);
  - kết quả: mọi file thêm sau mốc bị xóa; `node_modules` và mục đã có ở mốc còn nguyên; `clean` in `OK`.
- [x] `remove` khi không có `dot2-acl.json`: chạy `deny`, xóa `dot2-acl.json`, chạy `remove` → **mọi mục `deny` đã chặn đọc lại được**, kể cả `.codex\.chatgpt-projects\p\other.txt` (file trong thư mục có hard link ra ngoài, tách hai tầng) và thư mục `q` cùng tầng. Bản cũ để lại cả hai mà vẫn in `OK … all readable again`.
- [x] Phiên thử không đọc `auth.json`: kế hoạch nêu `version.json`, và shell chỉ mở mà không in nội dung.
- [x] Dòng "Owner 28/10: DeepSeek qua DSH (T-313 #868)" có §L4.2 và §L4.8.
- [x] Đợt 2 bước 4 ghi số dư lúc bắt đầu (sau khi nạp, trước phiên thử); bước 7.1 và câu đầu bảng đánh dấu khớp.
- [x] Khối `js` trích từ kế hoạch qua `node --check`. Mọi lần chạy thử ghi ở mục Kiểm tra.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `2872150`), 6 mục "Trùng file":

- L21 `e2e/customer-ai.spec.ts` (ca T-297 không chờ màn Cài đặt): **đã sửa**, mục 1.
- L23 `docs/process/deep-review-phase-1-6.md` (`clean` và thư mục bị ignore có sẵn lúc ghi mốc): **đã sửa**, mục 2 (và mục 3, tự thấy khi thử).
- L24 `docs/process/deep-review-phase-1-6.md` (phiên thử có thể chọn `auth.json`): **đã sửa**, mục 5.
- L25 `docs/process/deep-review-phase-1-6.md` (nhánh dự phòng của `remove`): **đã sửa**, mục 4.
- L26 `docs/process/deep-review-phase-1-6.md` (bảng yêu cầu thiếu §L4.2, §L4.8): **đã sửa**, mục 6.
- L27 `docs/process/deep-review-phase-1-6.md` (số dư DeepSeek lúc bắt đầu): **đã sửa**, mục 7.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (125 file test, 3 975 ca).
- [x] Ca e2e T-297: các lần chạy ở mục Test chấp nhận (Office Laptop, Edge, cổng 4173, không phiên nào khác chạy e2e cùng lúc).
- [x] **Script `dot2.mjs`** (Node v24.20.0, Office Laptop). Khối `js` trích nguyên văn từ kế hoạch: bản cũ 273 dòng ở `main` `2872150`, bản mới 319 dòng ở head. Cả hai qua `node --check`.
  - **Cây giả** `%TEMP%\t314\f t <nhãn>\` (đường dẫn có dấu cách), xóa sau mỗi lần chạy:
    - repo git với hai worktree `Project-2C-review`, `-review-2`; file `node_modules` hard link vào ba checkout và `.codex` giả; junction kiểu pnpm;
    - `.codex` giả có `auth.json`, `version.json`, `sessions\`, `.chatgpt-projects\p\{node_modules,other.txt}`, `.chatgpt-projects\q\`;
    - transcript / `file-history` / scratchpad Claude giả; thư mục lượt 1–3; `…-r4\{claude,codex,deepseek,common}`.
  - **Môi trường:** `USERPROFILE`, `TEMP`, `TMP`, `APPDATA`, `LOCALAPPDATA` trỏ vào cây giả; `USERNAME` thật. `icacls` chỉ chạy trên cây giả: bộ thử chỉ chạy `deny` khi `deny --dry-run` không liệt kê đường dẫn nào ngoài cây giả. Không đụng thư mục thật, không tạo `C:\workspace\deep-review-1-6-r4\`.
  - **Bước:** `baseline` → mô phỏng đợt 1 (thêm file như mục Test chấp nhận, cùng thư mục rỗng, thư mục `probe2\` có `node_modules`, cache `.vite`, cache `%TEMP%`, bốn junction ngoài `node_modules`, ghi đè `settings.local.json` / `AGENTS.md`) → `clean` → `deny --dry-run` → `deny` → (chế độ `full`: `scan`) → `remove`.
  - **Ba chế độ:**
    - `default`: xóa `dot2-acl.json` trước `remove`;
    - `state`: `remove` có file trạng thái;
    - `full`: thêm `scan`. Một bản sao `CLR4-B2` ở transcript dự án khác cho `STOP`; bản trong `claude-code-sessions` chỉ in dòng `accepted`; xóa bản sao thì `OK`.

  | Script | Chế độ | Kết quả |
  |---|---|---|
  | cũ | `default` (kịch bản review #872) | 14 phép kiểm đỏ: file mới trong `test-results\` / `coverage\` còn; thư mục rỗng còn; `clean` xóa file được theo dõi qua junction `probe-link`; `clean` dừng `STOP … still has: probe2/` (thư mục có `node_modules`); `remove` để lại `p\other.txt`, `q` mà vẫn in `OK` |
  | cũ | `default` (thêm junction ra ngoài) | 19 phép kiểm đỏ, thêm: xóa `outside\plain.txt`, `outside\dist\` qua junction `probe-out` |
  | mới | `default`, `state`, `full` | đạt hết (54–57 phép kiểm tùy chế độ; mỗi chế độ chạy hai lần) |

  Phép kiểm sau `clean` gồm:
  - mỗi file / thư mục / link thêm sau mốc đã mất; không dòng `deleted` nào đi qua link;
  - `node_modules\newpkg\index.js`, `probe2\node_modules\x\index.js` còn; file hard link vẫn đủ 4 link; junction của ba checkout vẫn đọc được;
  - tám mục của mốc còn (`.last-run.json`, hai `coverage\index.html`, `gen\schemas\acl.json`, `settings.local.json`, `AGENTS.md`, `.codex\config.toml`, `.agents\x.md`);
  - đích của junction (trong và ngoài worktree) còn nguyên; `git status --porcelain` của hai worktree như lúc ghi mốc; thư mục `%TEMP%` khác còn.

  Sau `deny`: mọi mục bị từ chối, file hard link vẫn đọc được. Sau `remove`: mọi mục đọc lại được; có file trạng thái thì `dot2-acl.json` đổi tên.
- [x] Lệnh chỉ-mở của phiên thử, thử trên một file tạm tự tạo: đọc được thì không in gì, mã thoát 0; chặn `(R)` thì `EPERM`, mã thoát 1, không lộ nội dung.
- [x] Không test nào đọc `docs/process/deep-review-phase-1-6.md` (`rg` trên `*.{mjs,ts,tsx,js,json,yml,yaml}`). `git diff --check` sạch, không CR.
- [x] Không đụng file cần nhãn `build-exe`. Không thêm dependency.
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`
- Làm trong worktree `C:\workspace\Project-2C-t314`.

<details><summary>Bộ thử <code>harness.mjs</code> (để tái hiện; không vào repo)</summary>

Chạy: `node extract.mjs docs/process/deep-review-phase-1-6.md dot2.mjs`, rồi `node harness.mjs dot2.mjs <nhãn> [state|full]`. `extract.mjs` lấy khối `js` sau dòng `**Script đợt 2**`.

```js
// T-314: dot2.mjs on a fake tree only, never the real folders.
//   node harness.mjs <dot2.mjs> <label> [state|full] [--keep]
// The tree is %TEMP%\t314\f t <label> (short: Claude's project folder name repeats the review path;
// a space, like C:\Users\<user>). USERPROFILE / TEMP / APPDATA / LOCALAPPDATA point into it;
// deny runs only after deny --dry-run lists nothing outside it.
//   default: baseline, wave 1, clean, deny, delete dot2-acl.json, remove (review #872's two cases)
//   state:   the same, remove with dot2-acl.json
//   full:    state, plus scan (a stray finding ID, then none) between deny and remove
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const [script, label, mode = 'default', keepFlag] = process.argv.slice(2);
const keep = keepFlag === '--keep' || mode === '--keep';
const BASE = path.join(process.env.TEMP, 't314');
const R = path.join(BASE, `f t ${label}`);
if (fs.existsSync(R)) throw new Error(`${R} exists`);
const WS = path.join(R, 'ws');
const HOME = path.join(R, 'home');
const TMP = path.join(R, 'temp');
const APPDATA = path.join(R, 'appdata');
const LAD = path.join(R, 'localappdata');
const R4 = path.join(WS, 'deep-review-1-6-r4');
const COMMON = path.join(R4, 'common');
const MAIN = path.join(WS, 'Project-2C');
const REVIEW = path.join(WS, 'Project-2C-review');
const REVIEW2 = path.join(WS, 'Project-2C-review-2');
const PROJECT = REVIEW.replace(/[^A-Za-z0-9-]/g, '-');
const USER = process.env.USERNAME;
const STORE = path.join(MAIN, 'node_modules', '.pnpm', 'pkg@1', 'node_modules', 'pkg', 'index.js');
const DEEP = path.join(HOME, '.codex', '.chatgpt-projects', 'p', 'other.txt');
const OUTSIDE = path.join(R, 'outside');

const write = (p, s = 'x\n') => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};
const link = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.linkSync(from, to);
};
const junction = (target, at) => {
  fs.mkdirSync(path.dirname(at), { recursive: true });
  fs.symlinkSync(target, at, 'junction');
};
const git = (cwd, ...a) =>
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', '-C', cwd, ...a], { encoding: 'utf8' });
const rel = (p) => path.relative(R, p);
const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const env = { ...process.env, USERPROFILE: HOME, TEMP: TMP, TMP, APPDATA, LOCALAPPDATA: LAD };

function dot2(...args) {
  const r = spawnSync(process.execPath, [path.join(COMMON, 'dot2.mjs'), ...args], { env, encoding: 'utf8' });
  const out = `${r.stdout}${r.stderr}`;
  const lines = out.trimEnd().split('\n');
  const shown = lines.length > 40 ? [...lines.slice(0, 40), `… ${lines.length - 40} more lines`] : lines;
  console.log(`$ node dot2.mjs ${args.join(' ')}  -> exit ${r.status}\n${shown.map((l) => `  | ${l}`).join('\n')}`);
  return { code: r.status, out };
}

let fails = 0;
const check = (ok, what) => {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${what}`);
  if (!ok) fails += 1;
};
const readable = (p) => {
  try {
    if (fs.lstatSync(p).isDirectory()) fs.readdirSync(p);
    else fs.closeSync(fs.openSync(p, 'r'));
    return true;
  } catch (e) {
    if (e.code === 'EPERM' || e.code === 'EACCES') return false;
    throw e;
  }
};
const gone = (p) => !fs.existsSync(p);
const status = (wt) => git(wt, 'status', '--porcelain');

function build() {
  // Main checkout, then the two review worktrees at its HEAD.
  const ignore = ['node_modules/', 'coverage/', 'dist/', 'test-results/', 'playwright-report/'];
  ignore.push('.claude/settings.local.json', 'apps/desktop/src-tauri/gen/', '*.log', '');
  write(path.join(MAIN, '.gitignore'), ignore.join('\n'));
  write(path.join(MAIN, 'package.json'), '{}\n');
  write(path.join(MAIN, 'apps', 'desktop', 'src', 'main.ts'), 'export {};\n');
  write(path.join(MAIN, 'packages', 'domain', 'src', 'a.ts'), 'export {};\n');
  write(path.join(MAIN, '.claude', 'rules', 'x.md'), '# x\n');
  git(MAIN, 'init', '-q', '-b', 'main');
  git(MAIN, 'add', '-A');
  git(MAIN, 'commit', '-q', '-m', 'init');
  git(MAIN, 'worktree', 'add', '-q', '--detach', REVIEW);
  git(MAIN, 'worktree', 'add', '-q', '--detach', REVIEW2);
  // pnpm-like node_modules: one store file hard-linked into the three checkouts and .codex; junctions.
  write(STORE, 'module.exports = 1;\n');
  for (const wt of [REVIEW, REVIEW2]) link(STORE, path.join(wt, 'node_modules', '.pnpm', 'pkg@1', 'node_modules', 'pkg', 'index.js'));
  link(STORE, path.join(HOME, '.codex', '.chatgpt-projects', 'p', 'node_modules', 'pkg', 'index.js'));
  for (const wt of [MAIN, REVIEW, REVIEW2]) {
    junction(path.join(wt, 'node_modules', '.pnpm', 'pkg@1', 'node_modules', 'pkg'), path.join(wt, 'node_modules', 'pkg'));
    junction(path.join(wt, 'node_modules', '.pnpm', 'pkg@1', 'node_modules', 'pkg'), path.join(wt, 'packages', 'domain', 'node_modules', 'pkg'));
  }
  // There before baseline, after preparation step 3 (ignored, and Codex's own untracked files).
  write(path.join(REVIEW, 'test-results', '.last-run.json'), '{"status":"passed"}\n');
  write(path.join(REVIEW, 'packages', 'domain', 'coverage', 'index.html'), 'old\n');
  write(path.join(REVIEW, 'apps', 'desktop', 'src-tauri', 'gen', 'schemas', 'acl.json'), '{}\n');
  write(path.join(REVIEW, '.claude', 'settings.local.json'), '{"permissions":{}}\n');
  write(path.join(REVIEW2, 'AGENTS.md'), '# by Codex\n');
  write(path.join(REVIEW2, '.codex', 'config.toml'), 'x = 1\n');
  write(path.join(REVIEW2, '.agents', 'x.md'), 'x\n');
  write(path.join(REVIEW2, 'packages', 'domain', 'coverage', 'index.html'), 'old\n');
  // Codex data; Claude transcripts, file copies and scratchpads; rounds 1–3.
  write(path.join(HOME, '.codex', 'auth.json'), '{"token":"fake"}\n');
  write(path.join(HOME, '.codex', 'version.json'), '{}\n');
  write(path.join(HOME, '.codex', 'sessions', '2026', '10', '28', 'rollout-1.jsonl'), '{}\n');
  write(DEEP, 'deep\n');
  write(path.join(HOME, '.codex', '.chatgpt-projects', 'q', 'notes.txt'), 'q\n');
  write(path.join(HOME, '.claude', 'projects', PROJECT, 's1.jsonl'), '{}\n');
  write(path.join(HOME, '.claude', 'projects', PROJECT, 's1', 'subagents', 'a.jsonl'), '{}\n');
  write(path.join(HOME, '.claude', 'file-history', 's1', 'abc@v1'), 'copy\n');
  write(path.join(HOME, '.claude', 'file-history', 'other', 'abc@v1'), 'other\n');
  write(path.join(HOME, '.claude', 'projects', 'C--elsewhere', 'o.jsonl'), '{}\n');
  write(path.join(TMP, 'claude', PROJECT, 's1', 'scratchpad', 'n.txt'), 'n\n');
  write(path.join(TMP, 'keep-me', 'k.txt'), 'k\n');
  for (const d of ['deep-review-1-6', 'deep-review-1-6-r2', 'deep-review-1-6-r3']) write(path.join(WS, d, 'claude', 'A.md'), 'old\n');
  for (const d of ['claude', 'codex', 'deepseek']) fs.mkdirSync(path.join(R4, d), { recursive: true });
  fs.mkdirSync(COMMON, { recursive: true });
  fs.copyFileSync(script, path.join(COMMON, 'dot2.mjs'));
  fs.mkdirSync(APPDATA, { recursive: true });
  fs.mkdirSync(LAD, { recursive: true });
}

function wave1() {
  // Left by wave 1 (gates of step 6 too), review #872's case first. No finding ID in them: scan
  // cannot see what is in a trace.zip.
  const added = [
    path.join(REVIEW, 'test-results', 'probe-race-save-chromium', 'error-context.md'),
    path.join(REVIEW, 'test-results', 'probe-race-save-chromium', 'trace.zip'),
    path.join(REVIEW, 'packages', 'domain', 'coverage', 'probe.ts.html'),
    path.join(REVIEW, 'playwright-report', 'index.html'),
    path.join(REVIEW, 'apps', 'desktop', 'dist', 'index.html'),
    path.join(REVIEW, 'foo.txt'),
    path.join(REVIEW, 'notes.log'),
    path.join(REVIEW, 'probe', 'a.mjs'),
    path.join(REVIEW, 'probe2', 'b.mjs'),
    path.join(REVIEW2, '.codex', 'sessions', 'new.jsonl'),
    path.join(REVIEW2, 'scratch.txt'),
    path.join(REVIEW2, 'packages', 'domain', 'coverage', 'probe.ts.html'),
  ];
  for (const p of added) write(p, 'probe\n');
  const folders = [
    path.join(REVIEW, 'test-results', 'probe-race-save-chromium'),
    path.join(REVIEW, 'test-results', 'empty-probe-dir'),
    path.join(REVIEW, 'playwright-report'),
    path.join(REVIEW, 'apps', 'desktop', 'dist'),
    path.join(REVIEW, 'probe'),
    path.join(REVIEW, 'probe', 'empty'),
  ];
  for (const d of folders) fs.mkdirSync(d, { recursive: true });
  // Junctions outside node_modules: clean drops the link, never what it points at (in the worktree
  // or outside it; an ignored folder there too, which git lists through the link).
  write(path.join(OUTSIDE, 'plain.txt'), 'outside\n');
  write(path.join(OUTSIDE, 'dist', 'x.js'), 'outside\n');
  const links = [
    [path.join(REVIEW, 'apps'), path.join(REVIEW, 'probe-link')],
    [OUTSIDE, path.join(REVIEW, 'probe-out')],
    [OUTSIDE, path.join(REVIEW, 'test-results', 'link-out')],
    [OUTSIDE, path.join(REVIEW, 'probe', 'link2')],
  ];
  for (const [target, at] of links) {
    junction(target, at);
    added.push(at);
  }
  // node_modules stays: a new package file, a probe's own node_modules.
  const kept = [path.join(REVIEW, 'node_modules', 'newpkg', 'index.js'), path.join(REVIEW, 'probe2', 'node_modules', 'x', 'index.js')];
  for (const p of kept) write(p, 'module.exports = 2;\n');
  const vite = path.join(REVIEW, 'packages', 'domain', 'node_modules', '.vite');
  write(path.join(vite, 'vitest', 'results.json'), '{}\n');
  // There at baseline, written again by wave 1: kept as they are now.
  write(path.join(REVIEW, '.claude', 'settings.local.json'), '{"permissions":{"allow":["Bash(node probe.mjs)"]}}\n');
  write(path.join(REVIEW2, 'AGENTS.md'), '# by Codex, again\n');
  // %TEMP% caches holding transformed probe code.
  const caches = [path.join(TMP, 'playwright-transform-cache'), path.join(TMP, 'codex-123'), path.join(TMP, 'vite-abc')];
  write(path.join(caches[0], 'x.js'), 'probe\n');
  write(path.join(caches[1], 'y.txt'), 'probe\n');
  write(path.join(caches[2], 'ssr', 'z.js'), 'probe\n');
  write(path.join(R4, 'claude', 'A.md'), 'XONG — claude gói A lượt 4\nCLR4-A1\n');
  write(path.join(R4, 'codex', 'A.md'), 'XONG — codex gói A lượt 4\nCXR4-A1\n');
  return { added, folders, kept, vite, caches };
}

function checkClean(r, w, before) {
  check(r.code === 0 && /^OK: both worktrees are back/m.test(r.out), 'clean: exit 0, OK');
  for (const p of w.added) check(gone(p), `clean deleted ${rel(p)}`);
  for (const d of w.folders) check(gone(d), `clean deleted folder ${rel(d)}`);
  for (const p of w.kept) check(fs.existsSync(p), `node_modules kept: ${rel(p)}`);
  check(gone(w.vite), 'clean deleted the Vite / Vitest cache');
  for (const c of w.caches) check(gone(c), `clean deleted ${rel(c)}`);
  check(fs.existsSync(path.join(TMP, 'keep-me', 'k.txt')), 'other %TEMP% folders kept');
  const there = [
    path.join(REVIEW, 'test-results', '.last-run.json'),
    path.join(REVIEW, 'packages', 'domain', 'coverage', 'index.html'),
    path.join(REVIEW, 'apps', 'desktop', 'src-tauri', 'gen', 'schemas', 'acl.json'),
    path.join(REVIEW, '.claude', 'settings.local.json'),
    path.join(REVIEW2, 'AGENTS.md'),
    path.join(REVIEW2, '.codex', 'config.toml'),
    path.join(REVIEW2, '.agents', 'x.md'),
    path.join(REVIEW2, 'packages', 'domain', 'coverage', 'index.html'),
  ];
  for (const p of there) check(fs.existsSync(p), `baseline entry kept: ${rel(p)}`);
  check(fs.statSync(STORE).nlink === 4, 'hard-linked store file still has its 4 links');
  check(fs.readdirSync(path.join(REVIEW, 'apps', 'desktop', 'src')).includes('main.ts'), 'the junction target (apps) is intact');
  check(['plain.txt', path.join('dist', 'x.js')].every((f) => fs.existsSync(path.join(OUTSIDE, f))), 'the target outside the worktree is intact');
  check(!/^deleted .*\\(probe-link|probe-out|link-out|link2)\\./m.test(r.out), 'no deleted line goes through a link');
  for (const wt of [MAIN, REVIEW, REVIEW2]) {
    check(fs.existsSync(path.join(wt, 'node_modules', 'pkg', 'index.js')), `${rel(wt)}\\node_modules junction still reads`);
  }
  for (const wt of [REVIEW, REVIEW2]) check(status(wt) === before.get(wt), `${rel(wt)}: git status as at baseline`);
}

function denyRemove(withState) {
  const dry = dot2('deny', '--dry-run');
  const listed = [...dry.out.matchAll(/^(?:would deny (?:tree|file)|stays readable) (.+)$/gm)].map((m) => m[1].trim());
  const outside = listed.filter((p) => !p.startsWith(R + path.sep));
  if (dry.code !== 0 || !listed.length || outside.length) {
    console.log(`ABORT before deny: dry run exit ${dry.code}, outside the fake tree: ${outside.join(', ')}`);
    process.exit(2);
  }
  const denied = [...dry.out.matchAll(/^would deny (tree|file) (.+)$/gm)].map((m) => m[2].trim());
  check(denied.includes(DEEP), 'deny goes down to .codex\\.chatgpt-projects\\p\\other.txt (split twice)');
  const r = dot2('deny');
  check(r.code === 0 && /^OK: /m.test(r.out), 'deny: exit 0, OK');
  check(denied.every((p) => !readable(p)), `all ${denied.length} denied entries unreadable`);
  const links = [STORE, path.join(HOME, '.codex', '.chatgpt-projects', 'p', 'node_modules', 'pkg', 'index.js')];
  check(links.every(readable), 'hard-linked node_modules file still readable, in a checkout and in .codex');
  return denied;
}

function finishRemove(denied, withState) {
  const stateFile = path.join(COMMON, 'dot2-acl.json');
  if (!withState) {
    fs.rmSync(stateFile);
    console.log('deleted dot2-acl.json');
  }
  const r = dot2('remove');
  check(r.code === 0 && /^OK: /m.test(r.out), 'remove: exit 0, OK');
  const still = denied.filter((p) => !readable(p));
  check(!still.length, `every entry deny denied reads again${still.length ? `; still denied: ${still.map(rel).join(', ')}` : ''}`);
  if (withState) check(fs.existsSync(path.join(COMMON, 'dot2-acl.removed.json')) && gone(stateFile), 'state renamed to dot2-acl.removed.json');
}

function scanCase() {
  // A finding ID copied where scan reads (another project's transcript), then gone; and one in the
  // desktop app's session list, accepted (Appendix P).
  const stray = path.join(HOME, '.claude', 'projects', 'C--elsewhere', 'o2.jsonl');
  write(stray, '{"text":"CLR4-B2"}\n');
  write(path.join(APPDATA, 'Claude', 'claude-code-sessions', 's.json'), '{"title":"CXR4-C3"}\n');
  const hit = dot2('scan');
  check(hit.code === 1 && hit.out.includes(stray) && /^accepted, write it in baseline\.md: /m.test(hit.out), 'scan: STOP on the stray copy, accepted line for the app list');
  fs.rmSync(stray);
  const ok = dot2('scan');
  check(ok.code === 0 && /^OK: no readable copy/m.test(ok.out), 'scan: OK once the stray copy is gone');
}

let denied = [];
try {
  build();
  const before = new Map([REVIEW, REVIEW2].map((wt) => [wt, status(wt)]));
  const b = dot2('baseline');
  check(b.code === 0, 'baseline: exit 0');
  pause(50);
  const w = wave1();
  checkClean(dot2('clean'), w, before);
  denied = denyRemove();
  if (mode === 'full') scanCase();
  finishRemove(denied, mode !== 'default');
} finally {
  // Whatever happened, no deny is left on the fake tree.
  for (const p of denied) if (fs.existsSync(p)) spawnSync('icacls', [p, '/remove:d', USER, '/Q']);
  if (!keep) fs.rmSync(R, { recursive: true, force: true });
  console.log(`${fails ? `${fails} FAILED` : 'all passed'} (${label}, ${mode})${keep ? `; tree kept at ${R}` : ''}`);
  process.exitCode = fails ? 1 : 0;
}
```

</details>

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-314 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #871, #872 — T-314 (#876, PR #878, `REVIEW: PASS` @`0b55e7b`):
  - #871, `e2e/customer-ai.spec.ts` (ca "a run that fails while the profile is left says its error once shown again (T-297)"): bấm "Cài đặt" xong, ca chờ tiêu đề cấp 1 là "Cài đặt" rồi mới `goBack()`. Thân PR #878: trước khi sửa, `--repeat-each=48 --workers=8` đỏ 2/48; sau khi sửa, xanh 48/48, và `--repeat-each=16` xanh 16/16.
  - #872, `docs/process/deep-review-phase-1-6.md` (`leftovers` / `clean` của `dot2.mjs`, Phụ lục P; §L4.9 bước chuẩn bị 4, đợt 2 bước 1): `baseline` / `clean` so từng file và thư mục mà git không theo dõi, kể cả bên trong thư mục bị ignore, và bỏ `node_modules` cùng thư mục chứa nó. Đường dẫn git liệt kê qua một link thì ghi chính link, và `clean` chỉ xóa link. Tầng sâu xóa trước; thư mục chỉ xóa khi đã rỗng. Review #878 thử lại trên cây giả: file mới trong `test-results\` có sẵn lúc ghi mốc, thư mục mới chỉ có file bị ignore, tên file tiếng Việt, repo git lồng, junction ra ngoài trong thư mục bị ignore và trong thư mục được theo dõi. Mọi mục mới bị xóa; mục của mốc và đích junction còn; lệnh in `OK`. Thư mục mới có `node_modules` còn giữ cache `.vite`: ghi chú mới của review #878, ở OPEN.
  - #872, `docs/process/deep-review-phase-1-6.md` (§L4.9 đợt 2 bước 5, phiên thử): với `.codex`, phiên thử chỉ đọc `version.json` và liệt kê `sessions`; kế hoạch ghi không chọn `auth.json`, `config.toml` hay `models_cache.json`. Bằng shell, đọc file là chỉ mở, không in nội dung (`node -e "…openSync…" <đường dẫn>`).
  - #872 NIT, `docs/process/deep-review-phase-1-6.md` (`remove` của `dot2.mjs`, Phụ lục P; §L4.9 đợt 2 bước 7.4): `undoSplit` đi khắp `.codex` và `Project-2C-review-2` (bỏ `node_modules`, `.git`, link) và gỡ mọi mục còn không đọc được ở mọi tầng, cả khi có lẫn khi không có `dot2-acl.json`. Khi thiếu file trạng thái, dòng báo nêu tên hai thư mục đó.
  - #872 NIT, `docs/process/deep-review-phase-1-6.md` (bảng yêu cầu ở đầu "# Lượt 4"): dòng "Owner 28/10: DeepSeek qua DSH (T-313 #868)" có §L4.2 và §L4.8.
  - #872 NIT, `docs/process/deep-review-phase-1-6.md` (§L4.9 đợt 2 bước 4, 7.1, bảng đánh dấu): bước 4 ghi số dư trước (sau khi nạp, trước phiên thử), bước 7.1 ghi số dư sau, câu đầu bảng đánh dấu ghi "trước (đợt 2 bước 4) / sau (bước 7.1)".

---

# Issue #880 — T-315: Lượt 4: DeepSeek chạy trong app desktop WorkBuddy trên gói WorkBuddy Pro, thay DSH

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, gate

##### Mục tiêu

*Sửa 28/10 theo lần làm rõ của Owner (comment duyệt G6 sửa lại): app desktop WorkBuddy thay CodeBuddy Code CLI.*

Kế hoạch lượt 4 và các tài liệu quyết định ghi đúng quyết định Owner ngày 28/10 (lần 2): **DeepSeek v4.1 Flash chạy trong app desktop WorkBuddy, dùng model gắn sẵn của gói WorkBuddy Pro bản quốc tế, thay DeepSeek Harness (DSH) và DeepSeek API.**

Owner, 28/10, trong phiên Claude: "Chọn workbuddy pro". Lý do, Owner nói cùng phiên:
- "Về tiêu chí gần với inference chính hãng có lẽ Tencent đáng tin hơn những bên khác và đó là lý do anh muốn sub";
- "Anh hướng về sub của Workbuddy vì họ tặng credit daily, và dùng được với codebuddy cli".

Làm rõ cùng ngày, sau khi Owner tự kiểm CLI: "anh làm rõ lại quyết định, sẽ là workbuddy IDE vì codebuddy CLI không chọn được đúng model và context windows". "WorkBuddy IDE" là app desktop WorkBuddy.

1. **Owner chốt trước khi viết (G4, G6),** theo đề xuất ở các comment của Issue này:
   - app desktop WorkBuddy, cách đăng nhập / đăng xuất, cài đặt app;
   - gói WorkBuddy Pro, trần chi phí (G4), cách đo credit;
   - chế độ quyền của app, cùng ACL đợt 2;
   - log phiên và phiên thử.
2. **Ghi quyết định:**
   - dòng 28/10 ở `PROJECT-STATE.md`;
   - ADR-0001 phụ lục M10 và dòng ADR-0001 ở README của `docs/decisions/`;
   - dòng lượt 4 ở `CLAUDE.md`;
   - bảng bên review ở spec Phase 6 §6.
3. **Kế hoạch lượt 4, phần đang viết cho DSH:**
   - bảng yêu cầu ở đầu "# Lượt 4";
   - §L4.1, §L4.2 (bảng chỗ làm, máy);
   - §L4.7 (cách chạy, chi phí, chặn);
   - §L4.8 (dòng đầu báo cáo của DeepSeek);
   - §L4.9 (bước chuẩn bị, đợt 2, bảng đánh dấu);
   - §L4.10 (log DeepSeek, danh sách quét, việc của Owner);
   - §L4.11 (ghi đổi 28/10 lần 2);
   - Phụ lục O (prompt DeepSeek);
   - Phụ lục P: cấu hình app WorkBuddy thay DSH. Bộ ACL và `dot2.mjs` giữ như Owner đã xác nhận G6 ngày 28/10, chỉ đổi chỗ nhắc `.dsh`.
4. **Hai mục sổ [G7] của review #878** (cùng file, cùng §L4.9 / Phụ lục P):
   - `clean` của `dot2.mjs` giữ thư mục mới có `node_modules`, cùng `node_modules\.vite` trong đó, mà vẫn in `OK`;
   - NIT: `apps\desktop\src-tauri\target\` có sẵn lúc ghi mốc thì `clean` xóa một phần, kế hoạch chưa ghi.

##### Bối cảnh

- Phiên nghiên cứu 28/10 (Claude):
  - DeepSeek gọi WorkBuddy (gồm CodeBuddy) là "official partners" của V4.1-Flash (10/09). Bản 1017 "optimized for DeepSeek Harness, Tencent CodeBuddy, WorkBuddy" (17/10).
  - Tài liệu Tencent không ghi model DeepSeek gắn sẵn của WorkBuddy / CodeBuddy chạy đường Vendor Direct (DeepSeek phục vụ) hay bản Tencent tự chạy. Owner chấp nhận, dựa trên độ tin cậy của Tencent.
  - Hai phương án đã xét, Owner không chọn: giữ DSH; Token Plan của Tencent Cloud (Vendor Direct, credit bằng giá API).
- G4 / G6 của DSH (duyệt 28/10 trên #868) không còn dùng. Thay vào đó: một thuê bao mới (G4) và một phiên đăng nhập app mới trên Home PC (G6); không còn key DeepSeek API.
- Bộ ACL đợt 2 và `dot2.mjs` không phụ thuộc DSH (Owner xác nhận G6 ngày 28/10 trên #868, T-314 sửa ở PR #878).
- Như DSH, app WorkBuddy không có luật chặn theo đường dẫn; quyền chỉ có Default (lệnh chạy trong sandbox của app trước, bước rủi ro thì hỏi) và Full Access. Vì vậy ACL là lớp chặn đọc duy nhất.
- WorkBuddy bản quốc tế cho dùng DeepSeek V4.1 Flash miễn phí tới hết 31/10. Hệ số credit sau đó và cách quy đổi credit ra token chưa công bố.

##### Tài liệu cần đọc

- Các comment đề xuất và duyệt G4 / G6 của Issue này (bản CLI, rồi G6 sửa lại cho app WorkBuddy); #868 (đề xuất và duyệt G4 / G6 của DSH, xác nhận G6 bộ ACL mới)
- `docs/process/deep-review-phase-1-6.md`: bảng yêu cầu đầu "# Lượt 4", §L4.1, §L4.2, §L4.7–§L4.11, Phụ lục O, P
- `docs/decisions/0001-mo-hinh-thuc-hien-chi-claude-code.md` phụ lục M2, M10; `docs/decisions/README.md` (dòng ADR-0001)
- `docs/PROJECT-STATE.md` (dòng 28/10); `CLAUDE.md` mục "Mô hình thực hiện" (dòng lượt 4); `docs/design/phase-6-hoan-thien.md` §6
- `docs/state/review-notes.md`: hai mục [G7] của review #878; thân PR #878 (cách thử `dot2.mjs` trên cây giả)
- Tài liệu chính thức của app WorkBuddy và nguồn bên thứ ba về dữ liệu của app (link ở comment đề xuất G6 sửa lại)

##### File / thư mục được phép sửa

- `docs/process/deep-review-phase-1-6.md` (bảng yêu cầu đầu "# Lượt 4", §L4.1, §L4.2, §L4.7–§L4.11, Phụ lục O, P)
- `docs/decisions/0001-mo-hinh-thuc-hien-chi-claude-code.md` (phụ lục M10)
- `docs/decisions/README.md` (dòng ADR-0001)
- `docs/design/phase-6-hoan-thien.md` (§6)
- `docs/PROJECT-STATE.md`
- `CLAUDE.md` (dòng lượt 4 ở mục "Mô hình thực hiện")

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `76601fd`) ra 2 mục "Trùng file", đều của review #878 và đều ở file kế hoạch. **Gộp cả 2:**

- L21 [G7]: `clean` của `dot2.mjs` giữ thư mục mới có `node_modules`, cùng cache `.vite`.
- L22 [G7] NIT: `target\` có sẵn lúc ghi mốc.

##### Interface / hợp đồng

- **Bên DeepSeek:**
  - DeepSeek v4.1 Flash (bản 1017), model gắn sẵn của gói WorkBuddy Pro bản quốc tế, chạy trong app desktop WorkBuddy.
  - Chỉ đọc, không viết code; báo cáo là dữ liệu tham khảo (M2, M10).
  - Giữ nguyên: ID `DSR4-<gói><số>`, thư mục `deep-review-1-6-r4\deepseek\`, worktree `Project-2C-review`, đợt 2 chạy một mình sau 12 báo cáo đợt 1, ACL đợt 2 và `dot2.mjs`.
- **Tài khoản (G6):** Owner tự đăng nhập và đăng xuất app. Không phiên Claude nào đăng nhập, đọc, in hay lưu token.
- **Lớp chặn:** ACL của đợt 2 là lớp chặn đọc duy nhất. Chế độ quyền của app chỉ thêm, và kế hoạch ghi rõ phần model vẫn lách được.

##### Test chấp nhận

- [ ] Owner chốt các điểm ở mục 1 (ghi ngày, G4 / G6) trước khi merge.
- [ ] Phần lượt 4 không còn nói DeepSeek chạy qua DSH, DeepSeek API, key DeepSeek hay `.dsh`, trừ chỗ §L4.11 ghi lịch sử quyết định (lệnh `rg` ghi trong PR).
- [ ] Phụ lục P là cấu hình app WorkBuddy theo tài liệu chính thức (dẫn từng mục); nguồn bên thứ ba ghi rõ là bên thứ ba; ghi rõ app không có luật chặn theo đường dẫn và phần chỉ ACL chặn được.
- [ ] Phiên thử của đợt 2:
  - kiểm model bản 1017, context 1M, mức suy luận cao nhất;
  - kiểm ACL ở từng loại mục bị chặn;
  - đếm số lần app hỏi ở chế độ Default, để Owner chọn Default hay Full Access;
  - tìm log phiên có lệnh gọi công cụ; không thấy thì dừng;
  - đo credit.
- [ ] Hash 12 báo cáo của Claude / Codex trước `deny`, so lại sau `remove`.
- [ ] Kế hoạch có điểm dừng chi phí: ước credit cho 6 gói (sau gói A) vượt trần G4 thì dừng, hỏi Owner.
- [ ] §L4.10 ghi chỗ lấy log phiên của app cho từng gói, cách chép vào `deepseek\<gói>\`, và việc đăng xuất app trước khi chép.
- [ ] Hai mục [G7] của review #878 sửa; phần `clean` thử trên cây giả như PR #878.
- [ ] ADR-0001 M10, README của `docs/decisions/`, `PROJECT-STATE.md`, `CLAUDE.md` và spec Phase 6 §6 khớp.
- [ ] PR chỉ đổi tài liệu (không chạy CI).

Ước lượng: PR docs, ≈ 300–500 dòng (viết lại phần DSH của Phụ lục P và §L4.9; khối `dot2.mjs` chỉ sửa theo L21).

##### Định nghĩa hoàn thành

- [ ] Review phiên sạch: PASS (PR docs: không gọi `code-review`)
- [ ] Owner chốt G4 / G6 (ghi ngày), merge
- [ ] PR sổ sau review chuyển hai mục của review #878 sang RESOLVED

##### Rủi ro

risk:low

##### Bị chặn bởi

Không. Chờ Owner chốt G4 / G6 (nhãn `gate`).

## PR #881 — docs: run DeepSeek of round 4 in the WorkBuddy desktop app on WorkBuddy Pro (T-315)

Trạng thái: MERGED · merge 2026-10-28T14:21:31Z · commit `aaa4f57bcef9c9441f57685b4d07ff91f10fe613` · nhánh `task/T-315-codebuddy-workbuddy` · nhãn: type:task, risk:low

Closes #880

#### Thay đổi

PR này ghi quyết định Owner ngày 28/10 (lần 2): DeepSeek v4.1 Flash của lượt 4 chạy trong **app desktop WorkBuddy** của Tencent, dùng model gắn sẵn của gói **WorkBuddy Pro** bản quốc tế, thay DeepSeek Harness (DSH) và DeepSeek API.

- Owner chọn gói: "Chọn workbuddy pro". G4 / G6 duyệt lần đầu cho CodeBuddy Code CLI ([đề xuất](https://github.com/AlexH-AI/Project-2C/issues/880#issuecomment-6465442397), [duyệt](https://github.com/AlexH-AI/Project-2C/issues/880#issuecomment-6465552827)).
- Owner làm rõ cùng ngày, sau khi tự kiểm CLI: "anh làm rõ lại quyết định, sẽ là workbuddy IDE vì codebuddy CLI không chọn được đúng model và context windows". G6 duyệt lại cho app desktop WorkBuddy, chạy Default trước ([đề xuất](https://github.com/AlexH-AI/Project-2C/issues/880#issuecomment-6466485364), [duyệt](https://github.com/AlexH-AI/Project-2C/issues/880#issuecomment-6466908779)); G4 giữ.
- Commit đầu (`11cdd2b`, `4c9cc83`) là bản CLI; commit `aa6a501` chuyển sang app. Diff cuối so với `main` chỉ còn bản app. Commit `3ef33cd` và `e2eb1d3` sửa theo review CHANGES @`eb06209` (mục dưới).

**Kế hoạch lượt 4** (`docs/process/deep-review-phase-1-6.md`):
- Bảng yêu cầu đầu "# Lượt 4": dòng 28/10 trỏ T-315 #880.
- §L4.1, §L4.2: bên DeepSeek chạy trong app, mỗi gói một task. Đoạn "vì sao hai đợt": app không có luật chặn đọc theo đường dẫn, nên ACL là lớp duy nhất.
- §L4.7:
  - cách chạy: model 1017, context 1M, mức suy luận cao nhất, chọn tay cho từng task; ghi số bản app;
  - chi phí: gói Pro, trần 25 USD; ước theo giá DeepSeek API, đổi ra credit với giả định ghi rõ; số thật, ước lại sau mỗi gói;
  - chặn: chế độ quyền, hash báo cáo; prompt; log.
- §L4.8: dòng đầu báo cáo của DeepSeek ghi bản app, model, context, mức suy luận.
- §L4.9:
  - bước chuẩn bị:
    - Owner đã đăng xuất app trên máy; Claude không mở app;
    - bước 3 kiểm chưa có `target\` (review #878);
  - đợt 2:
    - bước 2: `OPENCODE_GO_KEY` không có trong biến môi trường của user;
    - bước 3: hash 12 báo cáo trước `deny`;
    - bước 4: đăng nhập app, cài đặt app, credit trước;
    - bước 5, phiên thử: model / context / mức suy luận; ACL từng loại mục; đếm số lần app hỏi để chọn Default hay Full Access; log phiên có lệnh gọi công cụ (dòng `function_call` chạy `vitest`; thiếu thì dừng); credit; ghi lại cách app vá rồi trả nguyên byte một file được theo dõi;
    - bước 6: mỗi gói một task; điểm dừng chi phí sau mỗi gói A–E;
    - bước 7: đăng xuất app trước khi chép; gỡ ACL; so hash 12 báo cáo (thiếu CSV hay không đủ 12 thì dừng);
    - bảng đánh dấu.
- §L4.10:
  - log của app (thư mục dữ liệu theo nguồn bên thứ ba; Owner chép sau khi đăng xuất; không chép file đăng nhập, memory, connector);
  - danh sách quét: thêm `.workbuddy*`, skill, connector, chế độ quyền, agent khác, công cụ web, lệnh ghi vào `…-r4\claude` / `\codex` / `\common`; lệnh ghi ngoài thư mục của bên đó trừ vá rồi trả nguyên byte và thư mục build / cache bị ignore;
  - việc của Owner.
- §L4.11: ghi lần đổi thứ 2: lời Owner, lần duyệt cho CLI, lần làm rõ, G6 duyệt lại. B1 và đề xuất 9 trỏ sang đó; đoạn DSH ghi là lịch sử.
- Phụ lục O: app thay DSH. Quy tắc riêng 4 cấm: giao việc cho agent khác, skill, connector, web, mạng ra ngoài máy, đổi chế độ quyền, đọc / sửa `~/.workbuddy*`. Mục **Ghi** của quy tắc này: file tự tạo chỉ ở `…-r4\deepseek\`; ngoài đó chỉ có thư mục build / cache bị ignore và thư mục tạm do công cụ tự ghi, file app tự tạo mà `baseline.md` ghi (quy tắc riêng 5), phần vá rồi trả nguyên byte theo quy tắc chung 1; không ghi vào `…-r4\common\`, `\claude\`, `\codex\`.
- Phụ lục P viết lại thành cấu hình app WorkBuddy:
  - tài liệu chính thức nói gì; dữ liệu cục bộ theo nguồn bên thứ ba, gồm loại bản ghi của file phiên (docstring `transcript.py` của `workbuddy-chat-exporter`, commit `b1b14b4`);
  - ranh giới tài khoản; gói và chi phí;
  - bảng cài đặt app kèm nguồn; chế độ quyền; hash 12 báo cáo;
  - bảng đối chiếu luật cũ sang lớp chặn mới;
  - rủi ro và chỗ còn hở với app.

  Bộ ACL đợt 2 và `dot2.mjs` giữ; script chỉ sửa `clean` (review #878).

**Ghi quyết định:**
- ADR-0001 phụ lục M10: DeepSeek trong app desktop WorkBuddy trên gói WorkBuddy Pro (lần chọn, lần làm rõ, G4 / G6 trên #880); tiêu đề thêm #880.
- `docs/decisions/README.md`, dòng ADR-0001.
- `docs/PROJECT-STATE.md`: dòng 2026-10-28 thứ hai; dòng "Appendix P" của mục DSH ghi là đã thay.
- `CLAUDE.md`, dòng lượt 4.
- Spec Phase 6: hàng DeepSeek ở §6.1, đoạn lượt 4 ở §6.3, câu M10 ở §6.5.

#### Sửa theo review @`eb06209` (vòng 1, commit `3ef33cd`, `e2eb1d3`)

Review CHANGES ngày 28/10: 2 mục chặn, 3 mục không chặn. Sửa cả năm, vì B2 đòi sổ OPEN rỗng trước lượt 4.

- **[chặn] Log của phiên thử** (§L4.9 đợt 2 bước 5). `Select-String 'vitest'` ra `True` cả khi file chỉ có tin nhắn. Lệnh mới đọc từng dòng JSON, và chỉ tính lệnh gọi công cụ có `vitest` trong đầu vào. Đó là dòng có `type` là `function_call`, hoặc một phần `tool_use` / `function_call` trong nội dung. Lệnh chỉ xét `arguments` / `input` của bản ghi đó.
  - Nguồn của dạng `function_call`: docstring của `transcript.py` trong `workbuddy-chat-exporter`, nguồn bên thứ ba mà Phụ lục P đã dẫn. Bản ở commit `b1b14b4` (25/10) ghi `function_call` là lệnh gọi công cụ, có `name` và `arguments` dạng chuỗi JSON. Đã đọc bản gốc qua `gh api`.
  - Tin nhắn của Owner, lời đáp, phần suy luận và kết quả lệnh có chữ `vitest` không tính.
  - Lệnh in mỗi dòng có `vitest` (số dòng, `type`, `role`, `name`, dấu `<- tool call`) và dòng `types:` để ghi vào `baseline.md`.
  - `Get-ChildItem -Depth 1`: file `.jsonl` trong `tool-results\` không bị lấy làm file phiên.
  - Vẫn dừng khi dòng cuối là `False`, khi lỗi đọc JSON, khi không thấy thư mục hay file.
  - Phụ lục P, mục dữ liệu cục bộ, ghi loại bản ghi của file phiên.
- **[chặn] So hash 12 báo cáo** (§L4.9 đợt 2 bước 7.5). Lệnh mới theo hướng (a) của review, bọc trong `& { $ErrorActionPreference = 'Stop'; … }`.
  - `$old`, `$new` bọc `@(…)`. CSV hay thư mục không đủ 12 báo cáo → `throw` kèm hai số; lỗi nào trong khối cũng dừng.
  - `Stop` chỉ áp trong khối, không đổi cửa sổ PowerShell của Owner. `$old` còn lại từ lần chạy trước trong cùng cửa sổ cũng không lọt qua.
- **[không chặn] Điểm dừng chi phí** (§L4.9 đợt 2 bước 6; §L4.7; Phụ lục P): tính sau mỗi gói A–E, không chỉ sau gói A, vì gói chạy lúc DeepSeek còn miễn phí (tới hết 31/10) tốn 0 credit. Công thức: credit của gói tốn nhiều nhất tới lúc đó × số gói còn lại > credit còn lại (+ 500 nếu chưa mua gói thêm) → dừng, hỏi Owner. Đã mua gói thêm thì không cộng 500 nữa, để không vượt trần 25 USD. Chặt hơn lần duyệt G4 ("sau gói A"), không bỏ điều gì của lần duyệt; M10 và §L4.11 giữ nguyên câu chữ của lần duyệt.
- **[không chặn] Phụ lục O quy tắc riêng 4:** bỏ câu "Không ghi gì ngoài thư mục `…-r4\deepseek\`", thay bằng mục **Ghi**.
  - File tự tạo chỉ ở `deepseek\`.
  - Ngoài đó chỉ có:
    - những gì build / test / trình duyệt tự ghi (thư mục build / cache bị ignore trong worktree, thư mục tạm);
    - file app tự tạo mà `baseline.md` ghi (quy tắc riêng 5);
    - phần vá rồi trả nguyên byte theo quy tắc chung 1.

    Như vậy khớp phần chung "áp dụng đầy đủ", quy tắc riêng 5, phiên thử (`pnpm build:web` trong worktree) và §L4.10.
  - Cấm ghi vào `…-r4\common\` (giữ `dot2-reports-hash.csv`, `dot2-acl.json`), `\claude\`, `\codex\`.
  - §L4.10: dòng quét "lệnh ghi ngoài thư mục" thêm thư mục build / cache bị ignore; dòng DeepSeek ghi vào `…-r4\claude` / `\codex` thêm `\common`.
  - Phụ lục P, bảng đối chiếu: hàng `edit` ghi rõ luật cũ nay nới ra.
  - Phiên thử, mục "chỉ ghi lại": bảo model vá `README.md` bằng công cụ sửa file của app rồi trả nguyên byte, ghi `git status --short` và bản sao lưu app để lại (app sao lưu file trước khi sửa). Vì vá nay được phép, phiên thử thấy trước điều gói A sẽ gặp.
- **[không chặn] NIT, lệnh `rg`:** thêm vào mục Kiểm tra.

#### Test chấp nhận

- [x] Owner chốt các điểm (28/10, G4 / G6): các comment duyệt trên #880.
- [x] Phần lượt 4 không còn nói DeepSeek chạy qua DSH, DeepSeek API, key DeepSeek hay `.dsh`, trừ §L4.11 (lịch sử). Lệnh `rg` và kết quả ở mục Kiểm tra. Ngoài §L4.11 còn ba chỗ có chữ đó, không phải cách chạy:
  - §L4.7 lấy giá DeepSeek API làm mốc ước credit;
  - Phụ lục P nêu DSH là bản trước đã bỏ;
  - Phụ lục P so app với DSH ở mục "Còn hở".
- [x] Phụ lục P là cấu hình app WorkBuddy theo tài liệu chính thức, có cột nguồn; nguồn bên thứ ba ghi rõ; ghi rõ app không có luật chặn theo đường dẫn ("Vì vậy…", bảng đối chiếu, "Còn hở với app WorkBuddy").
- [x] Phiên thử (§L4.9 đợt 2 bước 5):
  - model 1017, context 1M, mức suy luận cao nhất;
  - ACL từng loại mục, bằng shell và bằng công cụ đọc file;
  - đếm số lần app hỏi để chọn chế độ quyền;
  - log có lệnh gọi công cụ: chỉ dòng `function_call` (hay phần `tool_use`) có `vitest` trong đầu vào mới tính; thiếu thì dừng;
  - credit.
- [x] Hash 12 báo cáo: đợt 2 bước 3 và 7.5; bước 7.5 dừng khi thiếu CSV hay không đủ 12 báo cáo.
- [x] Điểm dừng chi phí: sau mỗi gói A–E, gồm sau gói A. Credit của gói tốn nhiều nhất × số gói còn lại vượt credit còn lại (+ 500 nếu chưa mua gói thêm) thì dừng, hỏi Owner.
- [x] §L4.10: chỗ lấy log của app cho từng gói (file ghi ở bảng đánh dấu); chép vào `deepseek\<gói>\session\`; đăng xuất app trước khi chép.
- [x] Hai mục [G7] của review #878 sửa; `clean` thử trên cây giả (mục Kiểm tra).
- [x] ADR-0001 M10, README `docs/decisions/`, `PROJECT-STATE.md`, `CLAUDE.md`, spec Phase 6 §6 khớp.
- [x] PR chỉ đổi tài liệu, không chạy CI.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `76601fd`; chạy lại ở `e2eb1d3`, như cũ): 2 mục "Trùng file".
- L21 [G7] `clean` của `dot2.mjs` giữ thư mục mới có `node_modules`, cùng cache `.vite`: **đã sửa**. `leftovers(wt, held)` ghi thư mục được giữ vì có `node_modules` riêng. `clean` in `kept, holds node_modules: …` cho mỗi thư mục đó, và xóa `node_modules\.vite`, `.vite-temp` trong đó (vẫn trong phạm vi "cache Vite / Vitest" đã duyệt). §L4.9 đợt 2 bước 1 và mục "Script đợt 2" ghi theo.
- L22 [G7] NIT `target\` có sẵn lúc ghi mốc: **đã sửa**. Bước chuẩn bị 3 kiểm `apps\desktop\src-tauri\target\` chưa có ở hai worktree, có thì dừng, hỏi Owner. Đợt 2 bước 1 ghi `target\` do bước 6 sinh ra bị xóa cả.

#### Kiểm tra

- **Chữ DSH / DeepSeek API trong kế hoạch** (test chấp nhận thứ 2), ở `e2eb1d3`:

  ```
  rg -n -i "DSH|DeepSeek API|key DeepSeek|DeepSeek Harness|\.dsh" docs/process/deep-review-phase-1-6.md
  ```

  Máy làm (Home PC `DESKTOP-KDURKJP`) không có `rg` trên PATH. Lệnh chạy bằng ripgrep của Claude Code (công cụ Grep), và lệnh tương đương dưới chạy ở PowerShell cho cùng 12 dòng:

  ```
  git grep -n -i -E "DSH|DeepSeek API|key DeepSeek|DeepSeek Harness|\.dsh" -- docs/process/deep-review-phase-1-6.md
  ```

  - Phần lượt 4 bắt đầu ở dòng 1555 ("# Lượt 4"); §L4.11 là dòng 2298–2365. Không dòng nào khớp trước dòng 1555.
  - 9 dòng nằm trong §L4.11: 2309, 2322, 2326, 2328, 2329, 2331, 2339, 2350, 2351.
  - 3 dòng ngoài §L4.11:
    - 1983, §L4.7: giá DeepSeek API làm mốc ước;
    - 2602, Phụ lục P: DSH là bản trước đã bỏ;
    - 3053, Phụ lục P "Còn hở": so với DSH.
  - `git grep -n "CodeBuddy"` ra 5 dòng: 2344, 2348, 2351 (§L4.11), 2602 (Phụ lục P, bản CLI đã bỏ), 2635 (credit ngày "trong app WorkBuddy hoặc CodeBuddy").
- **Lệnh PowerShell của đợt 2 bước 3, 5, 7.5**, Home PC `DESKTOP-KDURKJP` ngày 28/10:
  - Cách thử: harness bằng `node` lấy nguyên văn từng lệnh từ file kế hoạch, chỉ thay `C:\workspace\deep-review-1-6-r4` bằng cây giả trong `%TEMP%`. `USERPROFILE` giả có dấu cách. Mỗi ca chạy trong một tiến trình mới, ở PowerShell 7.6.6 và Windows PowerShell 5.1.26100.
  - Bản 5.1 chạy với `PSModulePath` mặc định của nó. Gọi từ pwsh mà giữ biến của pwsh thì 5.1 không thấy `Get-FileHash`.
  - **Hash, 8 ca × 2 bản:**
    - không đổi → `OK`; CSV ghi bằng bản này, so bằng bản kia → `OK`;
    - sửa một file → dừng: "đã đổi";
    - xóa một file → dừng `12 / 11`; xóa cả 12 → dừng `12 / 0`; thêm file thứ 13 → dừng `12 / 13`;
    - xóa CSV → dừng ở lỗi `Import-Csv`, cả khi `$old` còn từ lần chạy trước trong cùng cửa sổ.
  - **Log, 12 ca × 2 bản.** File phiên giả theo định dạng của `transcript.py`, và theo dạng giống Claude Code mà review dùng để tái hiện.
    - Ra `False`:
      - chỉ tin nhắn (ca review tái hiện, cả hai dạng);
      - tin nhắn + suy luận + kết quả lệnh có `vitest`;
      - chỉ có lệnh gọi công cụ khác;
      - file phiên mới nhất không có lệnh gọi, file cũ hơn có.
    - Ra `True`:
      - `function_call` chạy `vitest` (đường dẫn `/` hay `\`);
      - phần `tool_use` dạng Claude Code;
      - `.jsonl` mới hơn trong `tool-results\` không bị lấy làm file phiên;
      - thư mục `.workbuddy`.
    - Lỗi, không in `True` / `False`: một dòng không phải JSON; không có thư mục dữ liệu.
  - Kết quả: bản `3ef33cd` và `e2eb1d3` đạt 40 / 40. Bản `eb06209` đạt 22 / 40: hash in `OK` khi mất cả 12 báo cáo, mất CSV hay `$old` cũ; log ra `True` ở 5 ca `False` và ở ca dòng không phải JSON. Đúng như review tả.
  - Ví dụ ra của lệnh log, file phiên có lệnh gọi công cụ:

    ```
    …\home dir\.workbuddy-ai\projects\c-workspace-Project-2C-review\s1.jsonl
    line 1: type=message, role=user
    line 2: type=reasoning
    line 3: type=function_call, name=Bash  <- tool call
    line 4: type=function_call_result
    line 5: type=message, role=assistant
    types: message, reasoning, function_call, function_call_result
    True
    ```

  - Chưa chạy trên máy có app và báo cáo thật. Phiên thử và đợt 2 chạy chúng. Định dạng file phiên theo nguồn bên thứ ba: phiên thử kiểm, khác thì dòng cuối `False` và đợt 2 dừng.
- `dot2.mjs clean`, cây giả trên Office Laptop `D13_THINKPAD` ngày 28/10 (chạy lại trên bản `eb06209`; vòng sửa này không đổi khối `js`):
  - Dựng như PR #878: hai worktree git trong `%TEMP%`, đường dẫn có dấu cách; `TEMP`, `USERPROFILE`, `APPDATA`, `LOCALAPPDATA` giả; script lấy nguyên văn từ khối `js` của kế hoạch.
  - Đợt 1 giả để lại:
    - `probe4\`: `b.mjs`, `package.json`, `node_modules\somepkg`, `node_modules\.vite`, `.vite-temp`;
    - `probe5\c.mjs`; `probe6\top.mjs` cùng `probe6\sub\node_modules\.vite`;
    - cache `.vite` ở `packages\domain`; file mới trong `test-results\` có sẵn lúc ghi mốc; cache Playwright trong `TEMP` giả.
  - Bản `main` `76601fd`: 9 / 14 kiểm tra đạt. Giữ cache `.vite` / `.vite-temp` của `probe4` và `probe6\sub`, không in dòng nào về hai thư mục đó, vẫn in `OK`, đúng như review #878 tả.
  - Bản này đạt 14 / 14:
    - in `kept, holds node_modules` cho `probe4\` và `probe6\sub\` (không in cho `probe6\`), xóa cache của hai thư mục đó;
    - giữ `node_modules\somepkg`, `node_modules` gốc, file được theo dõi, `test-results\old.txt`; in `OK`;
    - mục khác như bản trước: file mới trong `test-results\`, `probe5\`, cache `packages\domain`, cache trong `TEMP` giả đều bị xóa.
- `pnpm verify`: không chạy. PR chỉ đổi file `.md`; không test nào đọc các file này.
- [x] Không thêm dependency của repo. App WorkBuddy và gói WorkBuddy Pro là công cụ / dịch vụ trả phí cho lượt 4, đã qua G4 trên #880.
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

**Gửi phiên review:** khối `js` ở Phụ lục P (mục "Script đợt 2") là code chạy thật: Owner chạy nó ở đợt 2, và nó đổi ACL trong hồ sơ user của Owner. PR này chỉ sửa `leftovers` và `clean`. Các lệnh PowerShell ở §L4.9 đợt 2 bước 3, 5, 7.5 cũng chạy thật; vòng sửa này đổi lệnh của bước 5 (log) và 7.5 (so hash). PR chỉ đổi file `.md` nên `review-pr` không gọi `code-review`; xin đọc các phần này như code.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-315 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #878 — T-315 (#880, PR #881, `REVIEW: PASS` @`e2eb1d3`):
  - #878, `docs/process/deep-review-phase-1-6.md` (`leftovers` / `clean` của `dot2.mjs`, Phụ lục P; §L4.9 đợt 2 bước 1): `leftovers(wt, held)` ghi mỗi thư mục được giữ vì có `node_modules` con. `clean` in `kept, holds node_modules: <đường dẫn>` cho mỗi thư mục đó, và xóa cả `node_modules\.vite`, `.vite-temp` trong đó (vẫn trong phạm vi "cache Vite / Vitest" đã duyệt). Review #881 thử trên cây giả, khối `js` chép nguyên văn: `probe4\` và `probe6\sub\` có dòng `kept` (`probe6\` thì không), cache của hai thư mục đó bị xóa, gói trong `node_modules` còn, lệnh in `OK` (15 / 15 kiểm tra). Dòng `kept` in cả cho thư mục đã có lúc ghi mốc: ghi chú mới của review #881, ở OPEN.
  - #878 NIT, `docs/process/deep-review-phase-1-6.md` (§L4.9 bước chuẩn bị 3, đợt 2 bước 1): bước chuẩn bị 3 kiểm `apps\desktop\src-tauri\target\` chưa có ở cả hai worktree, có thì dừng, hỏi Owner. Đợt 2 bước 1 ghi `target\` do bước chuẩn bị 6 sinh ra là mục mới nên bị xóa cả. `apps/desktop/src-tauri/target/` bị ignore (`.gitignore:31`) và là chỗ `tauri build` ghi.

---

# Issue #884 — T-316: Mục sổ trước lượt 4: rightOfSidebar không phụ thuộc độ cuộn; Memory sau phiên thử, ACL ở Full Access, dòng kept của dot2.mjs

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sổ ghi chú review không còn mục nào, để lượt 4 deep review ghim được SHA. Theo B2, lượt 4 chỉ chạy khi mục OPEN của sổ rỗng.

Bốn mục OPEN ở `main` `ed020b5` sửa trong một PR nhỏ. Owner 28/10 quyết gộp ba mục của review #881 vào T-316, như T-314 đã gộp ca e2e với chữ của kế hoạch.

1. **`rightOfSidebar` của bộ chụp ảnh hướng dẫn** (review #882): hàm đo `main` bằng `boundingBox()`, tức tọa độ theo cửa sổ, trước khi `shot()` cuộn về đầu trang (`window.scrollTo(0, 0)`).
   - **Chỗ hỏng:** khi không truyền `height`, clip cao `main.y + main.height`. Nếu trang đang cuộn `s` px thì `main.y` nhỏ đi `s`; sau khi `shot()` cuộn về đầu, ảnh hụt `s` px ở chân.
   - **Hiện không ảnh nào sai:** lần gọi không có `height` (ảnh 04-khach-hang) chạy ngay sau `page.goto`, lúc trang chưa cuộn; lần gọi cho ảnh 05-ho-so-kh truyền 600, nên chỉ dùng `x` / `width`.
   - **Bẫy là cho lần gọi sau:** màn mở bằng click giữ độ cuộn của màn trước, như comment của `shot` ghi.
   - **Sửa:** clip không phụ thuộc độ cuộn lúc đo. Ví dụ cuộn về đầu ngay trong hàm trước khi đo, hoặc cộng `window.scrollY` vào tọa độ đo.
2. **Kế hoạch lượt 4: ba ghi chú của review #881** (DeepSeek chạy trong app WorkBuddy):
   - **Memory sau phiên thử:**
     - Memory của app chỉ được dọn một lần, ở đợt 2 bước 4, trước phiên thử.
     - Phiên thử đưa vào hội thoại nhiều thứ: nội dung file ACL, các lần đọc thử mục bị chặn, yêu cầu tìm web, giao việc cho agent khác, vá `README.md`.
     - Memory không tắt được và tự trích ngữ cảnh từ hội thoại, nên những thứ đó có thể theo vào gói A–F.
     - Phiên thử dừng vì một lần đọc lọt ACL thì kế hoạch chỉ ghi "Sửa theo rồi thử lại", không bảo dọn Memory trước lần chạy lại hay trước gói A.
   - **ACL ở Full Access:**
     - Mọi lần đọc thử mục bị chặn đều chạy ở chế độ Default. Ở Default, lệnh chạy trong sandbox của app trước, nên một lần "bị từ chối" có thể do sandbox chứ không do ACL.
     - Owner chọn Full Access thì gói A–F chạy không sandbox. Khi đó ACL là lớp chặn đọc duy nhất, mà chưa lần nào được thử ở chế độ này.
   - **NIT, dòng `kept` của bước dọn:** `clean` in `kept, holds node_modules` và xóa cache Vite của cả thư mục đã có lúc ghi mốc. Kế hoạch thì ghi "mỗi thư mục mới". Không gây hại, chỉ cần sửa chữ.

##### Bối cảnh

- **Mục 1:** review PR #882 (T-312, `REVIEW: PASS` @`70bd402`, mức low) ghi mục này ở trục Correctness, không chặn. PR sổ #883 ghi vào OPEN, PR sổ #885 gắn nhãn T-316.
- **Mục 2:** review PR #881 (T-315, `REVIEW: PASS` @`e2eb1d3`, mức low) ghi ba ghi chú không chặn. PR sổ #886 ghi vào OPEN, gắn [G7]. Owner 28/10: gộp vào T-316; PR sổ gắn lại nhãn.
- **Kế hoạch lượt 4:** T-309 (#854), Owner duyệt G1 28/10. Theo B2 (§L4.11 mục 8), ghi chú không chặn mà review các PR trước lượt 4 ghi thêm cũng sửa trước khi ghim SHA.
- **App WorkBuddy:** Owner duyệt G4 / G6 ngày 28/10 trên #880. Chế độ quyền theo G6 là "Duyệt, Default trước"; Full Access đã duyệt trước, chỉ dùng khi app hỏi duyệt ở hầu hết lệnh thường. Phiên Claude không mở app và không chạm token; mọi bước trong app là việc của Owner.
- **Bộ chụp ảnh hướng dẫn** chạy tay, không chạy trong CI. Ảnh chụp ở T-312 là ảnh trước lượt 4. Issue này không được làm đổi ảnh nào.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`, mục OPEN: nhóm review #882 và nhóm review #881 (`node tools/notes-for.mjs <issue>`).
- Comment review PR #882, mục Correctness: https://github.com/AlexH-AI/Project-2C/pull/882#issuecomment-6470292670
- Comment review PR #881 (`REVIEW: PASS` @`e2eb1d3`): cách tái hiện dòng `kept` trên cây giả. https://github.com/AlexH-AI/Project-2C/pull/881#issuecomment-6471500006
- `e2e/guide/shots.guide.ts`: `shot` (`:21–38`), `rightOfSidebar` (`:45–50`), hai chỗ gọi (`:146` ảnh 04-khach-hang, `:158` ảnh 05-ho-so-kh).
- `playwright.guide.config.ts`: lệnh chạy, cổng 4174, khung 1 440 × 900.
- Thân PR #882: cách chụp (Home PC `DESKTOP-KDURKJP`, chạy hai lần liền trùng từng byte).
- `docs/process/deep-review-phase-1-6.md` (số dòng theo `main` `ed020b5`):
  - §L4.9 đợt 2: bước 1 (`:2101`, dòng `kept`), bước 4 (`:2143`, Memory), bước 5 (`:2147` "Sửa theo rồi thử lại", `:2152–2157` các lần đọc thử, `:2174` "Chế độ quyền", `:2181` dòng Memory của nhóm "Chỉ ghi lại"), bước 6;
  - Phụ lục P: `:2623` (sandbox), bảng ranh giới tài khoản (`:2647`, Memory), đoạn "Chế độ quyền" (`:2651–2656`), mục "Script đợt 2" (`:2680–2706`, mô tả `clean` và các lần thử) cùng khối `js` (`leftovers` / `clean`, `:2770–2830`), hai mục "Còn hở" (`:3045–3057`);
  - §L4.11: quyết định G6 về chế độ quyền.
- Comment G4 / G6 ngày 28/10 trên #880: phạm vi Owner đã duyệt cho app WorkBuddy.

##### File / thư mục được phép sửa

- `e2e/guide/shots.guide.ts` (chỉ `rightOfSidebar` và comment / JSDoc của nó)
- `docs/process/deep-review-phase-1-6.md` (§L4.9 đợt 2 bước 1, 4, 5, 6; Phụ lục P: bảng ranh giới tài khoản, "Chế độ quyền", phần chữ của mục "Script đợt 2", hai mục "Còn hở"; không sửa khối `js`)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` với hai đường dẫn trên (sổ @ `ed020b5`) ra 4 mục "Trùng file":

- L13 [T-316 #884], review #882: `rightOfSidebar` đo `main` trước khi cuộn về đầu trang.
- L15 [G7], review #881: Memory chỉ được dọn trước phiên thử.
- L16 [G7], review #881: nhánh Full Access chưa được kiểm ACL.
- L17 [G7] NIT, review #881: dòng `kept` in cả cho thư mục đã có lúc ghi mốc.

**Gộp cả 4**, vì đây chính là việc của Issue. Không để lại mục nào. PR sổ gắn nhãn sẽ đổi ba mục [G7] thành [T-316 #884].

##### Interface / hợp đồng

- `rightOfSidebar(page, height?)` giữ nguyên chữ ký. Khi trang chưa cuộn, kết quả không đổi, nên hai chỗ gọi giữ nguyên.
- Không đổi ảnh: chụp lại thì cả 28 ảnh trùng từng byte với `main`.
- Khối `js` của `dot2.mjs` (Phụ lục P) không đổi, vì Owner đã xác nhận G6 cho script này. Mục L17 chỉ sửa chữ của kế hoạch cho khớp hành vi của script.
- Những gì G6 ngày 28/10 đã duyệt giữ nguyên: bộ ACL, phạm vi dọn, và quyết định chế độ quyền ("Duyệt, Default trước").
  - Bước mới chỉ là việc kiểm hay việc dọn của Owner trong app: xóa mục Memory, mở một task Full Access để đọc thử.
  - Cách sửa nào làm đổi những mục G6 ở trên thì hỏi Owner trước và ghi ngày.
- Không đổi code app, không thêm test vào CI.

##### Test chấp nhận

**`rightOfSidebar`**

- [ ] Clip của `rightOfSidebar` không phụ thuộc độ cuộn lúc gọi.
  - Cách kiểm: chọn một màn cao hơn cửa sổ (vd. Hồ sơ KH). Gọi hàm hai lần, một lần khi trang ở đầu, một lần sau `window.scrollTo(0, 300)`, bằng một đoạn thử tạm, không commit. Hai lần phải cho cùng một clip, cả khi có lẫn khi không có `height`.
  - Thân PR ghi cách thử và kết quả, kể cả kết quả của bản trước khi sửa: clip lệch khi không có `height`.
- [ ] `pnpm exec playwright test -c playwright.guide.config.ts` xanh (13 passed). Sau khi chạy, `git status` sạch, tức 28 ảnh trùng từng byte với `main`. Chụp trên Home PC, máy đã chụp ảnh của T-312; chụp máy khác thì thân PR ghi tên máy và ảnh nào lệch.

**Kế hoạch lượt 4**

- [ ] Memory được dọn ngay trước gói A, sau mọi task thử:
  - kế hoạch có bước Owner xóa mọi mục Memory mới so với lúc dọn ở bước 4, ngay trước khi mở gói A;
  - "mọi task thử" gồm phiên thử, mỗi lần chạy lại nó, và task kiểm ACL ở Full Access nếu có;
  - Owner ghi việc dọn vào `baseline.md`;
  - "Sửa theo rồi thử lại" của bước 5 nói dọn Memory trước lần chạy lại;
  - dòng Memory của nhóm "Chỉ ghi lại" và dòng Memory của bảng ranh giới tài khoản (Phụ lục P) khớp với bước mới.
- [ ] Owner chọn Full Access thì có kiểm ACL ở chính chế độ đó trước gói A:
  - mở một task Full Access, đọc lại mỗi loại mục bị chặn, một lần bằng shell và một lần bằng công cụ đọc file, như phiên thử;
  - ra khác "bị từ chối" thì dừng đợt 2.
- [ ] Phiên thử ở Default ghi thông báo lỗi của mỗi lần bị từ chối, để phân biệt lỗi ACL (`Access is denied` / `EPERM`) với chặn của sandbox. Đoạn "Chế độ quyền" của Phụ lục P và câu "phiên thử bắt được" ở mục "Còn hở" khớp với bước mới.
- [ ] Dòng `kept, holds node_modules` ở bước 1 nói đúng hành vi: lệnh in dòng này cho mọi thư mục chưa theo dõi hay bị ignore có `node_modules` con, kể cả thư mục đã có lúc ghi mốc. Phần chữ của mục "Script đợt 2" cũng không còn chữ "mới" lệch như vậy.
- [ ] Khối `js` của Phụ lục P trùng từng byte với `main` (`git diff` không có dòng nào trong khối), và trích ra vẫn qua được `node --check`.

**Chung**

- [ ] `pnpm verify` xanh.

Ước lượng: ≈ 5–15 dòng ở `rightOfSidebar`, ≈ 15–30 dòng chữ của kế hoạch.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (PR chạm e2e nên chạy Verify + e2e)
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển 4 mục [T-316] sang RESOLVED. Mục OPEN của sổ chỉ còn ghi chú mới của review T-316 (nếu có).

##### Rủi ro

risk:low

##### Bị chặn bởi

Không.

## PR #888 — fix: the last review notes before round 4: guide clip, Memory, Full Access ACL (T-316)

Trạng thái: MERGED · merge 2026-10-28T15:59:18Z · commit `8006780a53e8ace683b0fe9019f00a7deecc480a` · nhánh `task/T-316-pre-round-4-notes` · nhãn: risk:low

Closes #884

#### Thay đổi

Sửa cả bốn mục [T-316] của sổ (L13, L15, L16, L17) để mục OPEN rỗng trước khi ghim SHA lượt 4 (B2). App không đổi, không thêm test vào CI. Chụp trên Home PC (`DESKTOP-KDURKJP`), máy đã chụp ảnh của T-312.

1. **`rightOfSidebar` (L13, review #882), `e2e/guide/shots.guide.ts`:** hàm cuộn về đầu trang (`window.scrollTo(0, 0)`, như `shot()`) rồi mới đo `main`.
   - Cách sửa này đo trang đúng ở trạng thái `shot()` chụp. Repo không có `scroll-behavior` ở đâu (đã tìm cả repo, trừ `node_modules`), nên lệnh cuộn xong ngay, phép đo sau đó không rơi vào lúc trang đang cuộn.
   - Chữ ký giữ nguyên. Trang chưa cuộn thì lệnh cuộn không làm gì, nên hai chỗ gọi (ảnh 04-khach-hang, 05-ho-so-kh) giữ nguyên.
   - Comment ngay trên lệnh cuộn ghi lý do: `boundingBox()` tính theo cửa sổ, và màn mở bằng click giữ độ cuộn của màn trước.
2. **Kế hoạch lượt 4 (L15, L16, L17, review #881), `docs/process/deep-review-phase-1-6.md`.** Số dòng theo head:
   - **Memory (L15):**
     - bước 4 (`:2143`): ghi số mục Memory còn lại sau khi dọn, và trỏ tới bước dọn trước gói A;
     - bước 5 (`:2147`): "Sửa theo, dọn Memory như đoạn "Xong" dưới, rồi thử lại ở một task mới";
     - "Chỉ ghi lại" (`:2182`): ghi số mục mới, không chép nội dung;
     - đoạn "Xong" của bước 5 (`:2189–2191`): áp cho mọi task thử (phiên thử, mỗi lần chạy lại, task kiểm ACL ở Full Access nếu có). Thêm bước **dọn Memory, ngay trước khi mở gói A**: xóa mọi mục mới so với lúc dọn ở bước 4, ghi số mục đã xóa vào `baseline.md`;
     - Phụ lục P, dòng Memory của bảng "Cài đặt app" (`:2650`).
   - **ACL ở Full Access (L16):**
     - bước 5, việc đọc thử mục bị chặn (`:2152`): ghi thông báo lỗi của mỗi lần. Lỗi của ACL là lỗi quyền của Windows (vd. `Access is denied`, `EPERM`); thông báo khác (vd. của sandbox) thì lần đó chưa cho biết ACL có chặn không;
     - bước 5, mục mới **Kiểm ACL ở Full Access** (`:2175`, chỉ khi Owner chọn Full Access): một task mới như phiên thử, chỉ đổi chế độ quyền. Model đọc `common\dot2-acl.json` rồi làm lại đúng các việc đọc thử mục bị chặn, một lần bằng shell, một lần bằng công cụ đọc file → mọi lần bị từ chối. Ra khác "bị từ chối" thì dừng đợt 2, báo Claude. Task này mở sau khi đã chạy lệnh **Log của app** của phiên thử. Lệnh đó lấy file `.jsonl` mới nhất, nên mở trước thì nó đọc phải file của task Full Access (không có lệnh `vitest`), in `False` và đợt 2 dừng nhầm (commit `5abf467`);
     - Phụ lục P, "Chế độ quyền" (`:2656–2657`); "Còn hở sau review #872", câu "phiên thử bắt được" (`:3053`); "Còn hở với app WorkBuddy", dòng Full Access và dòng Memory (`:3057–3058`).
   - **Dòng `kept` (L17, NIT):** bước 1 (`:2101`, `:2104`) và mục "Script đợt 2" (`:2688`). Lệnh in `kept, holds node_modules` cho mọi thư mục chưa theo dõi hay bị ignore có `node_modules` con, kể cả thư mục đã có lúc ghi mốc. Review #881 đã tái hiện hành vi này trên cây giả (`dist\oldtool\` có từ trước mốc). Chữ khớp `leftovers` (`held?.add(rel)` cho mọi thư mục nó đi qua mà có con tên `node_modules`, không so với mốc) và `clean` (in mọi phần tử của `held`, xóa cache `.vite` / `.vite-temp` của cả `held`).

**Thêm ngoài chữ của Issue.** Đây là việc ghi chép của Owner, không đổi mục G6 nào:
- Memory chỉ ghi **số mục**, không chép nội dung vào `baseline.md`: các gói của DeepSeek đọc file này (Phụ lục O: SHA / status, bản app, file app tự tạo). Chép nội dung thì việc dọn mất tác dụng.
- Bước 4 ghi số mục còn lại, làm mốc cho "mục mới so với lúc dọn ở bước 4".
- Phiên thử chạy lại ở **một task mới**: task cũ còn giữ hội thoại của lần hỏng.
- **Credit sau phiên thử** ghi sau cả task kiểm ACL ở Full Access. Nếu không, chi phí của task đó tính vào gói A ở điểm dừng chi phí.
- Issue gọi `:2647` (nay `:2650`) là "bảng ranh giới tài khoản". Đó là dòng Memory của bảng "Cài đặt app". Danh sách "Ranh giới tài khoản" (`:2628–2634`) không có dòng Memory nên không đổi.
- Hai dòng của mục "Còn hở với app WorkBuddy" thêm việc kiểm / dọn mới. Rủi ro Owner đã chấp nhận giữ nguyên.

**Không đổi:**
- bộ ACL, phạm vi dọn, quyết định chế độ quyền ("Duyệt, Default trước");
- khối `js` của `dot2.mjs`;
- ở Default, lần bị từ chối mà thông báo trông như của sandbox thì chỉ ghi lại, không thêm điều kiện dừng: thêm thì đổi quyết định G6. Chỉ task kiểm ACL ở Full Access có điều kiện "ra khác bị từ chối thì dừng", đúng như Issue.

Cỡ (`git diff --numstat`): `docs/process/deep-review-phase-1-6.md` +18 / −15, `e2e/guide/shots.guide.ts` +3 / −0. Không đụng file cần nhãn `build-exe`.

#### Test chấp nhận

**`rightOfSidebar`**

- [x] Clip không phụ thuộc độ cuộn lúc gọi. Cách thử: một test tạm cuối `shots.guide.ts`, không commit, chạy bằng `pnpm exec playwright test -c playwright.guide.config.ts --project shots -g "tmp probe T316"`.
  - Test mở Hồ sơ KH bằng `openProfile` (trang cao 3 424 px theo `scrollHeight`, mở ra ở `scrollY` 0).
  - Với mỗi độ cuộn 0 và 300, nó gọi `scrollTo`, đọc lại `window.scrollY` (300 thật), rồi gọi `rightOfSidebar(page)` và `rightOfSidebar(page, 600)`.

  | Lần gọi | Trước khi sửa | Sau khi sửa |
  |---|---|---|
  | không `height`, cuộn 0 | x 232, y 0, rộng 1 208, cao 3 423,75 | x 232, y 0, rộng 1 208, cao 3 423,75 |
  | không `height`, cuộn 300 | x 232, y 0, rộng 1 208, **cao 3 123,75** (hụt đúng 300) | x 232, y 0, rộng 1 208, cao 3 423,75 |
  | `height` 600, cuộn 0 và 300 | x 232, y 0, rộng 1 208, cao 600 (trùng nhau) | như trước |

  Trước khi sửa test đỏ ở phép so không có `height`; sau khi sửa thì xanh. Số đo là clip hàm trả về, không đo ảnh. Gỡ test tạm trước lần chạy dưới.
- [x] `pnpm exec playwright test -c playwright.guide.config.ts`: 13 passed (11 shots + 2 check). Sau đó `git status` chỉ có `e2e/guide/shots.guide.ts`, tức cả 28 ảnh trùng từng byte với `main`. Cả 28 file ảnh đều vừa được ghi lại (giờ sửa file trong 10 phút trước), nên không phải bộ chụp bỏ qua ảnh nào. Chụp trên Home PC `DESKTOP-KDURKJP`.

**Kế hoạch lượt 4**

- [x] Memory được dọn ngay trước gói A, sau mọi task thử:
  - bước dọn ở đoạn "Xong" của bước 5 (`:2191`);
  - "mọi task thử" (`:2189`);
  - ghi vào `baseline.md`;
  - "Sửa theo …" dọn Memory trước lần chạy lại (`:2147`);
  - dòng Memory của "Chỉ ghi lại" (`:2182`) và của bảng Phụ lục P (`:2650`).
- [x] Chọn Full Access thì có kiểm ACL ở chính chế độ đó trước gói A, ra khác "bị từ chối" thì dừng đợt 2 (`:2175`).
- [x] Phiên thử ở Default ghi thông báo lỗi của mỗi lần bị từ chối (`:2152`). "Chế độ quyền" của Phụ lục P (`:2656–2657`) và câu "phiên thử bắt được" (`:3053`) khớp bước mới.
- [x] Dòng `kept, holds node_modules` nói đúng hành vi (`:2101`, `:2104`); mục "Script đợt 2" không còn chữ lệch (`:2688`).
- [x] Khối `js` trùng từng byte với `origin/main`. Một script tạm (scratchpad) trích khối ` ```js ` sau "**Script đợt 2**" từ `git show origin/main:…` và từ file ở head, rồi so `Buffer`:
  - cùng 14 788 B; dòng 2709–3036 ở `main`, 2712–3039 ở head;
  - 13 hunk của `git diff -U0`, không hunk nào trong khối;
  - bản trích qua `node --check`.

**Chung**

- [x] `pnpm verify` xanh ở local (trong worktree task).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`: 4 mục "Trùng file".

- L13 `e2e/guide/shots.guide.ts:45–50` (`rightOfSidebar` đo `main` trước khi `shot()` cuộn về đầu trang, review #882): đã sửa (mục 1).
- L15 `docs/process/deep-review-phase-1-6.md:2181` (Memory chỉ được dọn trước phiên thử, review #881): đã sửa (mục 2, Memory).
- L16 `docs/process/deep-review-phase-1-6.md:2174` (nhánh Full Access chưa được kiểm ACL, review #881): đã sửa (mục 2, ACL ở Full Access).
- L17 `docs/process/deep-review-phase-1-6.md:2101` (NIT, dòng `kept` in cả cho thư mục đã có lúc ghi mốc, review #881): đã sửa (mục 2, dòng `kept`).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-316 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #881, #882 — T-316 (#884, PR #888, `REVIEW: PASS` @`5abf467`):
  - #881, `docs/process/deep-review-phase-1-6.md` (§L4.9 đợt 2 bước 4, 5; Phụ lục P, bảng "Cài đặt app", mục "Còn hở với app WorkBuddy"): bước 4 ghi số mục Memory còn lại sau khi dọn. Đường "Sửa theo …" của bước 5 dọn Memory rồi thử lại ở một task mới. Đoạn "Xong mọi task thử" (phiên thử, mỗi lần chạy lại, task kiểm ACL ở Full Access) thêm bước dọn Memory ngay trước gói A: xóa mọi mục mới so với lúc dọn ở bước 4, ghi số mục đã xóa vào `baseline.md`, không chép nội dung (các gói đọc file này). Nhánh hỏng chưa dọn `common\baseline.md`: ghi chú mới của review #888, ở OPEN.
  - #881, `docs/process/deep-review-phase-1-6.md` (§L4.9 đợt 2 bước 5; Phụ lục P, "Chế độ quyền", hai mục "Còn hở"): phiên thử Default ghi thông báo lỗi của mỗi lần đọc thử bị từ chối. Lỗi quyền của Windows (`Access is denied`, `EPERM`) là của ACL; thông báo khác thì lần đó chưa cho biết ACL có chặn không. Owner chọn Full Access thì một task Full Access làm lại các việc đọc thử mục bị chặn trước gói A, ra khác "bị từ chối" thì dừng đợt 2. Task này mở sau lệnh **Log của app** của phiên thử, vì lệnh đó lấy file `.jsonl` mới nhất; credit sau phiên thử ghi sau cả task này.
  - #881 NIT, `docs/process/deep-review-phase-1-6.md` (§L4.9 đợt 2 bước 1; mục "Script đợt 2" của Phụ lục P): dòng `kept, holds node_modules` nay tả đúng `leftovers` / `clean`: in cho mọi thư mục chưa theo dõi hay bị ignore có `node_modules` con, kể cả thư mục đã có lúc ghi mốc; cache Vite xóa cả ở các thư mục có dòng `kept`. Khối `js` không đổi: review #888 so từng byte với `main` (14 788 B) và chạy `node --check` bản trích.
  - #882, `e2e/guide/shots.guide.ts` (`rightOfSidebar`): hàm gọi `window.scrollTo(0, 0)` trước khi đo `main`, như `shot()`; comment ghi lý do. Repo không có `scroll-behavior`, nên lệnh cuộn xong trước khi đo. Theo phép thử tạm thân PR #888 ghi (Hồ sơ KH, cao 3 424 px): ở cuộn 300, bản trước trả clip cao 3 123,75 (hụt đúng 300), bản này 3 423,75 như ở cuộn 0. Chụp lại trên Home PC: 13 passed, 28 ảnh trùng từng byte với `main`.

---

# Issue #889 — T-317: Mục sổ trước lượt 4: nhánh hỏng của phiên thử dọn cả common\baseline.md, không chỉ Memory

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sổ ghi chú review hết mục OPEN để lượt 4 ghim được SHA. Theo B2, lượt 4 chỉ chạy khi mục OPEN rỗng. Mục còn lại là ghi chú không chặn của review PR #888 (T-316); Owner 28/10 chọn sửa trước lượt 4.

**Chỗ hở:** nhánh hỏng của phiên thử (đợt 2 bước 5) dọn Memory của app nhưng không dọn `common\baseline.md`.
- Phiên thử bảo model ghi kết quả từng việc vào `baseline.md`. Phần chung của mọi prompt (Phụ lục N, Phụ lục O áp dụng đầy đủ) đưa file này vào danh sách mọi gói A–F đọc.
- Một lần đọc thử mục bị chặn mà lọt ACL, nhất là bằng công cụ đọc file của app (vd. `A.md` của Claude / Codex), đưa nội dung vào hội thoại. Model có thể chép một đoạn vào `baseline.md` khi ghi kết quả.
- Đường "Sửa theo, dọn Memory …, rồi thử lại ở một task mới" xóa Memory nhưng không bảo xóa phần đó khỏi `baseline.md`, nên gói A vẫn đọc được. Task kiểm ACL ở Full Access cũng ghi kết quả vào `baseline.md`.

**Sửa:** `baseline.md` không giữ nội dung đọc được từ mục bị chặn.
- Mỗi lần đọc thử, ở phiên thử lẫn task kiểm ACL ở Full Access, chỉ ghi việc đã làm, "bị từ chối" hay "đọc được", và thông báo lỗi. Không chép nội dung file hay danh sách mục đọc được.
- Lần đọc nào lọt ACL thì trước lần chạy lại, và trước gói A, Owner xóa khỏi `baseline.md` nội dung các task thử đã chép từ lần đọc đó. Dòng "đọc được" kèm thông báo thì giữ.
- Có thể kèm cách kiểm có sẵn, vd. chạy lại `dot2.mjs scan` ngay trước gói A: `scan` đọc cả `common\baseline.md` (file sửa sau mốc) và bắt mã phát hiện lượt 4 của Claude / Codex. Phiên làm task chọn.

##### Bối cảnh

- Review PR #888 (T-316, `REVIEW: PASS` @`5abf467`, mức low, merge 28/10 `8006780`) ghi mục này ở trục Correctness, không chặn.
- Owner 28/10, sau review #888: sửa trước khi ghim SHA lượt 4 (B2, §L4.11 mục 8). PR sổ của review #888 ghi mục vào OPEN với nhãn của Issue này.
- T-316 (#884) đã thêm: dọn Memory trước lần chạy lại và ngay trước gói A; task kiểm ACL ở Full Access; thông báo lỗi của mỗi lần đọc thử. Mục này là phần còn lại của cùng nhánh hỏng, ở `baseline.md` thay vì Memory.
- App WorkBuddy: Owner duyệt G4 / G6 ngày 28/10 trên #880. Phiên Claude không mở app và không chạm token; mọi bước trong app là việc của Owner.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`, mục OPEN: nhóm review #888 (`node tools/notes-for.mjs <issue>`).
- Comment review PR #888, mục Correctness: https://github.com/AlexH-AI/Project-2C/pull/888#issuecomment-6473918576
- `docs/process/deep-review-phase-1-6.md` (số dòng theo `main` `8006780`):
  - §L4.9 đợt 2 bước 5: `:2145` (ghi kết quả vào `common\baseline.md`), `:2147` ("Sửa theo …"), `:2152–2157` (các lần đọc thử mục bị chặn), `:2175` (task kiểm ACL ở Full Access), `:2189–2191` (đoạn "Xong mọi task thử");
  - §L4.9 đợt 2 bước 3: `scan` (`:2135–2140`);
  - Phụ lục N `:2506` (danh sách mọi gói đọc, có `common\baseline.md`); Phụ lục O `:2601` (phần chung áp dụng đầy đủ);
  - Phụ lục P: `scan` trong khối `js` (`MARKER` `:2737`, `scan` `:2965`), hai mục "Còn hở" (`:3048–3061`);
  - §L4.11 (`:2301`): quyết định G6.

##### File / thư mục được phép sửa

- `docs/process/deep-review-phase-1-6.md` (§L4.9 đợt 2 bước 5; Phụ lục P, mục "Còn hở với app WorkBuddy" nếu cần một dòng; không sửa khối `js`)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs 889` (sổ @ `ebb5596`, sau PR sổ #890) ra 1 mục "Trùng file":

- L13 [T-317 #889], review #888: nhánh hỏng của phiên thử dọn Memory nhưng chưa dọn `common\baseline.md`.

**Gộp**, vì đây chính là việc của Issue. Ba mục [T-316] của file này PR #888 đã sửa, PR #890 đã chuyển sang RESOLVED.

##### Interface / hợp đồng

- Khối `js` của `dot2.mjs` (Phụ lục P) không đổi, vì Owner đã xác nhận G6 cho script này. Chạy lại `scan` (nếu chọn) dùng đúng lệnh hiện có.
- Những gì G6 ngày 28/10 đã duyệt giữ nguyên: bộ ACL, phạm vi dọn, quyết định chế độ quyền ("Duyệt, Default trước"). Bước mới chỉ là việc ghi chép, kiểm hay dọn của Owner; cách sửa nào làm đổi các mục G6 thì hỏi Owner trước và ghi ngày.
- Không đổi code app, không thêm test.

##### Test chấp nhận

- [ ] Các lần đọc thử mục bị chặn của phiên thử (đợt 2 bước 5) và của task kiểm ACL ở Full Access:
  - kế hoạch bảo model ghi vào `baseline.md` cho mỗi lần chỉ việc đã làm, "bị từ chối" hay "đọc được", và thông báo lỗi;
  - không chép nội dung file hay danh sách mục đọc được.
- [ ] Đường "Sửa theo …" của bước 5: lần đọc thử nào lọt ACL thì trước lần chạy lại, Owner xóa khỏi `baseline.md` nội dung các task thử đã chép từ lần đọc đó. Kế hoạch nói rõ dòng nào giữ (dòng "đọc được" kèm thông báo).
- [ ] Đoạn "Xong mọi task thử": ngay trước gói A, cùng lúc dọn Memory, `baseline.md` được kiểm không còn nội dung đọc được từ mục bị chặn (tay, hoặc chạy lại `scan`). Owner ghi kết quả kiểm vào `baseline.md`.
- [ ] Khối `js` của Phụ lục P trùng từng byte với `main` (`git diff` không có dòng nào trong khối).

Ước lượng: ≈ 5–15 dòng chữ của kế hoạch.

##### Định nghĩa hoàn thành

- [ ] PR chỉ sửa docs: không chạy CI
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển mục [T-317] sang RESOLVED; mục OPEN của sổ chỉ còn ghi chú mới của review T-317 (nếu có)

##### Rủi ro

risk:low

##### Bị chặn bởi

Không.

## PR #891 — docs: keep blocked-read content out of baseline.md in the round 4 trial (T-317)

Trạng thái: MERGED · merge 2026-10-28T16:39:15Z · commit `f44e1a951ba6c17bf44b76fc81998f16ec321a52` · nhánh `task/T-317-baseline-cleanup` · nhãn: risk:low

Closes #889

#### Thay đổi

Sửa mục [T-317] của sổ (L13, review #888) để mục OPEN rỗng trước khi ghim SHA lượt 4 (B2). Chỉ đổi `docs/process/deep-review-phase-1-6.md`, trong §L4.9 đợt 2 bước 5. Số dòng theo head `15d27c1`.

1. **Mỗi lần đọc thử mục bị chặn chỉ ghi ba thứ** (`:2152`): model ghi vào `baseline.md` việc đã làm (shell hay công cụ, mục nào), "bị từ chối" hay "đọc được", và thông báo lỗi nếu có.
   - Không chép nội dung file, tên mục liệt kê được hay tóm tắt của chúng, kể cả ở lần "đọc được". Lý do ghi ngay trong câu: mọi gói A–F đọc `baseline.md` (Phụ lục N).
   - Phần về sandbox và lỗi quyền của Windows (review #881) giữ nguyên.
2. **Task kiểm ACL ở Full Access** (`:2175`): ghi vào `baseline.md` như phiên thử, không chép nội dung. Ra khác "bị từ chối" thì vẫn dừng đợt 2, báo Claude. Thêm: trước lần chạy lại, dọn `baseline.md` như đường "Sửa theo …".
3. **Đường "Sửa theo …"** (`:2147`): lần đọc thử nào ra "đọc được" thì trước lần chạy lại, Owner xóa khỏi `baseline.md` mọi thứ các task thử đã chép từ lần đọc đó (nội dung file, tên mục, tóm tắt), ở bất cứ chỗ nào trong file. Chỉ giữ dòng "đọc được" của lần đó: việc đã làm, kết quả, thông báo nếu có.
4. **Đoạn "Xong mọi task thử", mục mới ngay sau bước dọn Memory** (`:2192`). Cùng lúc dọn Memory, ngay trước gói A:
   - Owner đọc lại `baseline.md`, nhất là các đề mục của task thử; còn gì chép từ mục bị chặn thì xóa như đường "Sửa theo …";
   - rồi chạy lại lệnh `scan` của bước 3; `STOP` thì dừng đợt 2, báo Claude;
   - ghi kết quả kiểm vào `baseline.md`, không chép nội dung.

   Kế hoạch nói rõ phần đọc lại là chính. `scan` có đọc `common\baseline.md` (file sửa sau mốc, nằm dưới `C:\workspace`), nhưng `MARKER` chỉ bắt mã phát hiện và dòng đầu báo cáo lượt 4 của Claude / Codex. Tên mục, nội dung lượt 1–3, file của `.codex` hay `package.json` của `Project-2C-review-2` thì `scan` không bắt.

**Thêm ngoài chữ của Issue.** Đây là việc ghi chép / kiểm của Owner, không đổi mục G6 nào:
- `:2145`: model ghi kết quả "dưới một đề mục riêng của task này" (phiên thử, mỗi lần chạy lại và task Full Access, mỗi task một đề mục), để bước đọc lại biết phần nào cần đọc kỹ. Bước đọc lại và bước xóa vẫn xét cả file, vì model có thể ghi ra ngoài đề mục của mình (commit `15d27c1`).
- Đường dọn `baseline.md` áp cả cho task kiểm ACL ở Full Access. Issue nêu đường "Sửa theo …" của phiên thử; task Full Access trước đây chỉ có "dừng đợt 2, báo Claude".
- Chọn cả hai cách kiểm Issue nêu (đọc tay và chạy lại `scan`), vì mỗi cách bắt phần cách kia bỏ sót. `scan` bắt bản chép báo cáo lượt 4 ở mọi chỗ còn đọc được, kể cả ngoài `baseline.md`; đọc tay bắt phần không có mã phát hiện.

**Không đổi:**
- bộ ACL, phạm vi dọn, quyết định chế độ quyền ("Duyệt, Default trước");
- khối `js` của `dot2.mjs`; lần chạy lại `scan` dùng đúng lệnh của bước 3;
- `:2091` ("Bước 1, 3 và 7 chạy `common\dot2.mjs`") và `:2683` (mục "Script đợt 2": "Owner chạy ở đợt 2 bước 1, 3 và 7"). Hai dòng này nằm ngoài phần Issue cho sửa, và comment đầu khối `js` (không sửa) cũng ghi `scan` ở bước 3. Bước 5 ghi rõ "chạy lại lệnh `scan` của bước 3" kèm cách xử lý `STOP`, nên không cần sửa hai dòng đó;
- Phụ lục P, mục "Còn hở với app WorkBuddy": không thêm dòng. Giới hạn của `scan` đã ghi ngay ở bước kiểm, và đó không phải chỗ hở của app.

Cỡ (`git diff --numstat`): `docs/process/deep-review-phase-1-6.md` +5 / −4. Không đụng file cần nhãn `build-exe`. PR chỉ đổi một file `.md` ngoài `CODE_DOCS` (`tools/pr-core.mjs`), nên CI không chạy.

#### Test chấp nhận

- [x] Các lần đọc thử mục bị chặn của phiên thử (`:2152`) và của task kiểm ACL ở Full Access (`:2175`):
  - kế hoạch bảo model ghi vào `baseline.md` cho mỗi lần chỉ việc đã làm, "bị từ chối" hay "đọc được", và thông báo lỗi;
  - không chép nội dung file hay danh sách mục đọc được, kể cả tóm tắt, kể cả ở lần "đọc được".
- [x] Đường "Sửa theo …" (`:2147`): lần đọc thử nào lọt ACL thì trước lần chạy lại, Owner xóa khỏi `baseline.md` nội dung các task thử đã chép từ lần đọc đó. Kế hoạch nói rõ dòng giữ lại: dòng "đọc được" của lần đó (việc đã làm, kết quả, thông báo nếu có). Task Full Access trỏ về đường này (`:2175`).
- [x] Đoạn "Xong mọi task thử" (`:2192`): ngay trước gói A, cùng lúc dọn Memory, `baseline.md` được kiểm (đọc tay, rồi chạy lại `scan`); Owner ghi kết quả kiểm vào `baseline.md`.
- [x] Khối `js` của Phụ lục P trùng từng byte với `origin/main`. Một script tạm (scratchpad) trích khối ` ```js ` sau "**Script đợt 2**" từ `git show origin/main:…` và từ file ở head, rồi so `Buffer`:
  - cùng 14 798 B tính cả hai dòng rào, tức 14 788 B phần code như review #888 đo; dòng 2711–3040 ở `main`, 2712–3041 ở head;
  - 5 hunk của `git diff -U0` (`:2145`, `:2147`, `:2152`, `:2175`, `:2192`), không hunk nào trong khối;
  - bản trích qua `node --check`.

**Thêm**

- [x] File ở head không có chữ nào khớp `MARKER` của `dot2.mjs` (0 chỗ, như ở `main`), nên bản chép `common\plan.md` không làm `scan` dừng nhầm. Phần mới không ghi mã phát hiện mẫu hay dòng đầu báo cáo mẫu.
- [x] `git diff --check` sạch; file vẫn LF.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`: 1 mục "Trùng file".

- L13 `docs/process/deep-review-phase-1-6.md:2147` ([T-317 #889], review #888: nhánh hỏng của phiên thử dọn Memory nhưng chưa dọn `common\baseline.md`): đã sửa (mục 1–4).

#### Kiểm tra

- [ ] `pnpm verify` xanh ở local: không chạy. PR chỉ đổi một file `.md` ngoài `CODE_DOCS`; không file `.ts` / `.mjs` / `.js` nào trong `tools/`, `packages/`, `apps/`, `e2e/` nhắc tới file này (đã tìm).
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-317 (`docs/state/review-notes.md` ở `2e51e25`, nguyên văn)

- Ghi chú review PR #888 — T-317 (#889, PR #891, `REVIEW: PASS` @`15d27c1`):
  - #888, `docs/process/deep-review-phase-1-6.md` (§L4.9 đợt 2 bước 5): mỗi lần đọc thử mục bị chặn, ở phiên thử Default lẫn task kiểm ACL ở Full Access, model chỉ ghi vào `common\baseline.md` việc đã làm, "bị từ chối" hay "đọc được", và thông báo lỗi nếu có. Không chép nội dung file, tên mục liệt kê được hay tóm tắt, kể cả ở lần "đọc được". Mỗi task thử ghi dưới một đề mục riêng. Đường "Sửa theo …": lần đọc nào ra "đọc được" thì trước lần chạy lại, Owner xóa mọi thứ chép từ lần đó, ở bất cứ chỗ nào trong file, chỉ giữ dòng "đọc được"; task Full Access dọn như vậy trước lần chạy lại. Đoạn "Xong mọi task thử": cùng lúc dọn Memory, ngay trước gói A, Owner đọc lại `baseline.md`, chạy lại `scan` của bước 3 (`STOP` thì dừng đợt 2) và ghi kết quả kiểm vào `baseline.md`. Khối `js` không đổi: review #891 so từng byte với `main` (14 788 B) và chạy `node --check` bản trích.
