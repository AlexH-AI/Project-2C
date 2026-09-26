# ADR-0015: CI — build exe theo nhu cầu, PR docs không chạy CI

- **Trạng thái:** Accepted (G1/G4, Owner duyệt 26/09/2026)
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
