# ADR-0005: Tech stack — Tauri 2 + React/TypeScript + SQLite (Drizzle)

- **Trạng thái:** Accepted (G1)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §0, §4.4 (Q15)
- **Commit / PR:** `20e9c5e` · PR: —

## Bối cảnh

Cần app desktop Windows x64 portable, UI dark mode chuyên nghiệp, được agent AI viết tốt.

## Quyết định

**Tauri 2 + React + TypeScript + Vite + Tailwind + shadcn/ui + SQLite (Drizzle)**, monorepo pnpm. Build ra 1 file `.exe` portable trên GitHub Actions (windows-latest). Lớp Rust giữ rất mỏng.

Thư viện đã định hướng: TanStack Table (bảng), ExcelJS (xuất Excel), zod (schema AI), Vitest + Playwright (test), `dependency-cruiser` (ranh giới module). Chart: ECharts hoặc Recharts — chốt ở Phase 1 theo mockup.

## Phương án đã cân nhắc

| | Tauri 2 | Electron | .NET WPF/WinUI/Avalonia |
|---|---|---|---|
| Kích thước portable | ~10–20 MB (WebView2 có sẵn trên Win11) | ~100 MB+, giải nén mỗi lần mở | ~70 MB self-contained |
| UI dark pro | Rất tốt | Rất tốt | Tốn công hơn |
| Nhược | Cần Rust toolchain trên 2 máy | Nặng, khởi động chậm | Hệ sinh thái UI/chart kém phong phú |

**Dự phòng:** Electron — chỉ thay lớp vỏ, lõi TS giữ nguyên.

## Lý do

Exe nhỏ, khởi động nhanh, hệ sinh thái React/TS mạnh cho UI và AI viết tốt.

## Hệ quả

- `bootstrap.ps1` phải cài Rust + VS Build Tools trên cả 2 máy.
- Mỗi dependency lớn mới ngoài danh sách trên cần G4.

## Phụ lục — phiên bản đã ghim

- **ExcelJS 4.4.0** (G4 Owner xác nhận 04/10/2026, T-114 #277): chỉ ở `apps/desktop`, ghim đúng phiên bản. Màn Báo cáo nạp thư viện khi bấm "Xuất Excel" lần đầu (`import()` động), nên nó nằm ở chunk riêng (~908 KB min, ~256 KB gzip) và không làm nặng lúc mở app.
- **Crate Rust `keyring` 4.x (chỉ kho Windows) + `ureq` 3.x** (G4 Owner chốt 07/10/2026, D-1): chỉ cho lệnh AI trong `apps/desktop/src-tauri`, ghim đúng phiên bản ở task đầu tiên dùng chúng. Chi tiết: phụ lục D-1 của ADR-0009.
  - **Ghim ở T-164 (#405), Owner chốt 08/10/2026:** `ureq` **3.4.2** (feature mặc định: rustls + webpki roots, gzip). Kho key dùng **`keyring-core` 1.0.0 + `windows-native-keyring-store` 1.1.0** (chỉ target Windows, tắt feature `search`) thay cho crate `keyring` 4.x: bản 4.x không biên dịch với `default-features = false` (bắt buộc feature `v1` hoặc `cli`), và tài liệu của nó khuyên app dùng thẳng `keyring-core` + crate kho. Cùng hệ sinh thái, cùng mục Credential Manager. Thêm **`serde` 1.0.229 (derive) + `serde_json` 1.0.151** làm dependency trực tiếp (G4): đọc JSON trả lời và trả lỗi `{ code, httpStatus?, message? }`; hai crate đã có sẵn trong bản build qua Tauri, ghim đúng bản Tauri đang kéo về.

## Phụ lục — bản cài Windows và bản macOS (12/11/2026, ADR-0019; T-451 #1326)

ADR-0019 (Accepted 12/11/2026, G1 / G4 / G6) thay một phần ADR này:

- **"Build ra 1 file `.exe` portable"** (Quyết định) và bối cảnh "app desktop Windows x64 portable": bản Windows phát hành là **bản cài NSIS theo người dùng** (`installMode` `currentUser`, không cần quyền admin; NSIS qua G4, Q9). Dữ liệu ở `%LOCALAPPDATA%\com.heritas.lcrm\`.
  - Giữ **chế độ portable**: exe chạy thẳng thấy thư mục `Project2C-data\` cạnh nó thì dùng thư mục đó.
  - CI vẫn build trên `windows-latest`: artifact `Project-2C-<sha>` có cả `project2c.exe` chạy thẳng lẫn file cài (`pnpm build:installer`, T-451).
- **Thêm bản macOS** cùng mã Tauri, phát hành cùng lúc: `.app` cho chip Apple, ký ad-hoc, đóng `.dmg` (Mac-3; dựng trên runner hỏng thì giữ zip) (ADR-0019 §1, §5, §7).
- **Phụ lục "phiên bản đã ghim", dòng kho key "(chỉ kho Windows)":** macOS dùng Keychain qua `apple-native-keyring-store` (ADR-0019 §4, G4 / G6). Mac-4 (#1329) ghim crate và thêm phụ lục vào D-1 của ADR-0009.
- Mã định danh của bản build đổi thành `com.heritas.lcrm` (ADR-0019 §2).
