# Project-2C — Kế hoạch triển khai (bản chỉ Claude Code)

Status: **ACCEPTED (G1)** — kế thừa quyết định Q1–Q16 của Project-2 + quyết định riêng C1–C8 (§7.2) · Soạn: Claude Opus 5.5 · Ngày: 2026-09-26

> **Cập nhật 2026-09-26 (sau Phase 2):** định nghĩa chỉ số và vòng đời đã chốt lại ở G2 — **ADR-0007 là nguồn đúng** (§2.3 đã đồng bộ). Khi kế hoạch và ADR khác nhau, ADR thắng. Tiến độ: §5; trạng thái hiện tại: `docs/PROJECT-STATE.md`.

Nguồn: `AlexH-AI/Project-2` → `docs/PROJECT-PLAN.md` tại commit `884dba6` (Owner đã duyệt G1), chuyển thể cho cách làm chỉ bằng Claude Code.

**Project-2C là nhánh đối chứng**: cùng yêu cầu sản phẩm với Project-2, khác duy nhất ở cách thực hiện — **toàn bộ do Claude Code (không subagent; model và effort do Owner chọn từng phiên — ADR-0001 phụ lục M1, trước 29/09/2026 là Opus 5.5 effort medium)** làm. Quy tắc so sánh và cách ly: `docs/COMPARISON.md`.

Các mục §1, §2, §4.4–§4.6, §7 giữ nguyên nội dung sản phẩm của Project-2; các mục về cách làm (§0, §3, §4.1–§4.3, §5, §6, §8) đã được viết lại cho 2C.

---

## 0. Tóm tắt điều hành

| Chủ đề | Đề xuất |
|---|---|
| Mô hình làm việc | **Claude Code làm toàn bộ** (model / effort do Owner chọn từng phiên, ADR-0001 M1): kiến trúc, code, test, review. Codex chỉ **review độc lập khi đóng phase** (ADR-0001 M2, 30/09/2026). **Không subagent**, không agent ngoài Claude viết code. Tự động trong mọi task, chỉ dừng ở cổng Owner duyệt (G1–G8). Hạn mức dùng do Owner tự cân đối. |
| Liên tục 2 máy | **GitHub là nguồn sự thật duy nhất**: code + spec + `docs/state/HANDOFF.md` + GitHub Issues/PR. Mỗi phiên kết thúc bằng push; mỗi phiên bắt đầu bằng pull + đọc handoff. Không phụ thuộc bất kỳ trạng thái local nào (DB dev sinh lại từ seed, key API nhập riêng từng máy). |
| Plugins/skills | **Superpowers** (chỉ các skill chạy trong phiên chính: TDD, verify, debugging, writing/executing plans) + **mattpocock/skills** (`grill-me` → `to-spec` → `to-tickets`). Không dùng skill/framework dựa trên subagent (GSD Core, OMC, `subagent-driven-development`). |
| Tech stack | **Tauri 2 + React + TypeScript + Vite + Tailwind + shadcn/ui + SQLite (Drizzle)**, monorepo pnpm. Build ra 1 file `.exe` portable (~10–20 MB) trên GitHub Actions. Lõi nghiệp vụ là TypeScript thuần, test được không cần Tauri. |
| AI copilot | Cổng KYC **deterministic** chạy trên *dữ kiện KYC đã có cấu trúc*; output AI ép theo JSON schema + validator chặn nội dung cấm; mỗi kết quả gắn `kyc_version`, kết quả trễ tự thành `STALE`. v1: Mock + OpenCode Go (giống Project-2). |
| UI/UX | Dark mode chuyên nghiệp theo design tokens; font **Be Vietnam Pro** (thiết kế cho tiếng Việt), số liệu `tabular-nums`; Owner duyệt mockup trước khi code màn hình. |
| Quyết định đã chốt | Kế thừa từ Project-2: app 1 người dùng (Owner) trên 2 máy; dữ liệu app đồng bộ qua file backup + repo GitHub private; định nghĩa chỉ số; vòng đời KH/HĐ; cổng KYC; AI qua OpenCode Go; Tauri 2; Excel; tiếng Việt; auto-merge task rủi ro thấp. Riêng 2C: C1–C8 (§7.2). |

---

## 1. Hiểu yêu cầu (tóm tắt lại để Owner xác nhận)

**Sản phẩm:** ứng dụng desktop Windows x64 portable quản lý hoạt động tư vấn bảo hiểm nhân thọ của các RE (Relationship Expert) theo team, có Team Leader; khách hàng phân khúc HNW/UHNW; dữ liệu giả lập 100% (không cần ZDR).

**Chức năng:**

1. **Khách hàng**: họ tên, ngày sinh (`dd/mm/yyyy` hoặc tối thiểu `yyyy`), giới tính, ID ẩn ngẫu nhiên, nhóm cơ hội N4 → N3 → N2 → N1.
2. **KYC**: nhập tự do theo từng lần, được merge vào hồ sơ hiện hành, có lịch sử cập nhật ngắn gọn.
3. **Lịch hẹn**: nhập trước theo `dd/mm` (năm hiện tại), có *trigger*, *người phối hợp* (TL/IS/BD/BDM), *kết quả cuộc gặp*.
4. **Bảng lịch hẹn trong ngày** của mọi RE, phân theo team; click để xem chi tiết lịch + KYC + kết quả AI.
5. **Thống kê** theo RE/team, ngày/tuần/tháng/năm + MTD: số lịch dự kiến, đã gặp, số cuộc gặp "chuyển RF", HĐ nộp, HĐ phát hành, case size (FYP), tỉ lệ chốt, doanh số (= Σ issued FYP). Xuất báo cáo theo khoảng ngày / tháng / năm.
6. **AI "KYC Intelligence copilot"** có kiểm soát: chuẩn hóa KYC → cổng chất lượng deterministic (4 trạng thái) → phân tích tiếng Việt (Behavioral Hypotheses, Needs/Pain points/Opportunity Themes, Discovery Strategy, Next Best Actions) → kiểm soát phiên bản / độ tin cậy / nguồn pháp lý. Đổi được provider/model/reasoning level. Ranh giới: không bán hàng, không chấm điểm, không "% chốt", không gợi ý sản phẩm, không tự hành động.
7. **Demo**: 3 team × 10 RE.

**Tiêu chí bắt buộc:** Owner làm trên 2 máy Windows 11 x64 (Home PC buổi tối, Office Laptop ban ngày), phải tiếp tục công việc liền mạch; đồng bộ qua GitHub `AlexH-AI/Project-2C`.

---

## 2. Phân tích ý tưởng sản phẩm

### 2.1 Điểm mạnh

- **Bài toán rõ, người dùng rõ, dữ liệu rõ.** Pipeline N4–N1 là mô hình nghiệp vụ thật, có định nghĩa từng nấc — nền tảng tốt cho thống kê.
- **Tư duy AI rất trưởng thành.** Cổng deterministic trước khi gọi model, cấm bịa fact/xác suất/stereotype, versioning chống kết quả lỗi thời, human-in-the-loop — đây là những điểm mà phần lớn "AI CRM" bỏ qua. Nó cũng giúp kiểm thử được (test cổng, test validator) thay vì chỉ "cảm nhận" chất lượng AI.
- **Dữ liệu giả lập** → không vướng pháp lý dữ liệu cá nhân, dùng được mọi provider AI, commit được dữ liệu mẫu vào repo.
- **Phạm vi demo cụ thể** (3 × 10) → đủ để kiểm chứng hiệu năng và UI bảng biểu.

### 2.2 Điểm yếu / mâu thuẫn cần xử lý

| # | Vấn đề | Tác động | Đề xuất |
|---|---|---|---|
| W1 | **"Portable Windows app" vs "nhiều RE thuộc nhiều team cùng nhập liệu".** App portable + SQLite local = 1 người dùng / 1 máy. Nếu 30 RE thật cùng nhập thì cần server/DB chung. | Quyết định kiến trúc lớn nhất. | ✅ **Đã chốt (Q1):** app 1 người dùng (Owner), không server; có **góc nhìn** toàn bộ / team / RE. Tầng dữ liệu vẫn đặt sau interface repository để giữ đường mở rộng. |
| W2 | **Cổng KYC "deterministic" nhưng KYC nhập tự do.** Không thể xác định deterministic "đã đủ thông tin về tài sản/gia đình/mục tiêu" từ một đoạn văn tự do nếu không dùng LLM để đọc. | Hoặc cổng thành không-deterministic, hoặc phải có dữ liệu có cấu trúc. | Tách **ghi chú KYC thô** (append-only, bất biến) và **dữ kiện KYC có cấu trúc** (fact có nguồn trích dẫn tới ghi chú). Dữ kiện đến từ: (a) RE chọn nhanh qua chip/trường, hoặc (b) nút "AI trích xuất" đề xuất → **RE xác nhận**. Cổng chỉ đọc dữ kiện đã xác nhận → deterministic thật, và `KYC_INSUFFICIENT` không tốn call. ✅ **Đã chốt (Q9)**, xem §4.5. |
| W3 | **Kết quả cuộc gặp là văn bản tự do** chứa cả dữ kiện thống kê ("chuyển nhóm N3", "case size dự kiến 500 triệu"). | Nếu parse từ văn bản → thống kê sai, khó kiểm toán. | Kết quả cuộc gặp = văn bản + **trường có cấu trúc bắt buộc**: trạng thái cuộc hẹn, nhóm sau cuộc gặp, case size dự kiến, việc tiếp theo. Văn bản chỉ là mô tả. |
| W4 | **Pipeline thiếu trạng thái cuối.** Sau N1 là gì? Nộp HĐ, phát hành, từ chối thẩm định, KH hủy, mất cơ hội, tạm hoãn… Một KH có thể có nhiều HĐ. | Không tính được tỉ lệ chốt, không đóng được vòng đời. | ✅ **Đã chốt (Q7):** Policy là thực thể riêng (`submitted → issued`). KH có thêm `ON_HOLD` (Tạm hoãn) / `LOST` (Mất cơ hội). Lưu **mọi lần chuyển nhóm** thành sự kiện (`stage_transitions`) — cơ sở để "không đếm trùng KH". |
| W5 | **Định nghĩa chỉ số còn mơ hồ** (xem §2.3). | Hai người đọc ra hai con số khác nhau → mất tin cậy. | Chốt định nghĩa bằng **ví dụ vàng (golden examples)** và biến chúng thành unit test. → **Q3–Q6** |
| W6 | **"Nguồn pháp lý"** được yêu cầu kiểm soát nhưng lại "không tự theo dõi pháp luật nền". | Không rõ nguồn pháp lý lấy từ đâu. | **Legal reference pack** có phiên bản, do Owner cung cấp/duyệt (vd. Luật Kinh doanh bảo hiểm 2022, phần thừa kế BLDS 2015…). AI chỉ được trích dẫn từ pack; kết quả có trích dẫn pack cũ → cảnh báo. ✅ **Đã chốt (Q10): hoãn sang v2.** v1: AI **không** trích dẫn pháp lý; chủ đề có yếu tố pháp lý chỉ ghi "cần chuyên gia pháp lý xác nhận". |
| W7 | **"Liên kết ChatGPT" và "Claude Sonnet"**: gói ChatGPT Business và Claude Pro **không** cấp API cho ứng dụng bên thứ ba. | App không gọi được AI nếu chỉ có subscription. | Cần API key trả theo mức dùng (Anthropic Console / OpenAI Platform), **hoặc** dùng key **OpenCode Go** (có endpoint tương thích OpenAI & Anthropic, dùng được ngoài OpenCode). Luôn có **Mock provider** để demo/test offline. ✅ **Đã chốt (Q11):** v1 chỉ dùng **key OpenCode Go** (+ Mock); Claude Sonnet / ChatGPT để v2. |
| W8 | Nhập ngày `dd/mm` mặc định năm hiện tại. | Cuối năm nhập lịch đầu năm sau sẽ sai năm. | Luôn hiển thị ngày đã diễn giải đầy đủ ngay khi nhập; nếu ngày suy ra đã qua > 60 ngày thì gợi ý năm sau. |
| W9 | Văn bản có chỗ lẫn **RM/RE** và nhắc "**Project-1**" trong đoạn ranh giới AI. | Nhầm lẫn thuật ngữ. | ✅ **Owner xác nhận (Q16):** lỗi soạn thảo — RM = RE, "Project-1" = Project-2. |

### 2.3 Định nghĩa chỉ số

**Thuật ngữ (Owner xác nhận 2026-09-26):** HĐ **submitted (đã nộp)** = RE chốt thành công giải pháp, KH **đã đóng phí**; HĐ chuyển sang trạng thái `submitted`. Sau đó HĐ được **issued (phát hành)**. Một KH có thể có nhiều HĐ cùng lúc.

Bảng dưới là bản tóm tắt; định nghĩa đầy đủ, vai trò tính chỉ số và golden examples ở **ADR-0007** + `docs/golden/chi-so.md` (Owner duyệt G2, 26/09/2026). Code: `packages/domain/src/stats.ts`.

| Chỉ số | Định nghĩa | Trạng thái |
|---|---|---|
| HĐ đã nộp | Số HĐ có `submitted_date` trong kỳ | ✅ Chốt (G2) |
| HĐ phát hành | Số HĐ có `issued_date` trong kỳ | ✅ Chốt (G2) |
| **Case size** | **Σ FYP của các HĐ đã nộp** (`submitted_date` trong kỳ) — là tổng, không phải trung bình | ✅ Chốt |
| **Doanh số** | **Σ issued FYP**, ghi nhận theo **`issued_date`** (nộp tháng 1, phát hành tháng 2 → doanh số tháng 2). FYP phát hành mặc định = FYP nộp, sửa tay được | ✅ Chốt |
| **Tỉ lệ chốt** | **Số HĐ có `issued_date` trong kỳ ÷ số cuộc gặp chuyển RF trong kỳ**. Không lũy kế; như nhau cho RE và team; có thể > 100%; 0 RF → "—" | ✅ Chốt (G2 — thay Q3/Q3c) |
| **Cuộc gặp chuyển RF** (RF = *Refer*) | Cuộc hẹn **Đã gặp** mà "nhóm sau cuộc gặp" đưa KH từ **N4/N3** lên **N2/N1** (kể cả N4→N2, N4→N1). N4→N3, N2→N1, hạ nhóm, mở lại về N3, sửa nhóm tay ngoài cuộc hẹn đều **không** tính. Mỗi cuộc gặp tối đa 1 RF, tính vào ngày gặp | ✅ Chốt (G2 — thay Q4) |
| Tuần | Thứ Hai → Chủ Nhật | ✅ Chốt (G2) |
| MTD | Từ ngày 1 của tháng đến ngày đang xem | ✅ Chốt (G2) |

**Vòng đời (Q7 ✅, bổ sung ở G2 — ADR-0007):**

- **HĐ:** chỉ 2 trạng thái `submitted → issued`. Không theo dõi từ chối/hủy/pending trong v1.
- **Nhóm KH:** được nâng, được **hạ** (vd. N2 → N3), và có 2 trạng thái đóng: **Tạm hoãn** và **Mất cơ hội** — mở lại được, luôn về **N3**. KH mới chỉ tạo ở nhóm mở N4–N1.
- **Sau khi HĐ submitted:** KH **giữ nguyên nhóm** + nhãn **"Đã có HĐ"** (hiện số HĐ) để tiếp tục khai thác nhu cầu khác.
- Hạ nhóm **không** tính là "chuyển RF"; nâng lại sau khi hạ (vd. N3 → N2 lần hai, trong một cuộc gặp) **có** tính RF.

---

## 3. Công cụ và mô hình làm việc của 2C

### 3.1 Công cụ

| Công cụ | Dùng trong 2C? | Ghi chú |
|---|---|---|
| **Claude Code** (model / effort do Owner chọn, ADR-0001 M1) | ✅ Duy nhất viết code | Viết spec, code, test, review, tài liệu. Chạy trong phiên chính, không subagent. |
| **GitHub** (`gh`, Issues, PR, Actions, Releases) | ✅ | Nguồn sự thật cho 2 máy; CI build exe. |
| **Antigravity IDE** | ✅ (bàn làm việc) | Owner mở terminal chạy Claude Code; không phải nơi lưu trạng thái. |
| **OpenCode Go** | ⚠️ Chỉ làm **AI runtime của sản phẩm** (C2) | **Không** dùng `opencode` CLI để viết/review code. |
| **Codex** (CLI / Astra) | ⚠️ Chỉ review độc lập khi đóng phase (từ 30/09/2026, ADR-0001 M2) | Owner chạy; **không viết code**, không review PR task. Báo cáo bổ sung, không thay review phiên sạch; Claude kiểm lại từng phát hiện. |
| Muse Code, Cursor | ❌ | Dành cho Project-2. |

### 3.2 Mô hình một agent — ưu, nhược, cách bù

- **Ưu:** nhất quán tuyệt đối về kiến trúc và phong cách; không tốn chi phí điều phối; không có lỗi "bàn giao" giữa các agent.
- **Nhược 1 — context rot:** không subagent nên phiên dài sẽ đầy context, chất lượng giảm. → **Mỗi task một phiên mới** (hoặc `/clear`), đầu vào là Issue + `HANDOFF.md` + file liên quan; task đủ nhỏ (P1: ≤ ~400 dòng code sản phẩm, ≤ ~800 dòng tổng diff kể cả test).
- **Nhược 2 — điểm mù của chính mình:** không có review chéo. → **Review ở phiên riêng, context sạch**, chỉ đọc spec + diff, theo checklist cố định; CI và test chấp nhận là trọng tài khách quan; `dependency-cruiser` chặn vi phạm ranh giới module; từ 30/09/2026 thêm review độc lập bằng Codex khi đóng phase (ADR-0001 M2).
- **Nhược 3 — tốc độ và hạn mức:** mọi việc đi qua Claude Code. → Owner tự cân đối (C8); `HANDOFF.md` luôn cập nhật để dừng/tiếp lúc nào cũng được.

---

## 4. Đề xuất triển khai

### 4.1 Quy trình làm việc một agent

```
Owner ──(chỉ dừng ở cổng G1–G8)──┐
                                  ▼
          Claude Code (model do Owner chọn) — một phiên cho mỗi task
   Issue (spec + test chấp nhận) ─► nhánh task/T-xxx ─► TDD: test đỏ → code → test xanh
                                                                   ▼
                                        pnpm verify (lint · typecheck · unit · ranh giới) + pnpm e2e
                                                                   ▼
                                                 commit + push ─► PR ─► CI (Windows)
                                                                   ▼
                          Review ở phiên mới, context sạch (chỉ spec + diff, theo checklist)
                                                                   ▼
   ĐẠT → auto-merge (risk:low) / chờ Owner (cổng) │ CHƯA ĐẠT → sửa (tối đa 2 vòng) │ vẫn lỗi → ESCALATE (G8)
```

**Spec task (Issue template)** gồm: mục tiêu, bối cảnh, *file được phép sửa*, interface/hợp đồng, **test chấp nhận**, định nghĩa hoàn thành, nhãn `risk:low|med|high`.

**Checklist review** (`docs/process/REVIEW-CHECKLIST.md`, soạn ở Phase 1): đúng spec; test bao phủ nhánh lỗi; không vi phạm ranh giới module; không chuỗi UI cứng (phải qua i18n); tiền/ngày xử lý qua hàm chuẩn của `domain`; không thêm dependency ngoài danh sách đã duyệt.

**Cổng dừng chờ Owner (human approval):**

| Cổng | Khi nào |
|---|---|
| G1 | Chấp thuận kế hoạch này / các ADR |
| G2 | Chốt định nghĩa chỉ số (golden examples) và mô hình dữ liệu |
| G3 | Duyệt hướng UI (mockup dark mode các màn hình chính) — **thiết kế riêng của 2C** |
| G4 | Thêm dependency lớn, công cụ, dịch vụ mới; bất cứ thứ gì tốn tiền |
| G5 | Prompt/chính sách guardrail AI và bộ output mẫu |
| G6 | Lưu trữ API key / bảo mật |
| G7 | Merge kết thúc milestone + phát hành bản exe |
| G8 | Task vẫn lỗi sau 2 vòng tự sửa, hoặc spec mâu thuẫn |

Ngoài các cổng trên, Owner **trao quyền tự động** cho Claude (C4): task `risk:low` được **auto-merge** khi CI xanh + review đạt. Mỗi milestone có báo cáo tổng hợp các merge.

**Cơ chế kỹ thuật:**

- `CLAUDE.md` là nguồn quy tắc duy nhất (không cần `AGENTS.md` vì chỉ có Claude).
- Ghi rõ trong `CLAUDE.md`: **không dùng subagent / Agent tool**; model và effort do Owner chọn từng phiên (ADR-0001 M1; ban đầu Opus 5.5, effort medium). Phase 1 kiểm tra khả năng chặn cứng Agent tool bằng `permissions.deny` trong `.claude/settings.json`.
- Không cần `dispatch.ps1`, không cần worktree song song: làm tuần tự từng task trên nhánh riêng.

### 4.2 Liên tục công việc giữa 2 máy (tiêu chí bắt buộc)

**Nguyên tắc:** *không có gì quan trọng chỉ tồn tại trên một máy.*

| Thứ | Ở đâu |
|---|---|
| Code, spec, ADR, kế hoạch | Repo |
| Trạng thái đang làm dở, bước tiếp theo, việc chờ Owner | `docs/state/HANDOFF.md` (commit mỗi cuối phiên) |
| Danh sách task, tiến độ | GitHub Issues + Milestones (+ Project board) |
| Việc đang làm | Nhánh `task/*` / `wip/*` đã push + Draft PR |
| Quy tắc, hooks, lệnh Claude | `CLAUDE.md`, `.claude/settings.json`, `.claude/commands/` (commit) |
| Bản exe để thử | GitHub Actions artifact / Releases |
| DB dev | **Không đồng bộ** — sinh lại bằng `pnpm seed` (seed cố định → dữ liệu giống hệt trên 2 máy) |
| API key | **Không đồng bộ** — nhập riêng mỗi máy (Windows Credential Manager) |

**Nghi thức phiên làm việc (tự động hóa bằng script + lệnh Claude):**

- `/session-start` (hoặc `tools/session-start.ps1`; không đặt tên `/resume` vì trùng lệnh có sẵn của Claude Code): `git fetch` + pull, liệt kê PR mở và Issue `status:in-progress`, in `HANDOFF.md`, kiểm tra toolchain.
- `/handoff` (hoặc `tools/session-end.ps1`): commit WIP lên nhánh, push, cập nhật `HANDOFF.md` (đang làm gì, bước kế tiếp chính xác, việc chờ Owner, lệnh cần chạy tiếp).
- Hook `SessionStart` của Claude Code tự hiện `HANDOFF.md` khi mở phiên.
- Quy tắc: **trước khi rời máy, không để phiên Claude nào đang chạy dở** — hoặc chờ xong task, hoặc chạy `/handoff` để commit WIP và ghi bước tiếp theo.

**Đồng nhất môi trường 2 máy:**

- `tools/bootstrap.ps1` (idempotent, dùng `winget`): Git, Node LTS, pnpm (qua `packageManager` + corepack), Rust (`rust-toolchain.toml`), VS Build Tools, `gh`, WebView2 check.
- `.gitattributes` (`* text=auto eol=lf`), `git config core.longpaths true`, `.nvmrc`, lockfile commit.
- Bảo vệ `main`: hook `.githooks/pre-push` chặn push thẳng `main` (bootstrap đặt `core.hooksPath`, #3); từ 28/09/2026 repo public nên có thêm ruleset `protect-main` trên GitHub (bắt buộc PR, cấm force-push và xóa nhánh). Chỉ merge qua PR khi CI xanh.

**Tùy chọn:** vì 2C chỉ dùng Claude Code, có thể chạy phiên trên cloud (claude.ai/code, gắn repo GitHub) để tiếp tục từ bất kỳ máy nào mà không cần toolchain local cho phần code/test (vẫn cần máy Windows để chạy thử exe).

### 4.3 Plugins / skills

Giữ **cùng bộ plugin với Project-2** (để so sánh công bằng), nhưng chỉ dùng phần chạy trong phiên chính.

| Công cụ | Quyết định cho 2C |
|---|---|
| **Superpowers** | ✅ Cài. Dùng: brainstorming, writing-plans, executing-plans, test-driven-development, systematic-debugging, verification-before-completion. **Không dùng**: subagent-driven-development, dispatching-parallel-agents. |
| **mattpocock/skills** | ✅ Cài (chọn lọc): `grill-me`/`grilling`, `to-spec`, `to-tickets`, `tdd` (upstream đổi tên từ `to-prd`, `to-issues`). |
| **frontend-design** (Anthropic) + **Playwright** | ✅ |
| GSD Core, oh-my-claudecode | ❌ Dựa trên subagent/đa agent — trái C3. |
| BMAD, ECC | ❌ Như Project-2. |

### 4.4 Tech stack & kiến trúc

**So sánh nhanh:**

| | Tauri 2 + React/TS | Electron + React/TS | .NET WPF/WinUI/Avalonia |
|---|---|---|---|
| File portable | 1 exe ~10–20 MB (WebView2 có sẵn trên Win11) | ~100 MB+, target portable giải nén mỗi lần mở → chậm | ~70 MB self-contained |
| UI dark pro | Rất tốt (Tailwind + shadcn/ui) | Rất tốt | Làm được, tốn công hơn |
| Agent AI viết tốt | Rất tốt (TS/React) | Rất tốt | Tốt |
| Nhược | Cần Rust toolchain trên 2 máy (bootstrap tự cài; lớp Rust giữ rất mỏng) | Nặng, khởi động chậm | Hệ sinh thái UI/chart kém phong phú |

**✅ Chọn: Tauri 2 (Q15).** Phương án dự phòng: Electron (chỉ thay lớp vỏ, lõi TS giữ nguyên).

**Cấu trúc monorepo (pnpm workspaces):**

```
apps/desktop/        Tauri shell + React UI (routes, screens)
packages/domain/     TS thuần: entity, state machine N4→N1, stats engine, KYC gate,
                     parse ngày dd/mm & tiền VND ("500tr", "1,2 tỷ") — không phụ thuộc gì
packages/db/         Drizzle schema + migrations + repositories;
                     sql.js ở mọi nơi; exe chỉ có lệnh Rust mỏng đọc/ghi file (ADR-0016)
packages/ai/         provider adapters, prompt templates có version, zod schema, validators
packages/ui/         design system (tokens, components)
tools/               bootstrap, session scripts, seed generator
```

- **Chế độ trình duyệt**: `pnpm dev:web` chạy UI trên Vite với sql.js → dev nhanh và Playwright test không cần build Tauri.
- **Portable**: dữ liệu ở `.\Project2C-data\` cạnh exe; tự backup khi khởi động; xuất/nhập backup `.p2cbackup` (thay toàn bộ, ADR-0016, spec Phase 3 §6).
- **Xuất báo cáo (Q12 ✅)**: `.xlsx` (ExcelJS) có định dạng, mỗi sheet 1 bảng (tổng hợp / theo team / theo RE). PDF không làm ở v1.
- **Ngôn ngữ (Q13 ✅)**: giao diện tiếng Việt, giữ thuật ngữ ngành tiếng Anh (FYP, KYC, N1–N4, submitted/issued); mọi chuỗi đi qua lớp i18n để sau này thêm ngôn ngữ.
- **Chart**: ✅ ECharts 6 (ADR-0014, G4 — chốt ở Phase 1 theo mockup).

**Mô hình dữ liệu cốt lõi:**

`teams`, `people` (RE/TL/IS/BD/BDM), `customers` (ULID ẩn, ngày sinh + độ chính xác, giới tính, RE phụ trách, nhóm hiện tại), `kyc_notes` (append-only), `kyc_facts` (dữ kiện có cấu trúc + note nguồn + trạng thái active/superseded/conflict), `kyc_versions` (hash, tóm tắt "Cập nhật KYC 01/12/2025", cờ material), `stage_transitions`, `appointments` (trigger, người phối hợp nhiều lựa chọn, trạng thái, kết quả văn bản + trường có cấu trúc), `policies`, `ai_analyses` (kyc_version, trạng thái cổng, provider/model/reasoning, prompt_version, trạng thái current/stale/rejected/failed, output, báo cáo validator, token/chi phí), `settings`. (`legal_sources` → v2)

**Kiểm thử:** Vitest cho `domain` (mục tiêu ≥ 95% coverage, golden examples của Owner là test); Playwright e2e + ảnh chụp giao diện; AI test bằng Mock provider + fixture ghi sẵn; **bộ eval AI** ~20 hồ sơ KYC giả lập (trạng thái cổng mong đợi + kiểm tra guardrail) chạy thủ công với provider thật, không chạy trong CI.

**CI (GitHub Actions, windows-latest):** lint → typecheck → unit → e2e (web mode) → build Tauri → upload artifact exe. Phase 2 (ADR-0015): build exe chỉ chạy trên `main` hoặc PR có nhãn `build-exe`; PR chỉ sửa docs không chạy CI. Phụ lục 26/09 cho build exe chạy ở mọi PR code từ Phase 3, rồi phụ lục "Tiết kiệm phút Actions" (27/09) thay lại: PR code build exe chỉ khi có nhãn `build-exe` (bắt buộc khi đụng Rust / cấu hình build); push lên `main` chỉ build exe.

### 4.5 Thiết kế AI copilot

```
Ghi chú KYC ─► Dữ kiện có cấu trúc (RE xác nhận) ─► kyc_version (hash)
                                                        │
                                   Cổng deterministic (TS thuần, có unit test)
     ┌──────────────────┬───────────────────────┬───────────────────────┬─────────────────────┐
 KYC_INSUFFICIENT   CONFLICT_RESOLUTION    PROFILE_DISCOVERY        PAIN_POINT_ANALYSIS
 không gọi AI;      mâu thuẫn cốt lõi →    gọi AI chế độ khai thác  gọi AI phân tích đầy đủ
 "Cần chăm sóc,     không gọi AI, RE xử lý;(Discovery Strategy,     (4 khối output)
 KYC thêm thông tin mâu thuẫn phụ → vẫn    câu hỏi làm rõ)
 khách hàng" +      gọi AI kèm cảnh báo
 danh sách thiếu
                                                        │
                        Provider adapter (model + reasoning level) ─► JSON theo zod schema
                                                        │
                   Validator: schema ✓ · mọi giả thuyết có evidence trỏ tới fact tồn tại ✓
                   · không %, "xác suất", "khả năng chốt" ✓ · không tên sản phẩm (danh sách chặn) ✓
                   · không nhãn tính cách (MBTI/DISC…) ✓ · không trích dẫn điều luật/văn bản pháp lý (v1) ✓
                                                        │
                   Lỗi → thử lại 1 lần kèm phản hồi lỗi → vẫn lỗi → REJECTED (lưu, không hiện hành)
                   kyc_version ≠ hiện tại → STALE (lưu lịch sử)  ·  Đạt → CURRENT
```

- **Nhập KYC (Q9 ✅):** ghi chú tự do + dữ kiện có cấu trúc do RE điền nhanh hoặc "AI trích xuất" đề xuất rồi RE xác nhận. **Hồ sơ thường không đủ mọi tiêu chí — đó là bình thường.** Cổng không đòi đủ hết, mà tự đánh giá *những gì đang có* đã đủ để phân tích chưa.
- **Cổng**: chấm độ phủ theo các chiều (danh tính/tuổi, gia đình, nghề nghiệp/nguồn thu, tài sản/AUM, mục tiêu & mốc thời gian, khẩu vị rủi ro, bảo vệ hiện có, mối quan tâm). Không đủ → **không gọi LLM**, trả đúng thông điệp **"Cần chăm sóc, KYC thêm thông tin khách hàng"** kèm danh sách chiều còn thiếu và câu hỏi gợi ý (sinh từ template, không dùng LLM). Ngưỡng cụ thể đề xuất ở Phase 2 bằng bộ hồ sơ mẫu, Owner duyệt.
- **Mâu thuẫn (Q8 ✅):** mâu thuẫn ở trường **cốt lõi** (năm sinh, gia đình, tài sản, mục tiêu) → chặn, không gọi AI, liệt kê để RE xử lý; mâu thuẫn ở trường phụ → vẫn gọi AI, kèm cảnh báo trong output. Thứ tự ưu tiên: mâu thuẫn cốt lõi > thiếu dữ liệu > khai thác > phân tích.
- **"AI trích xuất"** là thao tác RE chủ động bấm, tách biệt với phân tích; không chạy nếu ghi chú quá ngắn.
- **"Độ tin cậy"** của giả thuyết tính **deterministic** từ số lượng/độ mới của bằng chứng, không để LLM tự khai → tránh vi phạm quy tắc "không xác suất".
- **Provider (Q11 ✅):** v1 có `Mock` + `OpenCode Go` (qua adapter tương thích OpenAI). Chọn model trong danh sách của OpenCode Go và reasoning level (nếu model hỗ trợ) trong Settings; key lưu ở Windows Credential Manager. Interface adapter giữ chung để v2 thêm `Anthropic` (Claude Sonnet) / `OpenAI` mà không sửa lõi. Prompt có version.
- **Pháp lý (Q10 ✅):** hoãn legal pack sang v2; v1 validator chặn mọi trích dẫn điều luật.
- **Ranh giới sản phẩm** được mã hóa thành: không có nút "gửi", "đặt lịch" nào do AI kích hoạt; AI chỉ ghi vào bảng `ai_analyses`.

### 4.6 UI/UX dark mode chuyên nghiệp

- **Tokens**: nền phân lớp xám-xanh rất tối (không đen tuyệt đối), 1 màu nhấn, màu ngữ nghĩa riêng cho N4/N3/N2/N1 và trạng thái HĐ; tương phản đạt WCAG AA.
- **Chữ**: Be Vietnam Pro (dấu tiếng Việt đẹp), số liệu `tabular-nums`, định dạng tiền "1,2 tỷ" / "500 tr".
- **Mật độ**: bảng dữ liệu gọn (TanStack Table), bộ lọc cố định, Ctrl+K command palette, phím tắt nhập nhanh.
- **Màn hình**: Tổng quan (số KH theo nhóm N4–N1 theo kỳ, 1 chart Toàn bộ / RE, 3 chart Team — Owner 01/10/2026; lịch theo team + KPI ngày & MTD) · Lịch hẹn (theo team → RE → chi tiết + KYC + AI) · Khách hàng (kanban N4→N1 + bảng) · Hồ sơ KH (dữ kiện, dòng thời gian KYC, panel AI có lịch sử phiên bản) · Báo cáo (chọn kỳ, xuất Excel) · Team & nhân sự · Cài đặt (AI provider, key, backup/đồng bộ) · bộ chuyển vai trò Owner/TL/RE.
- **Quy trình**: Opus + skill frontend-design làm mockup HTML 4 màn hình chính → **Owner duyệt (G3)** → dựng `packages/ui` → mọi màn hình chỉ được ghép từ component có sẵn. Thiết kế của 2C làm độc lập, không tham chiếu Project-2.

---

## 5. Lộ trình

| Phase | Nội dung | Kết quả / Cổng | Tiến độ (02/10/2026) |
|---|---|---|---|
| **0. Chốt yêu cầu** | Kế thừa Q1–Q16; ADR: stack, kiến trúc, mô hình một agent, giao thức 2 máy | ADR · **G1, G2** | ✅ ADR-0001…0014 |
| **1. Nền móng** | `CLAUDE.md`, `.gitattributes`, bootstrap/session scripts, `/session-start` `/handoff`, CI + build exe, pre-push hook bảo vệ `main`, Issue/PR template, checklist review; skeleton Tauri + chế độ web; app shell dark; mockup | Exe chạy được trên **cả 2 máy** · **G3** | ✅ 18/18 issue, đóng 28/09 (G7) — `docs/metrics/phase-1.md` |
| **2. Lõi domain** | State machine, stats engine + golden tests, parse ngày/tiền, mô hình KYC (notes/facts/versions), cổng KYC | Domain coverage ≥ 95% | ✅ 10/10 issue, coverage 100%, đóng 26/09 (G7) — `docs/metrics/phase-2.md` |
| **3. Nghiệp vụ & màn hình** | `packages/db`; Team/RE, Khách hàng, KYC timeline, Lịch hẹn, Kết quả cuộc gặp, Hợp đồng; seed 3 × 10 RE × ~12 tháng dữ liệu; xuất/nhập backup | Nhập liệu hoàn chỉnh · **G7** | ✅ 57/57 issue, đóng 02/10 (G7) — `docs/metrics/phase-3.md`, review đóng phase `docs/reviews/2026-09-30-phase-1-3-tong-hop.md`, `docs/reviews/2026-10-02-phase-1-3-review-2-tong-hop.md` |
| **4. Dashboard & báo cáo** | Tổng quan (ý 9 phản hồi Owner 01/10: đếm KH theo nhóm = ảnh chụp cuối kỳ, nút Lọc), MTD, drill-down team/RE, báo cáo tuần/tháng/năm, xuất Excel. Đầu phase: Đợt 2 của review đóng Phase 3 (e2e local ổn định; validator nhập lần 3 + luật nhân sự T-j; G2 cách đếm lịch dự kiến / đã gặp + chuỗi dời, miền năm, mockup Tổng quan theo ADR-0007 — spec `docs/design/phase-4-chi-so.md`; index chỉ số + MTD; CI coverage riêng + ghim SHA Actions; dọn UI/i18n) | · **G2, G7** (milestone) | 🟡 mở 02/10 — Đợt 2: #251–#259 (G2 #253 chờ Owner duyệt 03/10, G3 #254) |
| **5. AI copilot** | Adapter OpenCode Go + Mock, prompt + schema, validators, versioning/STALE, Settings, bộ eval. Trước `packages/ai`: quyết định gọi mạng + lưu key (D-1) | · **G4, G5, G6** | ⬜ |
| **6. Hoàn thiện & phát hành** | Hiệu năng, rà soát UX, màn "Thùng rác" khôi phục bản ghi xóa mềm (#72), gộp backup / phát hiện xung đột, snapshot mỗi bảng một file (S-1), tuần tự hóa thay DB / lưu / xuất / đồng bộ (S-2), đồng bộ `Project-2C-data`, hướng dẫn sử dụng tiếng Việt, GitHub Release v1.0 | · **G7** | ⬜ |

Ước lượng tổng: **~60%** khối lượng tới v1.0 khi đóng Phase 3 (trọng số phase 0–6: 5 / 15 / 15 / 25 / 15 / 15 / 10%).

Mọi phase do **Claude Code** thực hiện (model / effort do Owner chọn). Cuối mỗi phase ghi `docs/metrics/phase-<N>.md` theo `docs/COMPARISON.md`.

Mỗi phase = 1 GitHub Milestone; mỗi task = 1 Issue, cỡ theo P1 (ADR-0001 phụ lục): ≤ ~400 dòng code sản phẩm, ≤ ~800 dòng tổng diff kể cả test.

---

## 6. Rủi ro chính

| Rủi ro | Giảm thiểu |
|---|---|
| Context rot trong phiên dài (không subagent) | Một phiên cho mỗi task; `HANDOFF.md` + Issue là đầu vào; task nhỏ |
| Điểm mù khi tự review | Review ở phiên mới context sạch + checklist; CI/test chấp nhận/`dependency-cruiser` là trọng tài |
| Hạn mức Claude chạm trần giữa task | Owner tự cân đối (C8); commit nhỏ, `/handoff` bất cứ lúc nào |
| Chỉ số bị hiểu sai | Golden examples của Owner là test bắt buộc |
| Output AI vi phạm ranh giới | Validator deterministic + trạng thái REJECTED + bộ eval |
| Lệch môi trường 2 máy | `bootstrap.ps1`, phiên bản toolchain ghim trong repo, CI Windows là trọng tài |
| Nhiễm chéo với Project-2 | Quy tắc cách ly trong `docs/COMPARISON.md` |

---

## 7. Quyết định của Owner

**Kế thừa từ Project-2 (không đổi):**

1. **Q1** — ✅ *Đã trả lời 2026-09-26:* chỉ Owner dùng, trên Home PC hoặc Office Laptop. → App 1 người dùng, SQLite local, không server.
2. **Q2** — ✅ *Suy ra từ Q1:* không đăng nhập/phân quyền. "Vai trò" chỉ là **góc nhìn** (toàn bộ / theo team / theo RE), không phải tài khoản. Owner nhập liệu thay cho mọi RE.
   - **Q2b** — ✅ *Đã trả lời 2026-09-26:* có. Phương án **B + D** (xuất/nhập file backup + đồng bộ snapshot qua repo GitHub private **`Project-2C-data`**). Xem §7.1.
3. **Q3** — ~~Tử số đếm HĐ nộp; tử số và mẫu số lũy kế từ đầu (Q3c).~~ **Thay ở G2:** tỉ lệ chốt = HĐ phát hành ÷ RF trong cùng kỳ (ADR-0007).
4. **Q4** — RF = Refer. ~~Tính khi nâng nhóm và nhóm mới ≥ N3.~~ **Thay ở G2:** chỉ tính cuộc gặp đưa KH từ N4/N3 lên N2/N1 (ADR-0007).
5. **Q5** — ✅ Doanh số theo **ngày phát hành**.
6. **Q6** — ✅ Case size = **tổng** FYP HĐ đã nộp.
7. **Q7** — ✅ HĐ: `submitted → issued`. Nhóm KH được hạ; có Tạm hoãn / Mất cơ hội; sau submitted giữ nhóm + nhãn "Đã có HĐ" (xem §2.3).
8. **Q8** — ✅ Mâu thuẫn cốt lõi → chặn; mâu thuẫn phụ → gọi AI kèm cảnh báo.
9. **Q9** — ✅ Ghi chú + dữ kiện xác nhận; thiếu → không gọi LLM, trả "Cần chăm sóc, KYC thêm thông tin khách hàng".
10. **Q10** — ✅ Hoãn sang v2.
11. **Q11** — ✅ v1: OpenCode Go key + Mock.
12. **Q12** — ✅ Excel (.xlsx).
13. **Q13** — ✅ Tiếng Việt (thuật ngữ ngành giữ tiếng Anh).
14. **Q14** — ✅ Auto-merge task `risk:low`.
15. **Q15** — ✅ Tauri 2.
16. **Q16** — ✅ Lỗi soạn thảo: "RM" = RE, "Project-1" trong đoạn ranh giới AI = Project-2.

### 7.1 Q2b — Đồng bộ dữ liệu app giữa 2 máy

| Phương án | Cách làm | Ưu | Nhược |
|---|---|---|---|
| A. Chỉ dữ liệu seed | Mỗi máy tự sinh dữ liệu demo giống hệt nhau | Đơn giản nhất | Dữ liệu Owner nhập tay trên máy này không có ở máy kia |
| B. Xuất/nhập file thủ công | Nút "Xuất dữ liệu" → file `.p2backup` → mang sang máy kia → "Nhập" | Không phụ thuộc dịch vụ nào | Dễ quên → hai máy lệch nhau, có thể ghi đè nhầm |
| C. Thư mục dữ liệu trên OneDrive/Google Drive | Trỏ thư mục dữ liệu của app vào thư mục cloud | Tự động | **Không mở app đồng thời trên 2 máy** (SQLite trên thư mục đồng bộ dễ hỏng/xung đột) |
| D. Snapshot qua repo dữ liệu GitHub riêng (private) | App xuất snapshot JSON dạng text → commit/push vào repo `Project-2C-data`; mở app ở máy kia → pull → nhập | Cùng cơ chế GitHub Owner đã dùng; có lịch sử, xem được diff | Cần Git trên máy (đã có); làm thêm 1 tính năng |

**✅ Đã chốt: B + D.** Yêu cầu thiết kế kéo theo:

- Snapshot là **JSON dạng text, sắp xếp ổn định** (mỗi bảng 1 file, bản ghi theo ID) → diff đọc được, merge ít xung đột.
- Snapshot có `schema_version`; nhập snapshot cũ hơn → chạy migration; mới hơn → từ chối và yêu cầu cập nhật app.
- Khi mở app: phát hiện snapshot trên remote mới hơn dữ liệu local → hỏi Owner có kéo về không. Khi đóng app: hỏi có đẩy lên không.
- Phát hiện **xung đột** (cùng dữ liệu bị sửa trên cả 2 máy kể từ lần đồng bộ trước) → không tự ghi đè; hiện danh sách để Owner chọn.
- Repo `Project-2C-data` tách khỏi repo code (và tách khỏi `Project-2-data` của Project-2); app dùng Git sẵn có trên máy (không lưu token GitHub trong app).
- Thuộc Phase 3 (xuất/nhập) và Phase 6 (đồng bộ GitHub).

---

### 7.2 Quyết định riêng của Project-2C (Owner, 2026-09-26)

| # | Quyết định |
|---|---|
| C1 | Viết/review code **chỉ bằng Claude Code**. Không dùng OpenCode, Muse Code, Cursor, Codex cho phát triển. **Bổ sung 30/09/2026:** Codex được review độc lập khi đóng phase, không viết code (ADR-0001 M2). |
| C2 | AI trong sản phẩm **giống Project-2**: OpenCode Go + Mock. |
| C3 | **Không subagent.** Mọi task do **Claude Code** thực hiện trong phiên chính. Model và effort do Owner chọn từng phiên (ADR-0001 M1, 29/09/2026; trước đó Opus 5.5, effort medium). |
| C4 | Owner trao quyền tự động cho Claude trong mọi task, trừ các cổng cần Owner quyết định (G1–G8). |
| C5 | **Làm 2C trước**; xong 2C mới làm Project-2 (đa agent khác Claude). |
| C6 | Thiết kế UI **làm riêng** cho 2C, Owner duyệt riêng (G3). |
| C7 | Cách ly với Project-2 theo `docs/COMPARISON.md`. |
| C8 | Hạn mức dùng và thời gian chờ do Owner tự cân đối. |

---

## 8. Bước tiếp theo ngay

Bước chi tiết từng phiên: `docs/state/HANDOFF.md`. Thứ tự lớn (cập nhật 02/10/2026):

1. Phase 4 (mở 02/10, milestone "Phase 4 — Dashboard & báo cáo"): Đợt 2 của review đóng Phase 3 là #251–#259 — e2e local (#251) trước, rồi nhập backup lần 3 + luật nhân sự (#252); G2 Phase 4 (#253: đếm lịch, đếm KH theo nhóm, miền năm, chỉ số từng màn) và G3 mockup Tổng quan + Báo cáo (#254) trước màn dashboard.
