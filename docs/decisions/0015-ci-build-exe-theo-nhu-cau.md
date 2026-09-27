# ADR-0015: CI — build exe theo nhu cầu, PR docs không chạy CI

- **Trạng thái:** Accepted (G1/G4, Owner duyệt 26/09/2026) · §1 thay bằng phụ lục Phase 3 (26/09/2026), rồi bằng phụ lục "Tiết kiệm phút Actions" (27/09/2026); §2–§3 còn hiệu lực
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §4.4 (CI); ADR-0001 (quy trình task, merge khi CI xanh)
- **Commit / PR:** PR sửa `.github/workflows/ci.yml` (nhánh `ci/exe-build-on-main`)

## Bối cảnh

Từ Phase 1, mọi PR chạy nối tiếp: Verify (lint, typecheck, unit, ranh giới, e2e) ≈ 2,5 phút rồi Build exe (Rust/Tauri) ≈ 4 phút — ≈ 6–7 phút chờ mỗi PR, kể cả PR chỉ sửa docs. Phase 2 chỉ sửa `packages/domain` và docs nên build exe ở PR gần như không bắt được lỗi gì mới. Owner thấy mất thời gian.

## Quyết định

1. **Build exe không chạy ở PR theo mặc định.** Chỉ chạy khi:
   - push lên `main` (mỗi lần merge vẫn có artifact `Project-2C-<sha>` để thử ở văn phòng);
   - PR có nhãn **`build-exe`**;
   - chạy tay (`workflow_dispatch`).
2. **PR chỉ sửa docs** (`docs/**`, `**/*.md`) không chạy CI. PR vừa docs vừa code vẫn chạy đủ.
3. **PR docs-only được merge không cần CI** (ngoại lệ của "không merge khi CI chưa xanh"); vẫn cần review nếu quy trình yêu cầu.

## Bắt buộc mở lại build exe

- PR đụng `apps/desktop/**` (UI, Tauri, `src-tauri`), `packages/ui/**`, `pnpm-lock.yaml`, `package.json`, `rust-toolchain.toml` hoặc Cargo → **gắn nhãn `build-exe`** trước khi coi CI là xanh.
- **Khi bắt đầu Phase 3** (nghiệp vụ & màn hình — UI và Tauri thay đổi liên tục): bỏ điều kiện `if` của job `build-exe` để build lại ở **mọi PR**, qua PR riêng, ghi vào ADR này (Superseded hoặc bổ sung).

## Phương án đã cân nhắc

- **Giữ nguyên** — an toàn nhất nhưng tốn ≈ 4 phút/PR không cần thiết ở Phase 2.
- **Lọc tự động theo đường dẫn** (vd. `dorny/paths-filter`) — thêm action bên thứ ba (G4) cho lợi ích nhỏ; nhãn + quy tắc là đủ trong lúc chưa làm UI.

## Hệ quả

- PR code ở Phase 2: ≈ 2,5 phút chờ CI; PR docs: 0.
- Build exe hỏng do PR không gắn nhãn chỉ lộ ra sau khi merge lên `main` → sửa bằng PR tiếp theo. Rủi ro thấp khi không đụng `apps/desktop`.
- Thêm/bớt nhãn trên PR (sự kiện `labeled`) sẽ chạy lại CI của PR đó.

## Phụ lục Phase 3 (26/09/2026)

Thực hiện mục "Khi bắt đầu Phase 3" ở trên (PR nhánh `ci/phase-3-exe-every-pr`):

- Bỏ điều kiện `if` của job `build-exe` → build exe chạy ở **mọi PR code** và mọi push lên `main`.
- Bỏ sự kiện `labeled` khỏi trigger `pull_request` (không còn cần nhãn để bật build; tránh chạy lại CI khi gắn nhãn khác).
- Nhãn `build-exe` giữ lại trên GitHub nhưng không còn tác dụng.
- §2, §3 (PR docs-only bỏ qua CI, merge không cần CI) **giữ nguyên**.

## Phụ lục: Tiết kiệm phút Actions (27/09/2026, G1, Owner duyệt)

Bối cảnh: repo private trên GitHub Free có 2.000 phút Actions/tháng; ngày 27/09 đã dùng hơn 1.800 phút. Mỗi lần CI chạy ≈ 12 phút trên runner Windows (Verify + e2e ≈ 7,5 phút, build exe ≈ 4 phút), mà mỗi task chạy 2 lần (PR + push lên `main` sau merge), cộng commit docs lên `main` (handoff) cũng chạy đủ. Owner chọn đồng thời: chuyển repo sang public (Owner tự làm; Actions miễn phí cho repo public) và giảm số phút như dưới đây. Thay phụ lục Phase 3:

- **Push lên `main` chỉ sửa docs** (`docs/**`, `**/*.md`) không chạy CI, như PR docs-only (§2).
- **Push lên `main`** bỏ Verify (PR đã Verify xanh trước khi merge), chỉ build exe → vẫn có artifact `Project-2C-<sha>` để thử ở văn phòng.
- **PR code** chạy Verify + e2e. Build exe chỉ khi PR có nhãn **`build-exe`** (hoặc chạy tay `workflow_dispatch`).
- **Bắt buộc gắn `build-exe`** khi PR đụng `apps/desktop/src-tauri/**`, Cargo, `rust-toolchain.toml`, `package.json`, `pnpm-lock.yaml` hoặc cấu hình build (`vite.config.*`, `tauri.conf.json`). Gắn nhãn ngay khi tạo PR (`gh pr create --label build-exe`): trigger không nghe sự kiện `labeled`, nên gắn sau thì phải push thêm hoặc `gh pr close` + `gh pr reopen` để CI chạy lại.
- **Run của `main` không hủy nhau** (T-062, #110): `cancel-in-progress` chỉ bật cho `pull_request`; push lên `main` có nhóm `concurrency` riêng theo SHA (GitHub bỏ cả run đang *chờ* trong cùng nhóm), nên mỗi commit merge đều có artifact `Project-2C-<sha>`. PR vẫn hủy run cũ khi có push mới.

Hệ quả:

- ≈ 23 phút tính phí mỗi task thay vì ≈ 48 (Windows tính gấp đôi); commit docs lên `main`: 0.
- Nếu PR merge khi `main` đã đi tiếp, tổ hợp sau merge không được Verify lại trên CI; lỗi lộ ra ở PR kế tiếp hoặc khi chạy `pnpm verify` local. Rủi ro thấp vì mỗi task một nhánh mới từ `main`.
- Lỗi build exe ở PR không gắn nhãn chỉ lộ ra ở build trên `main` → sửa bằng PR tiếp theo.
