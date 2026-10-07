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
